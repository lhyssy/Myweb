import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const EducationSection = ({ education, onUpdate }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        school: '',
        degree: '',
        field: '',
        startYear: '',
        endYear: '',
        current: false
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        const currentYear = new Date().getFullYear();

        if (!formData.school) newErrors.school = '学校名称不能为空';
        if (!formData.degree) newErrors.degree = '学位不能为空';
        if (!formData.field) newErrors.field = '专业领域不能为空';
        if (!formData.startYear) {
            newErrors.startYear = '开始年份不能为空';
        } else if (formData.startYear < 1900 || formData.startYear > currentYear) {
            newErrors.startYear = '请输入有效的开始年份';
        }

        if (!formData.current && formData.endYear) {
            if (formData.endYear < formData.startYear) {
                newErrors.endYear = '结束年份必须大于开始年份';
            } else if (formData.endYear > currentYear + 10) {
                newErrors.endYear = '结束年份不能超过未来10年';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const updatedEducation = [...education];
        if (editingId) {
            const index = updatedEducation.findIndex(edu => edu._id === editingId);
            if (index !== -1) {
                updatedEducation[index] = { ...updatedEducation[index], ...formData };
            }
        } else {
            updatedEducation.push({ ...formData, _id: Date.now().toString() });
        }

        onUpdate(updatedEducation);
        handleCancel();
    };

    const handleEdit = (edu) => {
        setFormData({
            school: edu.school,
            degree: edu.degree,
            field: edu.field,
            startYear: edu.startYear,
            endYear: edu.endYear,
            current: edu.current
        });
        setEditingId(edu._id);
        setIsAdding(true);
    };

    const handleDelete = (eduId) => {
        const updatedEducation = education.filter(edu => edu._id !== eduId);
        onUpdate(updatedEducation);
    };

    const handleCancel = () => {
        setFormData({
            school: '',
            degree: '',
            field: '',
            startYear: '',
            endYear: '',
            current: false
        });
        setEditingId(null);
        setIsAdding(false);
        setErrors({});
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">教育经历</h3>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                        <FaPlus className="mr-1" />
                        添加教育经历
                    </button>
                )}
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                学校名称
                            </label>
                            <input
                                type="text"
                                value={formData.school}
                                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                                    ${errors.school ? 'border-red-500' : 'border-gray-300'}
                                    focus:border-blue-500 focus:ring-blue-500`}
                            />
                            {errors.school && (
                                <p className="mt-1 text-sm text-red-500">{errors.school}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                学位
                            </label>
                            <input
                                type="text"
                                value={formData.degree}
                                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                                    ${errors.degree ? 'border-red-500' : 'border-gray-300'}
                                    focus:border-blue-500 focus:ring-blue-500`}
                            />
                            {errors.degree && (
                                <p className="mt-1 text-sm text-red-500">{errors.degree}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                专业领域
                            </label>
                            <input
                                type="text"
                                value={formData.field}
                                onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                                    ${errors.field ? 'border-red-500' : 'border-gray-300'}
                                    focus:border-blue-500 focus:ring-blue-500`}
                            />
                            {errors.field && (
                                <p className="mt-1 text-sm text-red-500">{errors.field}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                开始年份
                            </label>
                            <input
                                type="number"
                                value={formData.startYear}
                                onChange={(e) => setFormData({ ...formData, startYear: parseInt(e.target.value) })}
                                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                                    ${errors.startYear ? 'border-red-500' : 'border-gray-300'}
                                    focus:border-blue-500 focus:ring-blue-500`}
                            />
                            {errors.startYear && (
                                <p className="mt-1 text-sm text-red-500">{errors.startYear}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                结束年份
                            </label>
                            <input
                                type="number"
                                value={formData.endYear}
                                onChange={(e) => setFormData({ ...formData, endYear: parseInt(e.target.value) })}
                                disabled={formData.current}
                                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                                    ${errors.endYear ? 'border-red-500' : 'border-gray-300'}
                                    ${formData.current ? 'bg-gray-100' : ''}
                                    focus:border-blue-500 focus:ring-blue-500`}
                            />
                            {errors.endYear && (
                                <p className="mt-1 text-sm text-red-500">{errors.endYear}</p>
                            )}
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="current"
                                checked={formData.current}
                                onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="current" className="ml-2 block text-sm text-gray-700">
                                目前在读
                            </label>
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
                {education.map((edu) => (
                    <div
                        key={edu._id}
                        className="flex justify-between items-start p-4 bg-gray-50 rounded-lg"
                    >
                        <div>
                            <h4 className="text-lg font-medium text-gray-900">{edu.school}</h4>
                            <p className="text-gray-600">{edu.degree} · {edu.field}</p>
                            <p className="text-sm text-gray-500">
                                {edu.startYear} - {edu.current ? '至今' : edu.endYear}
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleEdit(edu)}
                                className="text-gray-600 hover:text-blue-600"
                            >
                                <FaEdit />
                            </button>
                            <button
                                onClick={() => handleDelete(edu._id)}
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

export default EducationSection; 