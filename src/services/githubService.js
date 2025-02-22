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
}

export default new GitHubService(); 