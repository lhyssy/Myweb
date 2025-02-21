import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaExternalLinkAlt, FaStar, FaCodeBranch } from 'react-icons/fa';

const ProjectCard = ({ project }) => {
    const {
        slug,
        title,
        description,
        coverImage,
        technologies,
        githubUrl,
        demoUrl,
        stats,
        category,
        status
    } = project;

    const statusColors = {
        'in-progress': 'bg-yellow-100 text-yellow-800',
        'completed': 'bg-green-100 text-green-800',
        'archived': 'bg-gray-100 text-gray-800'
    };

    const categoryLabels = {
        'web-application': '网页应用',
        'mobile-app': '移动应用',
        'desktop-app': '桌面应用',
        'library': '库',
        'tool': '工具',
        'api': 'API',
        'game': '游戏',
        'other': '其他'
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <Link to={`/projects/${slug}`}>
                <div className="relative">
                    <img
                        src={coverImage || '/default-project-cover.jpg'}
                        alt={title}
                        className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
                            {status === 'in-progress' ? '进行中' : status === 'completed' ? '已完成' : '已归档'}
                        </span>
                    </div>
                </div>
            </Link>

            <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 truncate">
                        <Link to={`/projects/${slug}`}>{title}</Link>
                    </h3>
                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {categoryLabels[category]}
                    </span>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                    {technologies.slice(0, 3).map((tech, index) => (
                        <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-600 text-sm rounded"
                        >
                            {tech}
                        </span>
                    ))}
                    {technologies.length > 3 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-600 text-sm rounded">
                            +{technologies.length - 3}
                        </span>
                    )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center text-gray-600">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span>{stats.stars}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <FaCodeBranch className="mr-1" />
                            <span>{stats.forks}</span>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-600 hover:text-gray-900"
                        >
                            <FaGithub size={20} />
                        </a>
                        {demoUrl && (
                            <a
                                href={demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-600 hover:text-gray-900"
                            >
                                <FaExternalLinkAlt size={18} />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard; 