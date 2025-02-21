import express from 'express';
import { body } from 'express-validator';
import { register, login, getCurrentUser } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// 注册验证规则
const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('用户名长度必须在3-20个字符之间'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('请输入有效的邮箱地址'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('密码长度至少为6个字符')
];

// 登录验证规则
const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('请输入有效的邮箱地址'),
  body('password')
    .exists()
    .withMessage('请输入密码')
];

// 路由
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', protect, getCurrentUser);

export default router; 