import mongoose from 'mongoose';
import slugify from 'slugify';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, '文章标题不能为空'],
        trim: true,
        maxlength: [100, '标题不能超过100个字符']
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    summary: {
        type: String,
        required: [true, '文章摘要不能为空'],
        maxlength: [300, '摘要不能超过300个字符']
    },
    content: {
        type: String,
        required: [true, '文章内容不能为空']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, '请选择文章分类']
    },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }],
    coverImage: {
        type: String,
        default: 'default-blog-cover.jpg'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, '请指定文章作者']
    },
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    publishedAt: {
        type: Date
    },
    featured: {
        type: Boolean,
        default: false
    },
    readTime: {
        type: Number,
        required: true,
        min: [1, '阅读时间不能小于1分钟']
    },
    platform: {
        type: String,
        enum: ['CSDN', 'GitHub', 'Personal', 'Other'],
        default: 'Personal'
    },
    originalUrl: {
        type: String,
        validate: {
            validator: function(v) {
                if (this.platform === 'Personal') return true;
                return v && v.length > 0;
            },
            message: '对于非个人平台的文章，必须提供原文链接'
        }
    },
    stats: {
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        shares: { type: Number, default: 0 }
    },
    seo: {
        metaTitle: String,
        metaDescription: String,
        keywords: [String],
        canonical: String
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
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

// 发布文章时更新publishedAt
blogSchema.pre('save', function(next) {
    if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
        this.publishedAt = Date.now();
    }
    next();
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog; 