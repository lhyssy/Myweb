import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { FaHeart, FaRegHeart, FaEdit, FaTrash, FaReply } from 'react-icons/fa';
import CommentForm from './CommentForm';

const CommentItem = ({ comment, onUpdate, onDelete, onLike }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const { user } = useAuth();

    const isAuthor = user && comment.author._id === user._id;
    const hasLiked = user && comment.likes.includes(user._id);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleUpdate = (content) => {
        onUpdate(comment._id, content);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm('确定要删除这条评论吗？')) {
            onDelete(comment._id);
        }
    };

    const handleLike = () => {
        onLike(comment._id);
    };

    return (
        <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-start space-x-4">
                <img
                    src={comment.author.avatar || '/default-avatar.png'}
                    alt={comment.author.username}
                    className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="font-medium">{comment.author.username}</span>
                            <span className="text-gray-500 text-sm ml-2">
                                {formatDistanceToNow(new Date(comment.createdAt), {
                                    addSuffix: true,
                                    locale: zhCN
                                })}
                            </span>
                            {comment.isEdited && (
                                <span className="text-gray-500 text-sm ml-2">(已编辑)</span>
                            )}
                        </div>
                        {user && (
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center space-x-1 text-sm
                                        ${hasLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                                >
                                    {hasLiked ? <FaHeart /> : <FaRegHeart />}
                                    <span>{comment.likes.length}</span>
                                </button>
                                {isAuthor && (
                                    <>
                                        <button
                                            onClick={handleEdit}
                                            className="text-gray-500 hover:text-blue-500"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="text-gray-500 hover:text-red-500"
                                        >
                                            <FaTrash />
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => setShowReplyForm(!showReplyForm)}
                                    className="text-gray-500 hover:text-blue-500 flex items-center space-x-1"
                                >
                                    <FaReply />
                                    <span>回复</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {isEditing ? (
                        <CommentForm
                            initialValue={comment.content}
                            onSubmit={handleUpdate}
                            onCancel={() => setIsEditing(false)}
                            buttonText="保存"
                        />
                    ) : (
                        <p className="mt-2 text-gray-700">{comment.content}</p>
                    )}

                    {showReplyForm && (
                        <div className="mt-4">
                            <CommentForm
                                onSubmit={(content) => {
                                    // 处理回复逻辑
                                    setShowReplyForm(false);
                                }}
                                onCancel={() => setShowReplyForm(false)}
                                buttonText="回复"
                            />
                        </div>
                    )}

                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-100">
                            {comment.replies.map(reply => (
                                <CommentItem
                                    key={reply._id}
                                    comment={reply}
                                    onUpdate={onUpdate}
                                    onDelete={onDelete}
                                    onLike={onLike}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CommentItem; 