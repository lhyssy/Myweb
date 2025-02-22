import React, { useState } from 'react';
import { FaGithub, FaTwitter, FaLinkedin, FaWeibo } from 'react-icons/fa';

const ProfileEditForm = ({ profile, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        nickname: profile?.nickname || '',
        bio: profile?.bio || '',
        location: profile?.location || '',
        website: profile?.website || '',
        social: {
            github: profile?.social?.github || '',
            twitter: profile?.social?.twitter || '',
            linkedin: profile?.social?.linkedin || '',
            weibo: profile?.social?.weibo || ''
        }
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (formData.nickname && formData.nickname.length > 30) {
            newErrors.nickname = '昵称不能超过30个字符';
        }

        if (formData.bio && formData.bio.length > 200) {
            newErrors.bio = '个人简介不能超过200个字符';
        }

        if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
            newErrors.website = '请输入有效的网站链接';
        }

        if (formData.social.github && !/^https:\/\/github\.com\/[\w-]+$/.test(formData.social.github)) {
            newErrors.github = '请输入有效的GitHub个人主页链接';
        }

        if (formData.social.twitter && !/^https:\/\/twitter\.com\/[\w-]+$/.test(formData.social.twitter)) {
            newErrors.twitter = '请输入有效的Twitter个人主页链接';
        }

        if (formData.social.linkedin && !/^https:\/\/www\.linkedin\.com\/in\/[\w-]+$/.test(formData.social.linkedin)) {
            newErrors.linkedin = '请输入有效的LinkedIn个人主页链接';
        }

        if (formData.social.weibo && !/^https:\/\/weibo\.com\/[\w-]+$/.test(formData.social.weibo)) {
            newErrors.weibo = '请输入有效的微博个人主页链接';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('social.')) {
            const socialField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                social: {
                    ...prev.social,
                    [socialField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本信息 */}
            <div className="space-y-4">
                <div>
                    <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                        昵称
                    </label>
                    <input
                        type="text"
                        id="nickname"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                            ${errors.nickname ? 'border-red-500' : ''}`}
                    />
                    {errors.nickname && (
                        <p className="mt-1 text-sm text-red-500">{errors.nickname}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        个人简介
                    </label>
                    <textarea
                        id="bio"
                        name="bio"
                        rows="3"
                        value={formData.bio}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                            ${errors.bio ? 'border-red-500' : ''}`}
                    />
                    {errors.bio && (
                        <p className="mt-1 text-sm text-red-500">{errors.bio}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                        位置
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                        个人网站
                    </label>
                    <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                            ${errors.website ? 'border-red-500' : ''}`}
                    />
                    {errors.website && (
                        <p className="mt-1 text-sm text-red-500">{errors.website}</p>
                    )}
                </div>
            </div>

            {/* 社交链接 */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">社交链接</h3>

                <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center space-x-2">
                        <FaGithub className="text-gray-500" />
                        <input
                            type="url"
                            name="social.github"
                            value={formData.social.github}
                            onChange={handleChange}
                            placeholder="GitHub 个人主页链接"
                            className={`flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                                ${errors.github ? 'border-red-500' : ''}`}
                        />
                    </div>
                    {errors.github && (
                        <p className="mt-1 text-sm text-red-500">{errors.github}</p>
                    )}

                    <div className="flex items-center space-x-2">
                        <FaTwitter className="text-gray-500" />
                        <input
                            type="url"
                            name="social.twitter"
                            value={formData.social.twitter}
                            onChange={handleChange}
                            placeholder="Twitter 个人主页链接"
                            className={`flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                                ${errors.twitter ? 'border-red-500' : ''}`}
                        />
                    </div>
                    {errors.twitter && (
                        <p className="mt-1 text-sm text-red-500">{errors.twitter}</p>
                    )}

                    <div className="flex items-center space-x-2">
                        <FaLinkedin className="text-gray-500" />
                        <input
                            type="url"
                            name="social.linkedin"
                            value={formData.social.linkedin}
                            onChange={handleChange}
                            placeholder="LinkedIn 个人主页链接"
                            className={`flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                                ${errors.linkedin ? 'border-red-500' : ''}`}
                        />
                    </div>
                    {errors.linkedin && (
                        <p className="mt-1 text-sm text-red-500">{errors.linkedin}</p>
                    )}

                    <div className="flex items-center space-x-2">
                        <FaWeibo className="text-gray-500" />
                        <input
                            type="url"
                            name="social.weibo"
                            value={formData.social.weibo}
                            onChange={handleChange}
                            placeholder="微博个人主页链接"
                            className={`flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm
                                ${errors.weibo ? 'border-red-500' : ''}`}
                        />
                    </div>
                    {errors.weibo && (
                        <p className="mt-1 text-sm text-red-500">{errors.weibo}</p>
                    )}
                </div>
            </div>

            {/* 按钮 */}
            <div className="flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    取消
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    保存
                </button>
            </div>
        </form>
    );
};

export default ProfileEditForm; 