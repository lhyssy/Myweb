// 博客管理器
export const blogManager = {
    init() {
        this.blogList = document.getElementById('blogList');
        this.searchInput = document.getElementById('searchInput');
        this.initSearch();
        this.renderBlogList(window.blogData);
    },

    initSearch() {
        this.searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredArticles = window.blogData.filter(article => 
                article.title.toLowerCase().includes(searchTerm) ||
                article.summary.toLowerCase().includes(searchTerm)
            );
            this.renderBlogList(filteredArticles);
        });
    },

    renderBlogList(articles) {
        this.blogList.innerHTML = articles.map(article => `
            <article class="blog-item">
                <h3>${article.title}</h3>
                <div class="blog-date">${article.date}</div>
                <p>${article.summary}</p>
                <div class="blog-tags">
                    ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </article>
        `).join('');
    }
}; 