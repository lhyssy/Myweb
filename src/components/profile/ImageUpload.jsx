import React, { useState, useRef } from 'react';
import { FaCamera } from 'react-icons/fa';

const ImageUpload = ({ type, onUploadSuccess }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 验证文件类型
        if (!file.type.startsWith('image/')) {
            setError('请选择图片文件');
            return;
        }

        // 验证文件大小（5MB）
        if (file.size > 5 * 1024 * 1024) {
            setError('图片大小不能超过5MB');
            return;
        }

        try {
            setUploading(true);
            setError(null);

            const formData = new FormData();
            formData.append(type, file);

            const response = await fetch(`/api/profile/${type}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error('上传失败');
            }

            const data = await response.json();
            onUploadSuccess(data[type]);
        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="relative">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
            />
            
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className={`absolute ${type === 'avatar' ? 'bottom-0 right-0' : 'top-4 right-4'}
                    p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-opacity
                    ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <FaCamera size={16} />
            </button>

            {error && (
                <div className="absolute top-full left-0 mt-2 px-3 py-1 bg-red-500 text-white text-sm rounded">
                    {error}
                </div>
            )}

            {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload; 