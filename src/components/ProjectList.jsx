import React, { useState, useEffect } from 'react';
import { FaSearch, FaFilter, FaGithub, FaSync } from 'react-icons/fa';
import ProjectCard from './ProjectCard';
import ProjectFilter from './ProjectFilter';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        category: '',
        tech: [],
        status: 'all'
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [syncStats, setSyncStats] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, [filters, searchQuery, page]);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const queryParams = new URLSearchParams({
                page,
                category: filters.category,
                tech: filters.tech.join(','),
                status: filters.status,
                search: searchQuery
            });

            const response = await fetch(`/api/projects?${queryParams}`);
            if (!response.ok) {
                throw new Error('获取项目列表失败');
            }

            const data = await response.json();
            setProjects(prev => page === 1 ? data.projects : [...prev, ...data.projects]);
            setHasMore(data.hasMore);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchProjects();
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPage(1);
    };

    const loadMore = () => {
        setPage(prev => prev + 1);
    };

    const syncGithubProjects = async () => {
        try {
            setSyncing(true);
            const response = await fetch('/api/github/sync', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('同步GitHub项目失败');
            }

            const data = await response.json();
            setSyncStats(data.stats);
            // 重新加载项目列表
            setPage(1);
            fetchProjects();
        } catch (err) {
            setError(err.message);
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h1 className="text-3xl font-bold mb-4 md:mb-0">我的项目</h1>
                
                <div className="flex items-center space-x-4 w-full md:w-auto">
                    <form onSubmit={handleSearch} className="flex-1 md:w-64">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="搜索项目..."
                                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </form>
                    
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                        <FaFilter />
                        <span>筛选</span>
                    </button>

                    <button
                        onClick={syncGithubProjects}
                        disabled={syncing}
                        className={`flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 ${syncing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <FaGithub />
                        <FaSync className={syncing ? 'animate-spin' : ''} />
                        <span>{syncing ? '同步中...' : '同步GitHub'}</span>
                    </button>
                </div>
            </div>

            {syncStats && (
                <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold mb-2">同步完成</h3>
                    <p>总计: {syncStats.total} 个项目</p>
                    <p>新增: {syncStats.created} 个</p>
                    <p>更新: {syncStats.updated} 个</p>
                    {syncStats.failed > 0 && (
                        <p className="text-red-600">失败: {syncStats.failed} 个</p>
                    )}
                </div>
            )}

            {showFilters && (
                <ProjectFilter
                    filters={filters}
                    onChange={handleFilterChange}
                    onClose={() => setShowFilters(false)}
                />
            )}

            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                    <ProjectCard key={project._id} project={project} />
                ))}
            </div>

            {loading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}

            {!loading && hasMore && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={loadMore}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        加载更多
                    </button>
                </div>
            )}

            {!loading && !hasMore && projects.length > 0 && (
                <div className="text-center text-gray-500 mt-8">
                    没有更多项目了
                </div>
            )}

            {!loading && projects.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                    暂无项目
                </div>
            )}
        </div>
    );
};

export default ProjectList; 