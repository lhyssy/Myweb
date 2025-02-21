import { parseArticle } from './parsers/articleParser.js';
import { showNotification } from './utils/notification.js';

class BlogManager {
    constructor() {
        this.initElements();
        this.initEventListeners();
        this.loadBlogData();
    }

    initElements() {
        this.blogList = document.getElementById('blogList');
        this.searchInput = document.getElementById('searchInput');
        this.blogUrlInput = document.getElementById('blogUrlInput');
        this.importBtn = document.getElementById('importBlog');
        this.filterTags = document.getElementById('filterTags');
        this.sortSelect = document.getElementById('sortSelect');
    }

    initEventListeners() {
        // 搜索防抖
        let searchTimeout;
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => this.handleSearch(e.target.value), 300);
        });

        // 导入文章
        this.importBtn.addEventListener('click', () => this.handleImport());
        this.blogUrlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleImport();
        });

        // 标签筛选
        if (this.filterTags) {
            this.filterTags.addEventListener('change', () => this.applyFilters());
        }

        // 排序
        if (this.sortSelect) {
            this.sortSelect.addEventListener('change', () => this.applyFilters());
        }
    }

    async loadBlogData() {
        try {
            const response = await fetch('/api/blogs');
            if (!response.ok) throw new Error('加载博客数据失败');
            
            const blogs = await response.json();
            this.renderBlogList(blogs);
            this.updateTagsList(blogs);
        } catch (error) {
            console.error('加载博客失败:', error);
            showNotification('加载博客数据失败', 'error');
        }
    }

    async handleImport() {
        const url = this.blogUrlInput.value.trim();
        if (!url) {
            showNotification('请输入文章链接', 'warning');
            return;
        }

        try {
            const articleData = await parseArticle(url);
            if (!articleData) {
                showNotification('无法解析该文章链接', 'error');
                return;
            }

            const response = await fetch('/api/blogs/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(articleData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message);
            }

            await this.loadBlogData();
            this.blogUrlInput.value = '';
            showNotification('文章导入成功', 'success');
        } catch (error) {
            console.error('导入失败:', error);
            showNotification(error.message || '导入失败，请检查链接格式', 'error');
        }
    }

    async handleSearch(query) {
        try {
            const response = await fetch(`/api/blogs/search?query=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('搜索失败');
            
            const blogs = await response.json();
            this.renderBlogList(blogs);
        } catch (error) {
            console.error('搜索失败:', error);
            showNotification('搜索失败', 'error');
        }
    }

    updateTagsList(blogs) {
        if (!this.filterTags) return;
        
        const tags = new Set();
        blogs.forEach(blog => blog.tags.forEach(tag => tags.add(tag)));
        
        this.filterTags.innerHTML = '<option value="">所有标签</option>' +
            Array.from(tags).map(tag => 
                `<option value="${tag}">${tag}</option>`
            ).join('');
    }

    async applyFilters() {
        const tag = this.filterTags?.value;
        const sort = this.sortSelect?.value || 'date';
        
        try {
            const query = new URLSearchParams({ tag, sort }).toString();
            const response = await fetch(`/api/blogs/filter?${query}`);
            if (!response.ok) throw new Error('筛选失败');
            
            const blogs = await response.json();
            this.renderBlogList(blogs);
        } catch (error) {
            console.error('筛选失败:', error);
            showNotification('筛选失败', 'error');
        }
    }

    async updateStats(blogId, type) {
        try {
            const response = await fetch(`/api/blogs/${blogId}/stats`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type })
            });

            if (!response.ok) throw new Error('更新统计失败');
            
            const updatedBlog = await response.json();
            this.updateBlogStats(blogId, updatedBlog.stats);
        } catch (error) {
            console.error('更新统计失败:', error);
        }
    }

    updateBlogStats(blogId, stats) {
        const blogElement = document.querySelector(`[data-blog-id="${blogId}"]`);
        if (!blogElement) return;

        const statsElements = {
            views: blogElement.querySelector('.blog-views span'),
            likes: blogElement.querySelector('.blog-likes span'),
            collections: blogElement.querySelector('.blog-collections span')
        };

        Object.entries(stats).forEach(([key, value]) => {
            if (statsElements[key]) {
                statsElements[key].textContent = value;
            }
        });
    }

    renderBlogList(articles) {
        this.blogList.innerHTML = articles.map(article => `
            <article class="blog-item" data-blog-id="${article._id}">
                <div class="blog-header">
                    <h3>
                        <a href="${article.url}" target="_blank" class="blog-title" 
                           onclick="blogManager.updateStats('${article._id}', 'view')">
                            ${article.title}
                            ${article.platform ? 
                                `<span class="platform-badge ${article.platform.toLowerCase()}">${article.platform}</span>` 
                                : ''}
                        </a>
                    </h3>
                    <div class="blog-meta">
                        <span class="blog-date">
                            <i class="far fa-calendar-alt"></i> 
                            ${new Date(article.date).toLocaleDateString()}
                        </span>
                        <span class="blog-author">
                            <i class="far fa-user"></i> ${article.author}
                        </span>
                        <span class="blog-read-time">
                            <i class="far fa-clock"></i> ${article.readTime}
                        </span>
                    </div>
                </div>
                <p class="blog-summary">${article.summary}</p>
                <div class="blog-footer">
                    <div class="blog-tags">
                        ${article.tags.map(tag => `
                            <span class="tag">
                                <i class="fas fa-tag"></i> ${tag}
                            </span>
                        `).join('')}
                    </div>
                    <div class="blog-stats">
                        <span class="blog-views">
                            <i class="far fa-eye"></i> 
                            <span>${article.stats.views}</span> 阅读
                        </span>
                        <button class="blog-likes" onclick="blogManager.updateStats('${article._id}', 'like')">
                            <i class="far fa-thumbs-up"></i> 
                            <span>${article.stats.likes}</span> 点赞
                        </button>
                        <button class="blog-collections" onclick="blogManager.updateStats('${article._id}', 'collect')">
                            <i class="far fa-star"></i> 
                            <span>${article.stats.collections}</span> 收藏
                        </button>
                    </div>
                    <a href="${article.url}" target="_blank" class="read-more" 
                       onclick="blogManager.updateStats('${article._id}', 'view')">
                        阅读全文 <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </article>
        `).join('');
    }
}

export const blogManager = new BlogManager(); 