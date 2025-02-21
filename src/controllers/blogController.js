import Blog from '../models/Blog.js';

// 获取所有博客文章
export const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true })
            .sort({ date: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 导入新文章
export const importBlog = async (req, res) => {
    try {
        const blogData = req.body;
        const existingBlog = await Blog.findOne({ url: blogData.url });
        
        if (existingBlog) {
            return res.status(400).json({ message: '文章已存在' });
        }

        const blog = new Blog(blogData);
        const savedBlog = await blog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 更新文章统计信息
export const updateBlogStats = async (req, res) => {
    try {
        const { id } = req.params;
        const { type } = req.body; // type可以是 'view', 'like', 'collect'
        
        const updateField = `stats.${type}s`;
        const blog = await Blog.findByIdAndUpdate(
            id,
            { $inc: { [updateField]: 1 } },
            { new: true }
        );
        
        res.json(blog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 搜索博客文章
export const searchBlogs = async (req, res) => {
    try {
        const { query } = req.query;
        const blogs = await Blog.find({
            isPublished: true,
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { summary: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } }
            ]
        }).sort({ date: -1 });
        
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 