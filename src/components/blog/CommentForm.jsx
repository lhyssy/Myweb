import React, { useState } from 'react';

const CommentForm = ({ onSubmit, initialValue = '', buttonText = '发表评论', onCancel }) => {
    const [content, setContent] = useState(initialValue);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!content.trim()) {
            setError('评论内容不能为空');
            return;
        }

        if (content.length > 1000) {
            setError('评论内容不能超过1000个字符');
            return;
        }

        onSubmit(content);
        if (!initialValue) {
            setContent('');
        }
        setError('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="写下你的评论..."
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                        ${error ? 'border-red-500' : 'border-gray-300'}`}
                    rows="4"
                ></textarea>
                {error && (
                    <p className="mt-1 text-sm text-red-500">{error}</p>
                )}
                <p className="mt-1 text-sm text-gray-500 text-right">
                    {content.length}/1000
                </p>
            </div>

            <div className="flex justify-end space-x-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        取消
                    </button>
                )}
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    {buttonText}
                </button>
            </div>
        </form>
    );
};

export default CommentForm; 