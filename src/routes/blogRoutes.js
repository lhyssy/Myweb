import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    getBlogs,
    importBlog,
    updateBlogStats,
    searchBlogs
} from '../controllers/blogController.js';

const router = express.Router();

// 公开路由
router.get('/', getBlogs);
router.get('/search', searchBlogs);

// 需要认证的路由
router.use(protect);
router.post('/import', importBlog);
router.put('/:id/stats', updateBlogStats);

export default router; 