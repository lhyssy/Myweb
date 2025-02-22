import mongoose from 'mongoose';
import slugify from 'slugify';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, '文章标题不能为空'],
        trim: true,
        maxlength: [200, '标题不能超过200个字符']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    content: {
        type: String,
        required: [true, '文章内容不能为空']
    },
    summary: {
        type: String,
        required: [true, '文章摘要不能为空'],
        maxlength: [500, '摘要不能超过500个字符']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, '请指定文章作者']
    },
    tags: [{
        type: String,
        trim: true
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    platform: {
        type: String,
        enum: ['CSDN', 'GitHub', 'Personal', 'Other'],
        default: 'Personal'
    },
    originalUrl: {
        type: String,
        unique: true,
        sparse: true
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    publishedAt: {
        type: Date
    },
    readTime: {
        type: Number,
        min: 1,
        default: 5
    },
    stats: {
        views: {
            type: Number,
            default: 0
        },
        likes: {
            type: Number,
            default: 0
        },
        collections: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

// 索引
blogSchema.index({ slug: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ status: 1, publishedAt: -1 });
blogSchema.index({ title: 'text', content: 'text' });

// 虚拟字段：评论
blogSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'blog'
});

// 生成slug
blogSchema.pre('save', function(next) {
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

// 发布时自动设置发布时间
blogSchema.pre('save', function(next) {
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog; 