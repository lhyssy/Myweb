import Project from '../models/Project.js';

// 获取所有项目
export const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ isVisible: true })
            .sort({ order: 1 });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 获取单个项目详情
export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: '项目不存在' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 添加新项目
export const createProject = async (req, res) => {
    try {
        const project = new Project(req.body);
        const savedProject = await project.save();
        res.status(201).json(savedProject);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 更新项目信息
export const updateProject = async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!project) {
            return res.status(404).json({ message: '项目不存在' });
        }
        res.json(project);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}; 