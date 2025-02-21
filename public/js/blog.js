// 博客管理器
export const blogManager = {
    init() {
        this.blogList = document.getElementById('blogList');
        this.searchInput = document.getElementById('searchInput');
        this.blogUrlInput = document.getElementById('blogUrlInput');
        this.importBtn = document.getElementById('importBlog');
        
        this.initSearch();
        this.initImport();
        this.loadBlogData();
    },

    async loadBlogData() {
        try {
            const response = await fetch('/api/blogs');
            const blogs = await response.json();
            this.renderBlogList(blogs);
        } catch (error) {
            console.error('加载博客数据失败:', error);
            this.showNotification('加载博客数据失败', 'error');
        }
    },

    initSearch() {
        let debounceTimer;
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(async () => {
                const searchTerm = e.target.value.trim();
                if (searchTerm) {
                    try {
                        const response = await fetch(`/api/blogs/search?query=${encodeURIComponent(searchTerm)}`);
                        const blogs = await response.json();
                        this.renderBlogList(blogs);
                    } catch (error) {
                        console.error('搜索失败:', error);
                    }
                } else {
                    this.loadBlogData();
                }
            }, 300);
        });
    },

    initImport() {
        this.importBtn.addEventListener('click', () => this.handleImport());
        this.blogUrlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleImport();
        });
    },

    async handleImport() {
        const url = this.blogUrlInput.value.trim();
        if (!url) return;

        try {
            const articleData = await this.parseArticleUrl(url);
            if (articleData) {
                const response = await fetch('/api/blogs/import', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(articleData)
                });

                if (response.ok) {
                    await this.loadBlogData();
                    this.showImportSuccess();
                    this.blogUrlInput.value = '';
                } else {
                    const error = await response.json();
                    this.showNotification(error.message, 'warning');
                }
            }
        } catch (error) {
            console.error('导入失败:', error);
            this.showNotification('导入失败，请检查链接格式', 'error');
        }
    },

    async parseArticleUrl(url) {
        try {
            if (url.includes('blog.csdn.net')) {
                return await this.parseCSDNArticle(url);
            }
            if (url.includes('github.com')) {
                return await this.parseGithubArticle(url);
            }
            
            return {
                title: '新文章',
                date: new Date().toISOString(),
                summary: url,
                content: '待添加内容',
                tags: ['未分类'],
                url: url,
                readTime: '5 min',
                author: '芥末章鱼',
                platform: 'Other'
            };
        } catch (error) {
            throw new Error('解析文章失败');
        }
    },

    async parseCSDNArticle(url) {
        // 这里可以添加实际的CSDN文章解析逻辑
        return {
            title: "CSDN文章",
            date: new Date().toISOString(),
            summary: "CSDN文章摘要",
            content: "文章内容",
            tags: ["CSDN", "技术"],
            url: url,
            readTime: "10 min",
            platform: "CSDN",
            author: "作者",
            stats: {
                views: 0,
                likes: 0,
                collections: 0
            }
        };
    },

    async parseGithubArticle(url) {
        // 解析GitHub issue或仓库README
        // 这里需要使用GitHub API
        // 注意：可能需要处理API限制和认证
        return {
            title: '从GitHub导入的文章',
            date: new Date().toISOString().split('T')[0],
            summary: '这是一篇从GitHub导入的文章...',
            tags: ['GitHub', '技术'],
            url: url,
            readTime: '5 min'
        };
    },

    showImportSuccess() {
        this.showNotification('文章导入成功', 'success');
    },

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'exclamation-triangle'}"></i>
            ${message}
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    },

    renderBlogList(articles) {
        this.blogList.innerHTML = articles.map(article => `
            <article class="blog-item">
                <div class="blog-header">
                    <h3>
                        <a href="${article.url}" target="_blank" class="blog-title">
                            ${article.title}
                            ${article.platform ? `<span class="platform-badge ${article.platform.toLowerCase()}">${article.platform}</span>` : ''}
                        </a>
                    </h3>
                    <div class="blog-meta">
                        <span class="blog-date">
                            <i class="far fa-calendar-alt"></i> ${new Date(article.date).toLocaleDateString()}
                        </span>
                        <span class="blog-read-time">
                            <i class="far fa-clock"></i> ${article.readTime}
                        </span>
                        <span class="blog-views">
                            <i class="far fa-eye"></i> ${article.stats.views} 阅读
                        </span>
                        <span class="blog-likes">
                            <i class="far fa-thumbs-up"></i> ${article.stats.likes} 点赞
                        </span>
                        <span class="blog-collections">
                            <i class="far fa-star"></i> ${article.stats.collections} 收藏
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
                    <a href="${article.url}" target="_blank" class="read-more">
                        阅读全文 <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </article>
        `).join('');
    }
}; 