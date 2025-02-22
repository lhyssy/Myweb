import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaGithub, FaLink, FaStar, FaCode, FaUsers, FaCalendar } from 'react-icons/fa';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const ProjectDetail = () => {
    const { slug } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProjectDetails();
    }, [slug]);

    const fetchProjectDetails = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/projects/${slug}`);
            if (!response.ok) {
                throw new Error('获取项目详情失败');
            }
            const data = await response.json();
            setProject(data.project);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">项目不存在</h2>
                    <Link to="/projects" className="text-blue-600 hover:text-blue-800">
                        返回项目列表
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* 导航栏 */}
            <nav className="mb-8">
                <Link to="/projects" className="text-blue-600 hover:text-blue-800">
                    ← 返回项目列表
                </Link>
            </nav>

            {/* 项目标题和基本信息 */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                    src={project.coverImage || '/default-project-cover.jpg'}
                    alt={project.title}
                    className="w-full h-64 object-cover"
                />
                
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-3xl font-bold">{project.title}</h1>
                        <div className="flex items-center space-x-4">
                            {project.githubUrl && (
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-black"
                                >
                                    <FaGithub size={24} />
                                </a>
                            )}
                            {project.demoUrl && (
                                <a
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-600 hover:text-blue-600"
                                >
                                    <FaLink size={24} />
                                </a>
                            )}
                        </div>
                    </div>

                    <p className="text-gray-600 mb-6">
                        {project.description}
                    </p>

                    {/* 项目统计 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <FaStar className="text-yellow-500" />
                            <span>{project.stars} stars</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <FaCode />
                            <span>{project.technologies.length} 种技术</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <FaCalendar />
                            <span>
                                {format(new Date(project.createdAt), 'yyyy年MM月', { locale: zhCN })}
                            </span>
                        </div>
                    </div>

                    {/* 技术栈 */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">技术栈</h2>
                        <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* 项目特点 */}
                    {project.features && project.features.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">主要特点</h2>
                            <ul className="list-disc list-inside space-y-2 text-gray-700">
                                {project.features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* 贡献者 */}
                    {project.contributors && project.contributors.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">贡献者</h2>
                            <div className="flex flex-wrap gap-4">
                                {project.contributors.map((contributor, index) => (
                                    <a
                                        key={index}
                                        href={contributor.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                                    >
                                        <img
                                            src={contributor.avatar}
                                            alt={contributor.name}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span>{contributor.name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* README 内容 */}
                    {project.readme && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">项目说明</h2>
                            <div className="prose max-w-none"
                                dangerouslySetInnerHTML={{ __html: project.readme }}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectDetail; 