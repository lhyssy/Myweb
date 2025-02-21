import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    nickname: {
        type: String,
        trim: true,
        maxlength: [30, '昵称不能超过30个字符']
    },
    avatar: {
        url: String,
        publicId: String // 用于云存储服务的文件标识
    },
    coverImage: {
        url: String,
        publicId: String
    },
    bio: {
        type: String,
        trim: true,
        maxlength: [200, '个人简介不能超过200个字符']
    },
    location: {
        type: String,
        trim: true,
        maxlength: [100, '地址不能超过100个字符']
    },
    website: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                if (!v) return true;
                return /^https?:\/\//.test(v);
            },
            message: '请提供有效的网站链接'
        }
    },
    social: {
        github: String,
        twitter: String,
        linkedin: String,
        weibo: String
    },
    skills: [{
        type: String,
        trim: true
    }],
    interests: [{
        type: String,
        trim: true
    }],
    education: [{
        school: String,
        degree: String,
        field: String,
        startYear: Number,
        endYear: Number,
        current: Boolean
    }],
    work: [{
        company: String,
        position: String,
        description: String,
        startDate: Date,
        endDate: Date,
        current: Boolean
    }],
    achievements: [{
        title: String,
        description: String,
        date: Date,
        url: String
    }],
    preferences: {
        emailNotifications: {
            type: Boolean,
            default: true
        },
        newsletter: {
            type: Boolean,
            default: true
        },
        theme: {
            type: String,
            enum: ['light', 'dark', 'system'],
            default: 'system'
        },
        language: {
            type: String,
            enum: ['zh', 'en'],
            default: 'zh'
        }
    },
    visibility: {
        email: {
            type: String,
            enum: ['public', 'private'],
            default: 'private'
        },
        location: {
            type: String,
            enum: ['public', 'private'],
            default: 'public'
        },
        education: {
            type: String,
            enum: ['public', 'private'],
            default: 'public'
        },
        work: {
            type: String,
            enum: ['public', 'private'],
            default: 'public'
        }
    }
}, {
    timestamps: true
});

// 索引
userProfileSchema.index({ user: 1 });
userProfileSchema.index({ 'skills': 1 });
userProfileSchema.index({ 'interests': 1 });

const UserProfile = mongoose.model('UserProfile', userProfileSchema);

export default UserProfile; 