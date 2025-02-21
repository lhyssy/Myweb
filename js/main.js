// 主程序入口
import { themeManager } from './theme.js';
import { animationManager } from './animation.js';
import { projectManager } from './project.js';
import { blogManager } from './blog.js';
import { uiManager } from './ui.js';

class App {
    constructor() {
        this.initManagers();
        this.bindEvents();
    }

    initManagers() {
        // 初始化各个功能管理器
        this.themeManager = themeManager;
        this.animationManager = animationManager;
        this.projectManager = projectManager;
        this.blogManager = blogManager;
        this.uiManager = uiManager;

        // 启动各个管理器
        Object.values(this).forEach(manager => {
            if (manager && typeof manager.init === 'function') {
                manager.init();
            }
        });
    }

    bindEvents() {
        // 监听页面加载完成
        window.addEventListener('load', () => {
            document.body.classList.add('loaded');
        });

        // 监听页面滚动
        window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
    }

    handleScroll() {
        requestAnimationFrame(() => {
            this.uiManager.updateScrollBasedUI();
        });
    }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
}); 