import { validationResult } from 'express-validator';
import Project from '../models/Project.js';
import githubService from '../services/githubService.js';

// 获取所有项目
export const getAllProjects = async (req, res) => {
    try {
        const { 
            category,
            technology,
            status,
            featured,
            search,
            sort = '-createdAt',
            page = 1,
            limit = 10
        } = req.query;

        // 构建查询条件
        const query = {};
        if (category) query.category = category;
        if (technology) query.technologies = technology;
        if (status) query.status = status;
        if (featured) query.featured = featured === 'true';
        if (search) {
            query.$text = { $search: search };
        }

        // 计算分页
        const skip = (page - 1) * limit;

        // 执行查询
        const projects = await Project.find(query)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit));

        // 获取总数
        const total = await Project.countDocuments(query);

        res.json({
            projects,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('获取项目列表错误:', error);
        res.status(500).json({ message: '获取项目列表时发生错误' });
    }
};

// 获取单个项目
export const getProject = async (req, res) => {
    try {
        const { slug } = req.params;
        const project = await Project.findOne({ slug });

        if (!project) {
            return res.status(404).json({ message: '项目不存在' });
        }

        res.json({ project });
    } catch (error) {
        console.error('获取项目详情错误:', error);
        res.status(500).json({ message: '获取项目详情时发生错误' });
    }
};

// 创建项目
export const createProject = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const projectData = req.body;

        // 如果提供了GitHub URL，从GitHub获取额外信息
        if (projectData.githubUrl) {
            try {
                const githubData = await githubService.syncProjectData(projectData.githubUrl);
                projectData = { ...projectData, ...githubData };
            } catch (error) {
                console.error('GitHub数据同步错误:', error);
                // 继续创建项目，但使用用户提供的数据
            }
        }

        const project = await Project.create(projectData);

        res.status(201).json({
            message: '项目创建成功',
            project
        });
    } catch (error) {
        console.error('创建项目错误:', error);
        res.status(500).json({ message: '创建项目时发生错误' });
    }
};

// 更新项目
export const updateProject = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        let updateData = req.body;

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: '项目不存在' });
        }

        // 如果GitHub URL发生变化，重新同步数据
        if (updateData.githubUrl && updateData.githubUrl !== project.githubUrl) {
            try {
                const githubData = await githubService.syncProjectData(updateData.githubUrl);
                updateData = { ...updateData, ...githubData };
            } catch (error) {
                console.error('GitHub数据同步错误:', error);
                // 继续更新项目，但使用用户提供的数据
            }
        }

        // 更新项目
        Object.assign(project, updateData);
        await project.save();

        res.json({
            message: '项目更新成功',
            project
        });
    } catch (error) {
        console.error('更新项目错误:', error);
        res.status(500).json({ message: '更新项目时发生错误' });
    }
};

// 删除项目
export const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ message: '项目不存在' });
        }

        await project.deleteOne();

        res.json({ message: '项目删除成功' });
    } catch (error) {
        console.error('删除项目错误:', error);
        res.status(500).json({ message: '删除项目时发生错误' });
    }
};

// 同步GitHub数据
export const syncGithubData = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ message: '项目不存在' });
        }

        if (!project.githubUrl) {
            return res.status(400).json({ message: '该项目没有关联的GitHub仓库' });
        }

        const githubData = await githubService.syncProjectData(project.githubUrl);
        Object.assign(project, githubData);
        await project.save();

        res.json({
            message: 'GitHub数据同步成功',
            project
        });
    } catch (error) {
        console.error('同步GitHub数据错误:', error);
        res.status(500).json({ message: '同步GitHub数据时发生错误' });
    }
};

// 批量同步GitHub数据
export const syncAllGithubData = async (req, res) => {
    try {
        const projects = await Project.find({ githubUrl: { $exists: true } });
        
        const results = await Promise.allSettled(
            projects.map(async (project) => {
                try {
                    const githubData = await githubService.syncProjectData(project.githubUrl);
                    Object.assign(project, githubData);
                    await project.save();
                    return {
                        id: project._id,
                        status: 'success'
                    };
                } catch (error) {
                    return {
                        id: project._id,
                        status: 'error',
                        error: error.message
                    };
                }
            })
        );

        res.json({
            message: '批量同步完成',
            results
        });
    } catch (error) {
        console.error('批量同步GitHub数据错误:', error);
        res.status(500).json({ message: '批量同步GitHub数据时发生错误' });
    }
}; 