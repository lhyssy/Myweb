import express from 'express';
import { body } from 'express-validator';
import { protect, restrictTo } from '../middleware/auth.js';
import {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';

const router = express.Router();

// 分类验证规则
const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('分类名称不能为空')
    .isLength({ max: 50 })
    .withMessage('分类名称不能超过50个字符'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('分类描述不能超过200个字符')
];

// 公开路由
router.get('/', getAllCategories);
router.get('/:slug', getCategory);

// 需要管理员权限的路由
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', categoryValidation, createCategory);
router.patch('/:id', categoryValidation, updateCategory);
router.delete('/:id', deleteCategory);

export default router; 