import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaExternalLinkAlt } from 'react-icons/fa';

const AchievementSection = ({ achievements, onUpdate }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        url: ''
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();

        if (!formData.title) newErrors.title = '成就标题不能为空';
        if (formData.description && formData.description.length > 500) {
            newErrors.description = '成就描述不能超过500个字符';
        }
        if (!formData.date) {
            newErrors.date = '获得日期不能为空';
        } else {
            const achievementDate = new Date(formData.date);
            if (achievementDate > today) {
                newErrors.date = '获得日期不能晚于今天';
            }
        }

        if (formData.url && !/^https?:\/\/.+/.test(formData.url)) {
            newErrors.url = '请输入有效的URL';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const updatedAchievements = [...achievements];
        if (editingId) {
            const index = updatedAchievements.findIndex(a => a._id === editingId);
            if (index !== -1) {
                updatedAchievements[index] = { ...updatedAchievements[index], ...formData };
            }
        } else {
            updatedAchievements.push({ ...formData, _id: Date.now().toString() });
        }

        onUpdate(updatedAchievements);
        handleCancel();
    };

    const handleEdit = (achievement) => {
        setFormData({
            title: achievement.title,
            description: achievement.description,
            date: achievement.date.split('T')[0],
            url: achievement.url || ''
        });
        setEditingId(achievement._id);
        setIsAdding(true);
    };

    const handleDelete = (achievementId) => {
        const updatedAchievements = achievements.filter(a => a._id !== achievementId);
        onUpdate(updatedAchievements);
    };

    const handleCancel = () => {
        setFormData({
            title: '',
            description: '',
            date: '',
            url: ''
        });
        setEditingId(null);
        setIsAdding(false);
        setErrors({});
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">成就</h3>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                        <FaPlus className="mr-1" />
                        添加成就
                    </button>
                )}
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                成就标题
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                                    ${errors.title ? 'border-red-500' : 'border-gray-300'}
                                    focus:border-blue-500 focus:ring-blue-500`}
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                成就描述
                            </label>
                            <textarea
                                rows="3"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                                    ${errors.description ? 'border-red-500' : 'border-gray-300'}
                                    focus:border-blue-500 focus:ring-blue-500`}
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                获得日期
                            </label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                                    ${errors.date ? 'border-red-500' : 'border-gray-300'}
                                    focus:border-blue-500 focus:ring-blue-500`}
                            />
                            {errors.date && (
                                <p className="mt-1 text-sm text-red-500">{errors.date}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                相关链接
                            </label>
                            <input
                                type="url"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                placeholder="https://"
                                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                                    ${errors.url ? 'border-red-500' : 'border-gray-300'}
                                    focus:border-blue-500 focus:ring-blue-500`}
                            />
                            {errors.url && (
                                <p className="mt-1 text-sm text-red-500">{errors.url}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                        >
                            {editingId ? '保存' : '添加'}
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-4">
                {achievements.map((achievement) => (
                    <div
                        key={achievement._id}
                        className="flex justify-between items-start p-4 bg-gray-50 rounded-lg"
                    >
                        <div>
                            <div className="flex items-center">
                                <h4 className="text-lg font-medium text-gray-900">{achievement.title}</h4>
                                {achievement.url && (
                                    <a
                                        href={achievement.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="ml-2 text-gray-500 hover:text-blue-600"
                                    >
                                        <FaExternalLinkAlt size={14} />
                                    </a>
                                )}
                            </div>
                            <p className="text-sm text-gray-500">
                                {new Date(achievement.date).toLocaleDateString('zh-CN')}
                            </p>
                            {achievement.description && (
                                <p className="mt-2 text-gray-600">{achievement.description}</p>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleEdit(achievement)}
                                className="text-gray-600 hover:text-blue-600"
                            >
                                <FaEdit />
                            </button>
                            <button
                                onClick={() => handleDelete(achievement._id)}
                                className="text-gray-600 hover:text-red-600"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AchievementSection; 