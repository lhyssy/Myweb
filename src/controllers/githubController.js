import Project from '../models/Project.js';
import githubService from '../services/githubService.js';

// 同步GitHub项目
export const syncGithubProjects = async (req, res) => {
    try {
        // 获取GitHub项目列表
        const githubProjects = await githubService.syncAllProjects();

        // 更新或创建项目
        const results = await Promise.all(
            githubProjects.map(async (githubProject) => {
                try {
                    // 查找是否已存在该项目
                    let project = await Project.findOne({ githubUrl: githubProject.githubUrl });

                    if (project) {
                        // 更新现有项目
                        Object.assign(project, githubProject);
                        await project.save();
                        return {
                            status: 'updated',
                            title: project.title
                        };
                    } else {
                        // 创建新项目
                        project = new Project(githubProject);
                        await project.save();
                        return {
                            status: 'created',
                            title: project.title
                        };
                    }
                } catch (error) {
                    return {
                        status: 'error',
                        title: githubProject.title,
                        error: error.message
                    };
                }
            })
        );

        // 统计同步结果
        const stats = {
            total: results.length,
            created: results.filter(r => r.status === 'created').length,
            updated: results.filter(r => r.status === 'updated').length,
            failed: results.filter(r => r.status === 'error').length
        };

        res.json({
            message: '同步完成',
            stats,
            results
        });
    } catch (error) {
        console.error('同步GitHub项目失败:', error);
        res.status(500).json({
            message: '同步GitHub项目失败',
            error: error.message
        });
    }
};

// 获取GitHub项目统计信息
export const getGithubStats = async (req, res) => {
    try {
        const stats = await Project.aggregate([
            {
                $match: { githubUrl: { $exists: true } }
            },
            {
                $group: {
                    _id: null,
                    totalProjects: { $sum: 1 },
                    totalStars: { $sum: '$stats.stars' },
                    totalForks: { $sum: '$stats.forks' },
                    totalWatchers: { $sum: '$stats.watchers' }
                }
            }
        ]);

        const technologies = await Project.aggregate([
            {
                $match: { githubUrl: { $exists: true } }
            },
            {
                $unwind: '$technologies'
            },
            {
                $group: {
                    _id: '$technologies',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $limit: 10
            }
        ]);

        res.json({
            stats: stats[0] || {
                totalProjects: 0,
                totalStars: 0,
                totalForks: 0,
                totalWatchers: 0
            },
            topTechnologies: technologies.map(tech => ({
                name: tech._id,
                count: tech.count
            }))
        });
    } catch (error) {
        console.error('获取GitHub统计信息失败:', error);
        res.status(500).json({
            message: '获取GitHub统计信息失败',
            error: error.message
        });
    }
}; 