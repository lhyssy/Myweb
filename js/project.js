// 项目管理器
export const projectManager = {
    init() {
        this.initModal();
        this.loadProjects();
    },

    initModal() {
        this.modal = document.getElementById('projectModal');
        this.closeBtn = this.modal.querySelector('.close-modal');
        
        // 关闭模态框事件
        this.closeBtn.addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
    },

    loadProjects() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            const viewButton = card.querySelector('.view-details');
            viewButton.addEventListener('click', () => {
                const title = card.querySelector('h3').textContent;
                this.openModal(title);
            });
        });
    },

    openModal(projectTitle) {
        const data = this.getProjectData(projectTitle);
        if (!data) return;

        document.getElementById('modalTitle').textContent = projectTitle;
        document.getElementById('modalImage').src = data.image;
        
        // 填充技术栈
        document.getElementById('modalTechStack').innerHTML = 
            data.techStack.map(tech => `<li>${tech}</li>`).join('');
        
        // 填充成果
        document.getElementById('modalAchievements').innerHTML = 
            data.achievements.map(achievement => `<li>${achievement}</li>`).join('');
        
        // 填充链接
        document.getElementById('modalLinks').innerHTML = 
            data.links.map(link => `<a href="${link.url}" target="_blank">${link.text}</a>`).join('');

        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    },

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    },

    getProjectData(title) {
        // 从全局变量获取项目数据
        return window.projectData[title];
    }
}; 