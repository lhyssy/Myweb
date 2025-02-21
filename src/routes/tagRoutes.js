import express from 'express';
import { body } from 'express-validator';
import { protect, restrictTo } from '../middleware/auth.js';
import {
  createTag,
  getAllTags,
  getTag,
  updateTag,
  deleteTag,
  createTags
} from '../controllers/tagController.js';

const router = express.Router();

// 标签验证规则
const tagValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('标签名称不能为空')
    .isLength({ max: 30 })
    .withMessage('标签名称不能超过30个字符'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('标签描述不能超过100个字符'),
  body('color')
    .optional()
    .trim()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('颜色格式必须为有效的十六进制颜色代码')
];

// 批量创建标签验证规则
const batchTagValidation = [
  body('tags')
    .isArray()
    .withMessage('tags必须是一个数组')
    .notEmpty()
    .withMessage('tags不能为空数组'),
  body('tags.*.name')
    .trim()
    .notEmpty()
    .withMessage('标签名称不能为空')
    .isLength({ max: 30 })
    .withMessage('标签名称不能超过30个字符'),
  body('tags.*.description')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('标签描述不能超过100个字符'),
  body('tags.*.color')
    .optional()
    .trim()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage('颜色格式必须为有效的十六进制颜色代码')
];

// 公开路由
router.get('/', getAllTags);
router.get('/:slug', getTag);

// 需要管理员权限的路由
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', tagValidation, createTag);
router.post('/batch', batchTagValidation, createTags);
router.patch('/:id', tagValidation, updateTag);
router.delete('/:id', deleteTag);

export default router; 