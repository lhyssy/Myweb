import { validationResult } from 'express-validator';
import Comment from '../models/Comment.js';

// 创建评论
export const createComment = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { content, blogId, parentId } = req.body;

        const comment = await Comment.create({
            content,
            blog: blogId,
            author: req.user._id,
            parent: parentId || null
        });

        await comment.populate('author', 'username avatar');

        res.status(201).json({
            message: '评论创建成功',
            comment
        });
    } catch (error) {
        console.error('创建评论错误:', error);
        res.status(500).json({ message: '创建评论时发生错误' });
    }
};

// 获取博客评论
export const getBlogComments = async (req, res) => {
    try {
        const { blogId } = req.params;
        const comments = await Comment.find({ blog: blogId, parent: null })
            .populate('author', 'username avatar')
            .populate({
                path: 'replies',
                populate: {
                    path: 'author',
                    select: 'username avatar'
                }
            })
            .sort('-createdAt');

        res.json({ comments });
    } catch (error) {
        console.error('获取评论列表错误:', error);
        res.status(500).json({ message: '获取评论列表时发生错误' });
    }
};

// 更新评论
export const updateComment = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { content } = req.body;

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: '评论不存在' });
        }

        // 检查是否是评论作者
        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: '您没有权限修改此评论' });
        }

        comment.content = content;
        comment.isEdited = true;
        await comment.save();

        await comment.populate('author', 'username avatar');

        res.json({
            message: '评论更新成功',
            comment
        });
    } catch (error) {
        console.error('更新评论错误:', error);
        res.status(500).json({ message: '更新评论时发生错误' });
    }
};

// 删除评论
export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ message: '评论不存在' });
        }

        // 检查是否是评论作者
        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: '您没有权限删除此评论' });
        }

        // 删除所有子评论
        await Comment.deleteMany({ parent: id });
        // 删除评论
        await comment.deleteOne();

        res.json({ message: '评论删除成功' });
    } catch (error) {
        console.error('删除评论错误:', error);
        res.status(500).json({ message: '删除评论时发生错误' });
    }
};

// 点赞/取消点赞评论
export const toggleCommentLike = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(404).json({ message: '评论不存在' });
        }

        const userIndex = comment.likes.indexOf(req.user._id);
        if (userIndex === -1) {
            // 添加点赞
            comment.likes.push(req.user._id);
        } else {
            // 取消点赞
            comment.likes.splice(userIndex, 1);
        }

        await comment.save();

        res.json({
            message: userIndex === -1 ? '点赞成功' : '取消点赞成功',
            likes: comment.likes.length
        });
    } catch (error) {
        console.error('处理评论点赞错误:', error);
        res.status(500).json({ message: '处理评论点赞时发生错误' });
    }
}; 