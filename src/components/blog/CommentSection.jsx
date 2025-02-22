import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

const CommentSection = ({ blogId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        fetchComments();
    }, [blogId]);

    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/comments/blog/${blogId}`);
            if (!response.ok) {
                throw new Error('获取评论失败');
            }
            const data = await response.json();
            setComments(data.comments);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleCommentSubmit = async (newComment) => {
        try {
            const response = await fetch('/api/comments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    content: newComment,
                    blogId
                })
            });

            if (!response.ok) {
                throw new Error('发表评论失败');
            }

            const data = await response.json();
            setComments([data.comment, ...comments]);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCommentUpdate = async (commentId, content) => {
        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ content })
            });

            if (!response.ok) {
                throw new Error('更新评论失败');
            }

            const data = await response.json();
            setComments(comments.map(comment => 
                comment._id === commentId ? data.comment : comment
            ));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCommentDelete = async (commentId) => {
        try {
            const response = await fetch(`/api/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('删除评论失败');
            }

            setComments(comments.filter(comment => comment._id !== commentId));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCommentLike = async (commentId) => {
        try {
            const response = await fetch(`/api/comments/${commentId}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('操作失败');
            }

            const data = await response.json();
            setComments(comments.map(comment => 
                comment._id === commentId 
                    ? { ...comment, likes: data.likes }
                    : comment
            ));
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold">评论区</h3>
            
            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded">
                    {error}
                </div>
            )}

            {isAuthenticated ? (
                <CommentForm onSubmit={handleCommentSubmit} />
            ) : (
                <div className="bg-gray-50 p-4 rounded text-center">
                    请<a href="/login" className="text-blue-600 hover:underline">登录</a>后发表评论
                </div>
            )}

            <CommentList
                comments={comments}
                onUpdate={handleCommentUpdate}
                onDelete={handleCommentDelete}
                onLike={handleCommentLike}
            />
        </div>
    );
};

export default CommentSection; 