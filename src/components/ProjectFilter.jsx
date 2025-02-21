import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';

const ProjectFilter = ({ filters, onFilterChange }) => {
    const [localFilters, setLocalFilters] = useState(filters);
    const [technologies, setTechnologies] = useState([]);

    useEffect(() => {
        fetchTechnologies();
    }, []);

    const fetchTechnologies = async () => {
        try {
            const response = await fetch('/api/projects/technologies');
            const data = await response.json();
            setTechnologies(data.technologies);
        } catch (error) {
            console.error('获取技术栈列表失败:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newFilters = { ...localFilters, [name]: value };
        setLocalFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        onFilterChange(localFilters);
    };

    const categories = [
        { value: '', label: '全部类别' },
        { value: 'web-application', label: '网页应用' },
        { value: 'mobile-app', label: '移动应用' },
        { value: 'desktop-app', label: '桌面应用' },
        { value: 'library', label: '库' },
        { value: 'tool', label: '工具' },
        { value: 'api', label: 'API' },
        { value: 'game', label: '游戏' },
        { value: 'other', label: '其他' }
    ];

    const statuses = [
        { value: '', label: '全部状态' },
        { value: 'in-progress', label: '进行中' },
        { value: 'completed', label: '已完成' },
        { value: 'archived', label: '已归档' }
    ];

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <form onSubmit={handleSearchSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* 搜索框 */}
                    <div className="relative">
                        <input
                            type="text"
                            name="search"
                            value={localFilters.search}
                            onChange={handleChange}
                            placeholder="搜索项目..."
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>

                    {/* 类别筛选 */}
                    <div>
                        <select
                            name="category"
                            value={localFilters.category}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {categories.map(category => (
                                <option key={category.value} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 技术栈筛选 */}
                    <div>
                        <select
                            name="technology"
                            value={localFilters.technology}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">全部技术</option>
                            {technologies.map(tech => (
                                <option key={tech} value={tech}>
                                    {tech}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 状态筛选 */}
                    <div>
                        <select
                            name="status"
                            value={localFilters.status}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {statuses.map(status => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => {
                            const resetFilters = {
                                category: '',
                                technology: '',
                                status: '',
                                search: ''
                            };
                            setLocalFilters(resetFilters);
                            onFilterChange(resetFilters);
                        }}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-4"
                    >
                        重置筛选
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        应用筛选
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectFilter; 