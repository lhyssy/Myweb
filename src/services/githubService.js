import fetch from 'node-fetch';

class GitHubService {
    constructor() {
        this.baseUrl = 'https://api.github.com';
        this.headers = {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `token ${process.env.GITHUB_TOKEN}`
        };
    }

    // 从GitHub URL中提取用户名和仓库名
    extractRepoInfo(githubUrl) {
        const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
        if (!match) {
            throw new Error('无效的GitHub URL');
        }
        return {
            owner: match[1],
            repo: match[2]
        };
    }

    // 获取仓库基本信息
    async getRepository(githubUrl) {
        try {
            const { owner, repo } = this.extractRepoInfo(githubUrl);
            const response = await fetch(
                `${this.baseUrl}/repos/${owner}/${repo}`,
                { headers: this.headers }
            );

            if (!response.ok) {
                throw new Error(`GitHub API 请求失败: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('获取仓库信息错误:', error);
            throw error;
        }
    }

    // 获取仓库贡献者信息
    async getContributors(githubUrl) {
        try {
            const { owner, repo } = this.extractRepoInfo(githubUrl);
            const response = await fetch(
                `${this.baseUrl}/repos/${owner}/${repo}/contributors`,
                { headers: this.headers }
            );

            if (!response.ok) {
                throw new Error(`GitHub API 请求失败: ${response.statusText}`);
            }

            const contributors = await response.json();
            return contributors.map(contributor => ({
                username: contributor.login,
                avatarUrl: contributor.avatar_url,
                profileUrl: contributor.html_url,
                contributions: contributor.contributions
            }));
        } catch (error) {
            console.error('获取贡献者信息错误:', error);
            throw error;
        }
    }

    // 获取仓库语言统计
    async getLanguages(githubUrl) {
        try {
            const { owner, repo } = this.extractRepoInfo(githubUrl);
            const response = await fetch(
                `${this.baseUrl}/repos/${owner}/${repo}/languages`,
                { headers: this.headers }
            );

            if (!response.ok) {
                throw new Error(`GitHub API 请求失败: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('获取语言统计错误:', error);
            throw error;
        }
    }

    // 获取最新提交
    async getLatestCommits(githubUrl, limit = 5) {
        try {
            const { owner, repo } = this.extractRepoInfo(githubUrl);
            const response = await fetch(
                `${this.baseUrl}/repos/${owner}/${repo}/commits?per_page=${limit}`,
                { headers: this.headers }
            );

            if (!response.ok) {
                throw new Error(`GitHub API 请求失败: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('获取最新提交错误:', error);
            throw error;
        }
    }

    // 获取README内容
    async getReadme(githubUrl) {
        try {
            const { owner, repo } = this.extractRepoInfo(githubUrl);
            const response = await fetch(
                `${this.baseUrl}/repos/${owner}/${repo}/readme`,
                { headers: { ...this.headers, 'Accept': 'application/vnd.github.v3.raw' } }
            );

            if (!response.ok) {
                throw new Error(`GitHub API 请求失败: ${response.statusText}`);
            }

            return await response.text();
        } catch (error) {
            console.error('获取README内容错误:', error);
            throw error;
        }
    }

    // 同步项目信息
    async syncProjectData(githubUrl) {
        try {
            const [repo, contributors, languages] = await Promise.all([
                this.getRepository(githubUrl),
                this.getContributors(githubUrl),
                this.getLanguages(githubUrl)
            ]);

            return {
                title: repo.name,
                description: repo.description,
                githubUrl: repo.html_url,
                demoUrl: repo.homepage,
                stats: {
                    stars: repo.stargazers_count,
                    forks: repo.forks_count,
                    watchers: repo.watchers_count,
                    issues: repo.open_issues_count
                },
                contributors,
                technologies: Object.keys(languages),
                license: repo.license?.spdx_id || 'None',
                visibility: repo.private ? 'private' : 'public',
                lastSync: new Date(),
                startDate: new Date(repo.created_at),
                endDate: repo.archived ? new Date(repo.updated_at) : null,
                status: repo.archived ? 'archived' : 'completed'
            };
        } catch (error) {
            console.error('同步项目数据错误:', error);
            throw error;
        }
    }

    // 获取用户的GitHub仓库列表
    async getUserRepositories() {
        try {
            const response = await fetch(
                `${this.baseUrl}/user/repos?sort=updated&per_page=100`,
                { headers: this.headers }
            );

            if (!response.ok) {
                throw new Error(`GitHub API 请求失败: ${response.statusText}`);
            }

            const repos = await response.json();
            return repos.map(repo => ({
                title: repo.name,
                description: repo.description || '',
                githubUrl: repo.html_url,
                demoUrl: repo.homepage || '',
                stars: repo.stargazers_count,
                technologies: [], // 将通过getLanguages填充
                category: this.determineCategory(repo),
                status: repo.archived ? 'archived' : 'completed',
                visibility: repo.private ? 'private' : 'public',
                createdAt: repo.created_at,
                updatedAt: repo.updated_at,
                stats: {
                    stars: repo.stargazers_count,
                    forks: repo.forks_count,
                    watchers: repo.watchers_count,
                    issues: repo.open_issues_count
                }
            }));
        } catch (error) {
            console.error('获取GitHub仓库列表失败:', error);
            throw error;
        }
    }

    // 根据仓库特征确定项目类别
    determineCategory(repo) {
        const name = repo.name.toLowerCase();
        const topics = repo.topics || [];
        const description = (repo.description || '').toLowerCase();

        if (topics.includes('web') || name.includes('web') || description.includes('website')) {
            return 'web';
        }
        if (topics.includes('mobile') || name.includes('app') || description.includes('mobile')) {
            return 'mobile';
        }
        if (topics.includes('desktop') || description.includes('desktop')) {
            return 'desktop';
        }
        if (topics.includes('library') || name.includes('lib') || description.includes('library')) {
            return 'library';
        }
        return 'other';
    }

    // 同步所有GitHub项目
    async syncAllProjects() {
        try {
            const repos = await this.getUserRepositories();
            const projectsWithDetails = await Promise.all(
                repos.map(async (repo) => {
                    try {
                        // 获取语言统计
                        const languages = await this.getLanguages(repo.githubUrl);
                        repo.technologies = Object.keys(languages);

                        // 获取贡献者信息
                        const contributors = await this.getContributors(repo.githubUrl);
                        repo.contributors = contributors;

                        // 获取README
                        const readme = await this.getReadme(repo.githubUrl);
                        repo.readme = readme;

                        return repo;
                    } catch (error) {
                        console.error(`同步项目 ${repo.title} 详情失败:`, error);
                        return repo;
                    }
                })
            );

            return projectsWithDetails;
        } catch (error) {
            console.error('同步GitHub项目失败:', error);
            throw error;
        }
    }
}

export default new GitHubService(); 