import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaGithub, FaExternalLinkAlt, FaStar, FaCodeBranch, FaEye } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ProjectDetail = () => {
    const { slug } = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [readme, setReadme] = useState('');

    useEffect(() => {
        fetchProjectData();
    }, [slug]);

    const fetchProjectData = async () => {
        try {
            const [projectResponse, readmeResponse] = await Promise.all([
                fetch(`/api/projects/${slug}`),
                fetch(`/api/projects/${slug}/readme`)
            ]);

            if (!projectResponse.ok) {
                throw new Error('项目不存在');
            }

            const projectData = await projectResponse.json();
            setProject(projectData.project);

            if (readmeResponse.ok) {
                const readmeData = await readmeResponse.json();
                setReadme(readmeData.content);
            }

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
            <div className="container mx-auto px-4 py-8 text-center">
                <h2 className="text-2xl font-bold text-red-500 mb-4">错误</h2>
                <p className="text-gray-600">{error}</p>
            </div>
        );
    }

    if (!project) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
        >
            {/* 项目头部 */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="relative">
                    <img
                        src={project.coverImage || '/default-project-cover.jpg'}
                        alt={project.title}
                        className="w-full h-64 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                        <h1 className="text-3xl font-bold text-white mb-2">{project.title}</h1>
                        <p className="text-gray-200">{project.description}</p>
                    </div>
                </div>

                <div className="p-6">
                    {/* 项目统计 */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center">
                                <FaStar className="text-yellow-400 mr-2" />
                                <span className="text-gray-700">{project.stats.stars} 星标</span>
                            </div>
                            <div className="flex items-center">
                                <FaCodeBranch className="text-gray-500 mr-2" />
                                <span className="text-gray-700">{project.stats.forks} 分支</span>
                            </div>
                            <div className="flex items-center">
                                <FaEye className="text-gray-500 mr-2" />
                                <span className="text-gray-700">{project.stats.watchers} 关注</span>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                                <FaGithub className="mr-2" />
                                GitHub
                            </a>
                            {project.demoUrl && (
                                <a
                                    href={project.demoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    <FaExternalLinkAlt className="mr-2" />
                                    演示
                                </a>
                            )}
                        </div>
                    </div>

                    {/* 技术栈 */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">技术栈</h3>
                        <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* 贡献者 */}
                    {project.contributors && project.contributors.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-3">贡献者</h3>
                            <div className="flex flex-wrap gap-4">
                                {project.contributors.map((contributor, index) => (
                                    <a
                                        key={index}
                                        href={contributor.profileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2 group"
                                    >
                                        <img
                                            src={contributor.avatarUrl}
                                            alt={contributor.username}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span className="text-gray-700 group-hover:text-blue-600">
                                            {contributor.username}
                                        </span>
                                        <span className="text-gray-500 text-sm">
                                            ({contributor.contributions} commits)
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 项目内容 */}
                    <div className="prose max-w-none">
                        <ReactMarkdown
                            components={{
                                code({ node, inline, className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    return !inline && match ? (
                                        <SyntaxHighlighter
                                            style={tomorrow}
                                            language={match[1]}
                                            PreTag="div"
                                            {...props}
                                        >
                                            {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                    ) : (
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    );
                                }
                            }}
                        >
                            {project.content}
                        </ReactMarkdown>
                    </div>

                    {/* README */}
                    {readme && (
                        <div className="mt-8">
                            <h2 className="text-2xl font-bold mb-4">README</h2>
                            <div className="prose max-w-none bg-gray-50 p-6 rounded-lg">
                                <ReactMarkdown
                                    components={{
                                        code({ node, inline, className, children, ...props }) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            return !inline && match ? (
                                                <SyntaxHighlighter
                                                    style={tomorrow}
                                                    language={match[1]}
                                                    PreTag="div"
                                                    {...props}
                                                >
                                                    {String(children).replace(/\n$/, '')}
                                                </SyntaxHighlighter>
                                            ) : (
                                                <code className={className} {...props}>
                                                    {children}
                                                </code>
                                            );
                                        }
                                    }}
                                >
                                    {readme}
                                </ReactMarkdown>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectDetail; 