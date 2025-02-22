import Blog from '../models/Blog.js';
import csdnService from '../services/csdnService.js';

// 获取所有博客文章
export const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .sort({ publishedAt: -1 })
            .populate('category')
            .populate('tags');
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 导入博客文章
export const importBlog = async (req, res) => {
    try {
        const { url } = req.body;

        // 检查文章是否已存在
        const existingBlog = await Blog.findOne({ originalUrl: url });
        if (existingBlog) {
            return res.status(400).json({ message: '该文章已经导入过了' });
        }

        let articleData;
        if (url.includes('blog.csdn.net')) {
            articleData = await csdnService.parseArticle(url);
        } else {
            return res.status(400).json({ message: '暂不支持该平台的文章导入' });
        }

        // 创建新的博客文章
        const blog = new Blog({
            title: articleData.title,
            content: articleData.content,
            summary: articleData.summary,
            author: req.user._id, // 使用当前登录用户作为作者
            tags: articleData.tags,
            originalUrl: url,
            platform: articleData.platform,
            readTime: parseInt(articleData.readTime),
            status: 'published',
            publishedAt: articleData.publishTime || new Date(),
            stats: articleData.stats
        });

        const savedBlog = await blog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        console.error('博客导入错误:', error);
        res.status(500).json({ message: error.message || '导入文章失败' });
    }
};

// 更新文章统计信息
export const updateBlogStats = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body;
        
        const updateField = `stats.${type}s`;
        const blog = await Blog.findByIdAndUpdate(
            id,
            { $inc: { [updateField]: 1 } },
            { new: true }
        );
        
        if (!blog) {
            return res.status(404).json({ message: '文章不存在' });
        }
        
        res.json(blog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 搜索博客文章
export const searchBlogs = async (req, res) => {
    try {
        const { query, tags, platform, sort = '-publishedAt' } = req.query;
        
        const filter = { status: 'published' };
        
        if (query) {
            filter.$or = [
                { title: { $regex: query, $options: 'i' } },
                { summary: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } }
            ];
        }
        
        if (tags) {
            filter.tags = { $in: tags.split(',') };
        }
        
        if (platform) {
            filter.platform = platform;
        }
        
        const blogs = await Blog.find(filter)
            .sort(sort)
            .populate('category')
            .populate('tags');
        
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 