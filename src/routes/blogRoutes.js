import express from 'express';
import { getBlogs, importBlog, updateBlogStats, searchBlogs } from '../controllers/blogController.js';

const router = express.Router();

router.get('/', getBlogs);
router.post('/import', importBlog);
router.put('/:id/stats', updateBlogStats);
router.get('/search', searchBlogs);

export default router; 