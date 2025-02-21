import express from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import { protect } from '../middleware/auth.js';
import {
    getProfile,
    updateProfile,
    uploadAvatar,
    uploadCoverImage,
    updateEducation,
    deleteEducation,
    updateWork,
    deleteWork,
    updateAchievement,
    deleteAchievement,
    updatePreferences,
    updateVisibility
} from '../controllers/profileController.js';

const router = express.Router();

// 文件上传配置
const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('只允许上传图片文件'));
        }
        cb(null, true);
    }
});

// 基本信息验证规则
const profileValidation = [
    body('nickname')
        .optional()
        .trim()
        .isLength({ max: 30 })
        .withMessage('昵称不能超过30个字符'),
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('个人简介不能超过200个字符'),
    body('location')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('地址不能超过100个字符'),
    body('website')
        .optional()
        .trim()
        .isURL()
        .withMessage('请提供有效的网站链接'),
    body('social.github')
        .optional()
        .trim()
        .matches(/^https:\/\/github\.com\/[\w-]+$/)
        .withMessage('请提供有效的GitHub个人主页链接'),
    body('social.twitter')
        .optional()
        .trim()
        .matches(/^https:\/\/twitter\.com\/[\w-]+$/)
        .withMessage('请提供有效的Twitter个人主页链接'),
    body('social.linkedin')
        .optional()
        .trim()
        .matches(/^https:\/\/www\.linkedin\.com\/in\/[\w-]+$/)
        .withMessage('请提供有效的LinkedIn个人主页链接'),
    body('social.weibo')
        .optional()
        .trim()
        .matches(/^https:\/\/weibo\.com\/[\w-]+$/)
        .withMessage('请提供有效的微博个人主页链接')
];

// 教育经历验证规则
const educationValidation = [
    body('school')
        .notEmpty()
        .withMessage('学校名称不能为空')
        .trim(),
    body('degree')
        .notEmpty()
        .withMessage('学位不能为空')
        .trim(),
    body('field')
        .notEmpty()
        .withMessage('专业领域不能为空')
        .trim(),
    body('startYear')
        .notEmpty()
        .withMessage('开始年份不能为空')
        .isInt({ min: 1900, max: new Date().getFullYear() })
        .withMessage('请提供有效的开始年份'),
    body('endYear')
        .optional({ nullable: true })
        .isInt({ min: 1900, max: new Date().getFullYear() + 10 })
        .withMessage('请提供有效的结束年份')
        .custom((value, { req }) => {
            if (value && value < req.body.startYear) {
                throw new Error('结束年份必须大于开始年份');
            }
            return true;
        })
];

// 工作经历验证规则
const workValidation = [
    body('company')
        .notEmpty()
        .withMessage('公司名称不能为空')
        .trim(),
    body('position')
        .notEmpty()
        .withMessage('职位不能为空')
        .trim(),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('工作描述不能超过500个字符'),
    body('startDate')
        .notEmpty()
        .withMessage('开始日期不能为空')
        .isISO8601()
        .withMessage('请提供有效的开始日期'),
    body('endDate')
        .optional({ nullable: true })
        .isISO8601()
        .withMessage('请提供有效的结束日期')
        .custom((value, { req }) => {
            if (value && new Date(value) < new Date(req.body.startDate)) {
                throw new Error('结束日期必须晚于开始日期');
            }
            return true;
        })
];

// 成就验证规则
const achievementValidation = [
    body('title')
        .notEmpty()
        .withMessage('成就标题不能为空')
        .trim(),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('成就描述不能超过500个字符'),
    body('date')
        .notEmpty()
        .withMessage('获得日期不能为空')
        .isISO8601()
        .withMessage('请提供有效的日期'),
    body('url')
        .optional()
        .trim()
        .isURL()
        .withMessage('请提供有效的URL')
];

// 偏好设置验证规则
const preferencesValidation = [
    body('emailNotifications')
        .optional()
        .isBoolean()
        .withMessage('邮件通知设置必须是布尔值'),
    body('newsletter')
        .optional()
        .isBoolean()
        .withMessage('订阅通讯设置必须是布尔值'),
    body('theme')
        .optional()
        .isIn(['light', 'dark', 'system'])
        .withMessage('无效的主题设置'),
    body('language')
        .optional()
        .isIn(['zh', 'en'])
        .withMessage('无效的语言设置')
];

// 隐私设置验证规则
const visibilityValidation = [
    body('email')
        .optional()
        .isIn(['public', 'private'])
        .withMessage('无效的邮箱可见性设置'),
    body('location')
        .optional()
        .isIn(['public', 'private'])
        .withMessage('无效的地址可见性设置'),
    body('education')
        .optional()
        .isIn(['public', 'private'])
        .withMessage('无效的教育经历可见性设置'),
    body('work')
        .optional()
        .isIn(['public', 'private'])
        .withMessage('无效的工作经历可见性设置')
];

// 路由
router.use(protect); // 所有路由都需要认证

router.get('/', getProfile);
router.patch('/', profileValidation, updateProfile);

// 文件上传路由
router.post('/avatar', upload.single('avatar'), uploadAvatar);
router.post('/cover', upload.single('cover'), uploadCoverImage);

// 教育经历路由
router.post('/education', educationValidation, updateEducation);
router.patch('/education/:id', educationValidation, updateEducation);
router.delete('/education/:id', deleteEducation);

// 工作经历路由
router.post('/work', workValidation, updateWork);
router.patch('/work/:id', workValidation, updateWork);
router.delete('/work/:id', deleteWork);

// 成就路由
router.post('/achievements', achievementValidation, updateAchievement);
router.patch('/achievements/:id', achievementValidation, updateAchievement);
router.delete('/achievements/:id', deleteAchievement);

// 设置路由
router.patch('/preferences', preferencesValidation, updatePreferences);
router.patch('/visibility', visibilityValidation, updateVisibility);

export default router; 