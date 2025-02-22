import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { getBlogs, importBlog, updateBlogStats, searchBlogs } from '../controllers/blogController.js';

const router = express.Router();

// 博客导入验证规则
const importValidation = [
    body('url')
        .trim()
        .notEmpty()
        .withMessage('文章链接不能为空')
        .isURL()
        .withMessage('请提供有效的文章链接'),
    body('platform')
        .optional()
        .isIn(['CSDN', 'GitHub', 'Personal', 'Other'])
        .withMessage('无效的平台类型')
];

// 公开路由
router.get('/', getBlogs);
router.get('/search', searchBlogs);

// 需要认证的路由
router.use(protect);

// 导入文章
router.post('/import', importValidation, importBlog);

// 更新统计信息
router.put('/:id/stats', [
    body('type')
        .isIn(['view', 'like', 'collect', 'share'])
        .withMessage('无效的统计类型')
], updateBlogStats);

export default router; 