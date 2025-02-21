// 主程序入口
import { themeManager } from './themeManager.js';
import { skillsManager } from './skillsManager.js';
import { blogManager } from './blogManager.js';

// 页面加载进度条
class PageLoader {
    constructor() {
        this.progressBar = document.createElement('div');
        this.progressBar.className = 'progress-bar-container';
        this.progressBar.innerHTML = '<div class="progress"></div>';
        document.body.appendChild(this.progressBar);
        
        this.progress = this.progressBar.querySelector('.progress');
        this.initializeLoader();
    }

    initializeLoader() {
        let width = 0;
        const interval = setInterval(() => {
            if (width >= 90) clearInterval(interval);
            width += Math.random() * 10;
            this.updateProgress(Math.min(width, 90));
        }, 100);

        window.addEventListener('load', () => {
            this.updateProgress(100);
            setTimeout(() => {
                this.progressBar.style.opacity = '0';
                setTimeout(() => this.progressBar.remove(), 300);
            }, 500);
        });
    }

    updateProgress(width) {
        this.progress.style.width = `${width}%`;
    }
}

// 图片懒加载
class LazyLoader {
    constructor() {
        this.images = document.querySelectorAll('img[data-src]');
        this.initializeLazyLoading();
    }

    initializeLazyLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    imageObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px'
        });

        this.images.forEach(img => {
            img.classList.add('lazy-image');
            imageObserver.observe(img);
        });
    }

    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;

        img.src = src;
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    }
}

// 平滑滚动
class SmoothScroll {
    constructor() {
        this.initializeSmoothScroll();
    }

    initializeSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerOffset = 70;
                    const elementPosition = target.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// 导航栏效果
class NavigationManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.navLinks = document.querySelector('.nav-links');
        this.initializeNavigation();
    }

    initializeNavigation() {
        // 滚动效果
        window.addEventListener('scroll', () => {
            this.navbar.classList.toggle('scrolled', window.scrollY > 50);
        });

        // 移动端菜单
        this.hamburger.addEventListener('click', () => {
            this.navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // 点击链接后关闭菜单
        this.navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                this.navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
}

// 初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    new PageLoader();
    new LazyLoader();
    new SmoothScroll();
    new NavigationManager();

    // 添加页面淡入效果
    document.body.classList.add('fade-in');
}); 