import React from 'react';
import { FaTimes } from 'react-icons/fa';

const ProjectFilter = ({ filters, onChange, onClose }) => {
    const categories = [
        { id: '', name: '全部' },
        { id: 'web', name: 'Web应用' },
        { id: 'mobile', name: '移动应用' },
        { id: 'desktop', name: '桌面应用' },
        { id: 'library', name: '库/框架' },
        { id: 'other', name: '其他' }
    ];

    const technologies = [
        'React', 'Vue', 'Angular', 'Node.js', 'Python',
        'Java', 'Go', 'TypeScript', 'MongoDB', 'MySQL',
        'Docker', 'Kubernetes', 'AWS', 'Flutter', 'React Native'
    ];

    const statuses = [
        { id: 'all', name: '全部' },
        { id: 'active', name: '活跃' },
        { id: 'completed', name: '已完成' },
        { id: 'archived', name: '已归档' }
    ];

    const handleTechToggle = (tech) => {
        const newTech = filters.tech.includes(tech)
            ? filters.tech.filter(t => t !== tech)
            : [...filters.tech, tech];
        
        onChange({ ...filters, tech: newTech });
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">筛选条件</h3>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <FaTimes size={20} />
                </button>
            </div>

            <div className="space-y-6">
                {/* 项目类别 */}
                <div>
                    <h4 className="text-lg font-medium mb-3">项目类别</h4>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => onChange({ ...filters, category: category.id })}
                                className={`px-4 py-2 rounded-full text-sm
                                    ${filters.category === category.id
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 技术栈 */}
                <div>
                    <h4 className="text-lg font-medium mb-3">技术栈</h4>
                    <div className="flex flex-wrap gap-2">
                        {technologies.map(tech => (
                            <button
                                key={tech}
                                onClick={() => handleTechToggle(tech)}
                                className={`px-4 py-2 rounded-full text-sm
                                    ${filters.tech.includes(tech)
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                {tech}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 项目状态 */}
                <div>
                    <h4 className="text-lg font-medium mb-3">项目状态</h4>
                    <div className="flex flex-wrap gap-2">
                        {statuses.map(status => (
                            <button
                                key={status.id}
                                onClick={() => onChange({ ...filters, status: status.id })}
                                className={`px-4 py-2 rounded-full text-sm
                                    ${filters.status === status.id
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                {status.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex justify-end mt-6">
                <button
                    onClick={() => onChange({
                        category: '',
                        tech: [],
                        status: 'all'
                    })}
                    className="text-gray-600 hover:text-gray-800 mr-4"
                >
                    重置筛选
                </button>
                <button
                    onClick={onClose}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    应用筛选
                </button>
            </div>
        </div>
    );
};

export default ProjectFilter; 