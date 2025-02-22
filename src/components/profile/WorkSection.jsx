import React, { useState } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const WorkSection = ({ work, onUpdate }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        company: '',
        position: '',
        description: '',
        startDate: '',
        endDate: '',
        current: false
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();

        if (!formData.company) newErrors.company = '公司名称不能为空';
        if (!formData.position) newErrors.position = '职位不能为空';
        if (formData.description && formData.description.length > 500) {
            newErrors.description = '工作描述不能超过500个字符';
        }
        if (!formData.startDate) {
            newErrors.startDate = '开始日期不能为空';
        } else {
            const startDate = new Date(formData.startDate);
            if (startDate > today) {
                newErrors.startDate = '开始日期不能晚于今天';
            }
        }

        if (!formData.current && formData.endDate) {
            const endDate = new Date(formData.endDate);
            const startDate = new Date(formData.startDate);
            if (endDate < startDate) {
                newErrors.endDate = '结束日期必须晚于开始日期';
            }
            if (endDate > new Date(today.getFullYear() + 1, today.getMonth(), today.getDate())) {
                newErrors.endDate = '结束日期不能超过一年后';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const updatedWork = [...work];
        if (editingId) {
            const index = updatedWork.findIndex(w => w._id === editingId);
            if (index !== -1) {
                updatedWork[index] = { ...updatedWork[index], ...formData };
            }
        } else {
            updatedWork.push({ ...formData, _id: Date.now().toString() });
        }

        onUpdate(updatedWork);
        handleCancel();
    };

    const handleEdit = (workItem) => {
        setFormData({
            company: workItem.company,
            position: workItem.position,
            description: workItem.description,
            startDate: workItem.startDate.split('T')[0],
            endDate: workItem.endDate ? workItem.endDate.split('T')[0] : '',
            current: workItem.current
        });
        setEditingId(workItem._id);
        setIsAdding(true);
    };

    const handleDelete = (workId) => {
        const updatedWork = work.filter(w => w._id !== workId);
        onUpdate(updatedWork);
    };

    const handleCancel = () => {
        setFormData({
            company: '',
            position: '',
            description: '',
            startDate: '',
            endDate: '',
            current: false
        });
        setEditingId(null);
        setIsAdding(false);
        setErrors({});
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">工作经历</h3>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                        <FaPlus className="mr-1" />
                        添加工作经历
                    </button>
                )}
            </div>

            {isAdding && (
                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                公司名称
                            </label>
                            <input
                                type="text"
                                value={formData.company}
                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                                    ${errors.company ? 'border-red-500' : 'border-gray-300'}
                                    focus:border-blue-500 focus:ring-blue-500`}
                            />
                            {errors.company && (
                                <p className="mt-1 text-sm text-red-500">{errors.company}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                职位
                            </label>
                            <input
                                type="text"
                                value={formData.position}
                                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                                    ${errors.position ? 'border-red-500' : 'border-gray-300'}
                                    focus:border-blue-500 focus:ring-blue-500`}
                            />
                            {errors.position && (
                                <p className="mt-1 text-sm text-red-500">{errors.position}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">
                                工作描述
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
                                开始日期
                            </label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                max={new Date().toISOString().split('T')[0]}
                                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                                    ${errors.startDate ? 'border-red-500' : 'border-gray-300'}
                                    focus:border-blue-500 focus:ring-blue-500`}
                            />
                            {errors.startDate && (
                                <p className="mt-1 text-sm text-red-500">{errors.startDate}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                结束日期
                            </label>
                            <input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                min={formData.startDate}
                                disabled={formData.current}
                                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm
                                    ${errors.endDate ? 'border-red-500' : 'border-gray-300'}
                                    focus:border-blue-500 focus:ring-blue-500
                                    ${formData.current ? 'bg-gray-100' : ''}`}
                            />
                            {errors.endDate && (
                                <p className="mt-1 text-sm text-red-500">{errors.endDate}</p>
                            )}
                        </div>

                        <div className="md:col-span-2">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.current}
                                    onChange={(e) => setFormData({ ...formData, current: e.target.checked })}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                    目前在职
                                </span>
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
                {work.map((workItem) => (
                    <div
                        key={workItem._id}
                        className="flex justify-between items-start p-4 bg-gray-50 rounded-lg"
                    >
                        <div>
                            <h4 className="text-lg font-medium text-gray-900">{workItem.company}</h4>
                            <p className="text-gray-600">{workItem.position}</p>
                            <p className="text-sm text-gray-500">
                                {new Date(workItem.startDate).toLocaleDateString('zh-CN')} - 
                                {workItem.current ? '至今' : new Date(workItem.endDate).toLocaleDateString('zh-CN')}
                            </p>
                            {workItem.description && (
                                <p className="mt-2 text-gray-600">{workItem.description}</p>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => handleEdit(workItem)}
                                className="text-gray-600 hover:text-blue-600"
                            >
                                <FaEdit />
                            </button>
                            <button
                                onClick={() => handleDelete(workItem._id)}
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

export default WorkSection; 