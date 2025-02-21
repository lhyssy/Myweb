import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.js';
import {
  createComment,
  getBlogComments,
  updateComment,
  deleteComment,
  toggleCommentLike
} from '../controllers/commentController.js';

const router = express.Router();

// 评论验证规则
const commentValidation = [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('评论内容不能为空')
    .isLength({ max: 1000 })
    .withMessage('评论内容不能超过1000个字符'),
  body('blogId')
    .notEmpty()
    .withMessage('博客ID不能为空')
];

// 评论路由
router.post('/', protect, commentValidation, createComment);
router.get('/blog/:blogId', getBlogComments);
router.patch('/:id', protect, [
  body('content')
    .trim()
    .notEmpty()
    .withMessage('评论内容不能为空')
    .isLength({ max: 1000 })
    .withMessage('评论内容不能超过1000个字符')
], updateComment);
router.delete('/:id', protect, deleteComment);
router.post('/:id/like', protect, toggleCommentLike);

export default router; 