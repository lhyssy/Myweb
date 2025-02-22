import Blog from '../models/Blog.js';
import { validationResult } from 'express-validator';

// 获取所有博客文章
export const getBlogs = async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = '-publishedAt' } = req.query;
        
        const blogs = await Blog.find()
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('category', 'name')
            .populate('tags', 'name');

        const total = await Blog.countDocuments();

        res.json({
            blogs,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        console.error('获取博客列表错误:', error);
        res.status(500).json({ message: '获取博客列表失败' });
    }
};

// 导入新文章
export const importBlog = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const blogData = req.body;

        // 验证必要字段
        if (!blogData.title || !blogData.content) {
            return res.status(400).json({ message: '文章标题和内容不能为空' });
        }

        // 检查文章是否已存在
        const existingBlog = await Blog.findOne({ 
            $or: [
                { originalUrl: blogData.url },
                { title: blogData.title }
            ]
        });
        
        if (existingBlog) {
            return res.status(400).json({ message: '该文章已经导入过了' });
        }

        // 准备博客数据
        const newBlog = new Blog({
            title: blogData.title,
            summary: blogData.summary,
            content: blogData.content,
            originalUrl: blogData.url,
            platform: blogData.platform || 'CSDN',
            author: req.user._id, // 假设使用了auth中间件
            status: 'published',
            publishedAt: blogData.publishTime || new Date(),
            readTime: Math.ceil(blogData.content.length / 500), // 估算阅读时间
            stats: {
                views: parseInt(blogData.views) || 0,
                likes: parseInt(blogData.likes) || 0,
                collections: parseInt(blogData.collections) || 0,
                shares: 0
            }
        });

        // 如果提供了标签，创建或查找对应的标签
        if (blogData.tags && blogData.tags.length > 0) {
            // 这里需要处理标签的逻辑
            // 可以调用标签服务来创建或获取已存在的标签
            newBlog.tags = blogData.tags;
        }

        const savedBlog = await newBlog.save();
        
        // 填充关联数据
        await savedBlog.populate('tags');

        res.status(201).json({
            message: '文章导入成功',
            blog: savedBlog
        });
    } catch (error) {
        console.error('导入文章错误:', error);
        res.status(500).json({ 
            message: '导入文章失败',
            error: error.message 
        });
    }
};

// 更新文章统计信息
export const updateBlogStats = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body; // type可以是 'view', 'like', 'collect', 'share'
        
        if (!['view', 'like', 'collect', 'share'].includes(type)) {
            return res.status(400).json({ message: '无效的统计类型' });
        }

        const updateField = `stats.${type}s`;
        const blog = await Blog.findByIdAndUpdate(
            id,
            { $inc: { [updateField]: 1 } },
            { new: true }
        );
        
        if (!blog) {
            return res.status(404).json({ message: '文章不存在' });
        }

        res.json({
            message: '统计信息更新成功',
            stats: blog.stats
        });
    } catch (error) {
        console.error('更新统计信息错误:', error);
        res.status(500).json({ message: '更新统计信息失败' });
    }
};

// 搜索博客文章
export const searchBlogs = async (req, res) => {
    try {
        const { query, tags, platform, sort = '-publishedAt' } = req.query;
        
        const searchQuery = {};
        
        if (query) {
            searchQuery.$or = [
                { title: { $regex: query, $options: 'i' } },
                { summary: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } }
            ];
        }
        
        if (tags) {
            searchQuery.tags = { $in: tags.split(',') };
        }
        
        if (platform) {
            searchQuery.platform = platform;
        }

        const blogs = await Blog.find(searchQuery)
            .sort(sort)
            .populate('tags')
            .limit(20);

        res.json({
            message: '搜索成功',
            blogs
        });
    } catch (error) {
        console.error('搜索文章错误:', error);
        res.status(500).json({ message: '搜索文章失败' });
    }
}; 