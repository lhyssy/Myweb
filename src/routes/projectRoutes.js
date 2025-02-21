import express from 'express';
import { body } from 'express-validator';
import { protect, restrictTo } from '../middleware/auth.js';
import {
    createProject,
    getAllProjects,
    getProject,
    updateProject,
    deleteProject,
    syncGithubData,
    syncAllGithubData
} from '../controllers/projectController.js';

const router = express.Router();

// 项目验证规则
const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('项目名称不能为空')
        .isLength({ max: 100 })
        .withMessage('项目名称不能超过100个字符'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('项目描述不能为空')
        .isLength({ max: 500 })
        .withMessage('项目描述不能超过500个字符'),
    body('content')
        .trim()
        .notEmpty()
        .withMessage('项目详细内容不能为空'),
    body('githubUrl')
        .optional()
        .trim()
        .matches(/^https:\/\/github\.com\/[\w-]+\/[\w-]+/)
        .withMessage('请提供有效的GitHub仓库链接'),
    body('demoUrl')
        .optional()
        .trim()
        .isURL()
        .withMessage('请提供有效的演示链接'),
    body('category')
        .notEmpty()
        .withMessage('请选择项目类别')
        .isIn(['web-application', 'mobile-app', 'desktop-app', 'library', 'tool', 'api', 'game', 'other'])
        .withMessage('无效的项目类别'),
    body('technologies')
        .optional()
        .isArray()
        .withMessage('技术栈必须是数组格式'),
    body('tags')
        .optional()
        .isArray()
        .withMessage('标签必须是数组格式'),
    body('status')
        .optional()
        .isIn(['in-progress', 'completed', 'archived'])
        .withMessage('无效的项目状态'),
    body('startDate')
        .notEmpty()
        .withMessage('请设置项目开始时间')
        .isISO8601()
        .withMessage('请提供有效的日期格式')
];

// 公开路由
router.get('/', getAllProjects);
router.get('/:slug', getProject);

// 需要管理员权限的路由
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', projectValidation, createProject);
router.patch('/:id', projectValidation, updateProject);
router.delete('/:id', deleteProject);
router.post('/:id/sync', syncGithubData);
router.post('/sync/all', syncAllGithubData);

export default router; 