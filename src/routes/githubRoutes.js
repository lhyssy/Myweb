import express from 'express';
import { protect } from '../middleware/auth.js';
import { syncGithubProjects, getGithubStats } from '../controllers/githubController.js';

const router = express.Router();

// 需要认证的路由
router.use(protect);

// 同步GitHub项目
router.post('/sync', syncGithubProjects);

// 获取GitHub统计信息
router.get('/stats', getGithubStats);

export default router; 