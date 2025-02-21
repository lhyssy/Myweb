import mongoose from 'mongoose';
import slugify from 'slugify';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, '项目名称不能为空'],
        trim: true,
        maxlength: [100, '项目名称不能超过100个字符']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, '项目描述不能为空'],
        maxlength: [500, '项目描述不能超过500个字符']
    },
    content: {
        type: String,
        required: [true, '项目详细内容不能为空']
    },
    coverImage: {
        type: String,
        default: 'default-project-cover.jpg'
    },
    screenshots: [{
        url: String,
        caption: String
    }],
    technologies: [{
        type: String,
        trim: true
    }],
    githubUrl: {
        type: String,
        required: [true, 'GitHub仓库链接不能为空'],
        validate: {
            validator: function(v) {
                return /^https:\/\/github\.com\/[\w-]+\/[\w-]+/.test(v);
            },
            message: '请提供有效的GitHub仓库链接'
        }
    },
    demoUrl: {
        type: String,
        validate: {
            validator: function(v) {
                if (!v) return true;
                return /^https?:\/\//.test(v);
            },
            message: '请提供有效的演示链接'
        }
    },
    status: {
        type: String,
        enum: ['in-progress', 'completed', 'archived'],
        default: 'completed'
    },
    featured: {
        type: Boolean,
        default: false
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    stats: {
        stars: { type: Number, default: 0 },
        forks: { type: Number, default: 0 },
        watchers: { type: Number, default: 0 },
        issues: { type: Number, default: 0 }
    },
    contributors: [{
        username: String,
        avatarUrl: String,
        profileUrl: String,
        contributions: Number
    }],
    tags: [{
        type: String,
        trim: true
    }],
    category: {
        type: String,
        required: true,
        enum: [
            'web-application',
            'mobile-app',
            'desktop-app',
            'library',
            'tool',
            'api',
            'game',
            'other'
        ]
    },
    license: {
        type: String,
        default: 'MIT'
    },
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    lastSync: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// 索引
projectSchema.index({ slug: 1 });
projectSchema.index({ category: 1 });
projectSchema.index({ technologies: 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ featured: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ title: 'text', description: 'text' });

// 生成slug
projectSchema.pre('save', function(next) {
    if (!this.isModified('title')) {
        return next();
    }
    this.slug = slugify(this.title, {
        lower: true,
        strict: true,
        locale: 'zh'
    });
    next();
});

const Project = mongoose.model('Project', projectSchema);

export default Project; 