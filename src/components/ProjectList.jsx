import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from './ProjectCard';
import ProjectFilter from './ProjectFilter';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        category: '',
        technology: '',
        status: '',
        search: ''
    });
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, [filters, page]);

    const fetchProjects = async () => {
        try {
            const queryParams = new URLSearchParams({
                ...filters,
                page,
                limit: 9
            });

            const response = await fetch(`/api/projects?${queryParams}`);
            const data = await response.json();

            if (page === 1) {
                setProjects(data.projects);
            } else {
                setProjects(prev => [...prev, ...data.projects]);
            }

            setHasMore(data.pagination.page < data.pagination.pages);
            setLoading(false);
        } catch (err) {
            setError('获取项目列表失败');
            setLoading(false);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPage(1);
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    if (loading && page === 1) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 py-8">
                <p>{error}</p>
                <button 
                    onClick={() => {
                        setError(null);
                        fetchProjects();
                    }}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    重试
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <ProjectFilter 
                filters={filters} 
                onFilterChange={handleFilterChange} 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {projects.map((project, index) => (
                    <motion.div
                        key={project._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                        <ProjectCard project={project} />
                    </motion.div>
                ))}
            </div>

            {hasMore && (
                <div className="text-center mt-8">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className={`px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors
                            ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? '加载中...' : '加载更多'}
                    </button>
                </div>
            )}

            {!loading && projects.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                    <p className="text-xl">暂无项目</p>
                </div>
            )}
        </div>
    );
};

export default ProjectList; 