import React from 'react';
import CommentItem from './CommentItem';

const CommentList = ({ comments, onUpdate, onDelete, onLike }) => {
    if (comments.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                暂无评论，来发表第一条评论吧！
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {comments.map(comment => (
                <CommentItem
                    key={comment._id}
                    comment={comment}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    onLike={onLike}
                />
            ))}
        </div>
    );
};

export default CommentList; 