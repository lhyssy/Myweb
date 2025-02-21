import { validationResult } from 'express-validator';
import UserProfile from '../models/UserProfile.js';
import uploadService from '../services/uploadService.js';

// 获取用户个人资料
export const getProfile = async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ user: req.user.id })
            .populate('user', 'username email');

        if (!profile) {
            return res.status(404).json({ message: '个人资料不存在' });
        }

        res.json({ profile });
    } catch (error) {
        console.error('获取个人资料错误:', error);
        res.status(500).json({ message: '获取个人资料时发生错误' });
    }
};

// 创建或更新用户个人资料
export const updateProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const profileData = req.body;
        let profile = await UserProfile.findOne({ user: req.user.id });

        if (profile) {
            // 更新现有资料
            Object.assign(profile, profileData);
        } else {
            // 创建新资料
            profile = new UserProfile({
                user: req.user.id,
                ...profileData
            });
        }

        await profile.save();
        res.json({
            message: '个人资料更新成功',
            profile
        });
    } catch (error) {
        console.error('更新个人资料错误:', error);
        res.status(500).json({ message: '更新个人资料时发生错误' });
    }
};

// 上传头像
export const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: '请选择要上传的头像' });
        }

        const profile = await UserProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ message: '个人资料不存在' });
        }

        // 如果存在旧头像，先删除
        if (profile.avatar?.publicId) {
            await uploadService.deleteImage(profile.avatar.publicId);
        }

        // 上传新头像
        const avatar = await uploadService.uploadAvatar(req.file);
        profile.avatar = avatar;
        await profile.save();

        res.json({
            message: '头像上传成功',
            avatar
        });
    } catch (error) {
        console.error('头像上传错误:', error);
        res.status(500).json({ message: '头像上传时发生错误' });
    }
};

// 上传封面图片
export const uploadCoverImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: '请选择要上传的封面图片' });
        }

        const profile = await UserProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ message: '个人资料不存在' });
        }

        // 如果存在旧封面图片，先删除
        if (profile.coverImage?.publicId) {
            await uploadService.deleteImage(profile.coverImage.publicId);
        }

        // 上传新封面图片
        const coverImage = await uploadService.uploadCoverImage(req.file);
        profile.coverImage = coverImage;
        await profile.save();

        res.json({
            message: '封面图片上传成功',
            coverImage
        });
    } catch (error) {
        console.error('封面图片上传错误:', error);
        res.status(500).json({ message: '封面图片上传时发生错误' });
    }
};

// 更新教育经历
export const updateEducation = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const profile = await UserProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ message: '个人资料不存在' });
        }

        const { id } = req.params;
        const educationData = req.body;

        if (id) {
            // 更新现有教育经历
            const eduIndex = profile.education.findIndex(edu => edu._id.toString() === id);
            if (eduIndex === -1) {
                return res.status(404).json({ message: '教育经历不存在' });
            }
            profile.education[eduIndex] = { ...profile.education[eduIndex], ...educationData };
        } else {
            // 添加新教育经历
            profile.education.push(educationData);
        }

        await profile.save();
        res.json({
            message: '教育经历更新成功',
            education: profile.education
        });
    } catch (error) {
        console.error('更新教育经历错误:', error);
        res.status(500).json({ message: '更新教育经历时发生错误' });
    }
};

// 删除教育经历
export const deleteEducation = async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ message: '个人资料不存在' });
        }

        const { id } = req.params;
        profile.education = profile.education.filter(edu => edu._id.toString() !== id);
        await profile.save();

        res.json({
            message: '教育经历删除成功',
            education: profile.education
        });
    } catch (error) {
        console.error('删除教育经历错误:', error);
        res.status(500).json({ message: '删除教育经历时发生错误' });
    }
};

// 更新工作经历
export const updateWork = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const profile = await UserProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ message: '个人资料不存在' });
        }

        const { id } = req.params;
        const workData = req.body;

        if (id) {
            // 更新现有工作经历
            const workIndex = profile.work.findIndex(w => w._id.toString() === id);
            if (workIndex === -1) {
                return res.status(404).json({ message: '工作经历不存在' });
            }
            profile.work[workIndex] = { ...profile.work[workIndex], ...workData };
        } else {
            // 添加新工作经历
            profile.work.push(workData);
        }

        await profile.save();
        res.json({
            message: '工作经历更新成功',
            work: profile.work
        });
    } catch (error) {
        console.error('更新工作经历错误:', error);
        res.status(500).json({ message: '更新工作经历时发生错误' });
    }
};

// 删除工作经历
export const deleteWork = async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ message: '个人资料不存在' });
        }

        const { id } = req.params;
        profile.work = profile.work.filter(w => w._id.toString() !== id);
        await profile.save();

        res.json({
            message: '工作经历删除成功',
            work: profile.work
        });
    } catch (error) {
        console.error('删除工作经历错误:', error);
        res.status(500).json({ message: '删除工作经历时发生错误' });
    }
};

// 更新成就
export const updateAchievement = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const profile = await UserProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ message: '个人资料不存在' });
        }

        const { id } = req.params;
        const achievementData = req.body;

        if (id) {
            // 更新现有成就
            const achieveIndex = profile.achievements.findIndex(a => a._id.toString() === id);
            if (achieveIndex === -1) {
                return res.status(404).json({ message: '成就不存在' });
            }
            profile.achievements[achieveIndex] = { ...profile.achievements[achieveIndex], ...achievementData };
        } else {
            // 添加新成就
            profile.achievements.push(achievementData);
        }

        await profile.save();
        res.json({
            message: '成就更新成功',
            achievements: profile.achievements
        });
    } catch (error) {
        console.error('更新成就错误:', error);
        res.status(500).json({ message: '更新成就时发生错误' });
    }
};

// 删除成就
export const deleteAchievement = async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ message: '个人资料不存在' });
        }

        const { id } = req.params;
        profile.achievements = profile.achievements.filter(a => a._id.toString() !== id);
        await profile.save();

        res.json({
            message: '成就删除成功',
            achievements: profile.achievements
        });
    } catch (error) {
        console.error('删除成就错误:', error);
        res.status(500).json({ message: '删除成就时发生错误' });
    }
};

// 更新偏好设置
export const updatePreferences = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const profile = await UserProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ message: '个人资料不存在' });
        }

        profile.preferences = { ...profile.preferences, ...req.body };
        await profile.save();

        res.json({
            message: '偏好设置更新成功',
            preferences: profile.preferences
        });
    } catch (error) {
        console.error('更新偏好设置错误:', error);
        res.status(500).json({ message: '更新偏好设置时发生错误' });
    }
};

// 更新隐私设置
export const updateVisibility = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const profile = await UserProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ message: '个人资料不存在' });
        }

        profile.visibility = { ...profile.visibility, ...req.body };
        await profile.save();

        res.json({
            message: '隐私设置更新成功',
            visibility: profile.visibility
        });
    } catch (error) {
        console.error('更新隐私设置错误:', error);
        res.status(500).json({ message: '更新隐私设置时发生错误' });
    }
}; 