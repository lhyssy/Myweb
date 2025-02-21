class SkillsManager {
    constructor() {
        this.skillBars = document.querySelectorAll('.progress-bar .progress');
        this.initSkills();
        this.bindThemeChangeEvent();
    }

    initSkills() {
        // 创建 Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkill(entry.target);
                }
            });
        }, {
            threshold: 0.5,
            rootMargin: '0px'
        });

        // 观察所有技能条
        this.skillBars.forEach(bar => {
            const percent = bar.getAttribute('data-target');
            bar.style.setProperty('--progress-width', `${percent}%`);
            observer.observe(bar);
        });
    }

    animateSkill(bar) {
        requestAnimationFrame(() => {
            bar.classList.add('animate');
        });
    }

    // 重置动画
    resetAnimations() {
        this.skillBars.forEach(bar => {
            bar.classList.remove('animate');
            void bar.offsetWidth; // 触发重排以重置动画
            this.animateSkill(bar);
        });
    }

    bindThemeChangeEvent() {
        window.addEventListener('themechange', () => {
            this.resetAnimations();
        });
    }
}

// 初始化技能管理器
document.addEventListener('DOMContentLoaded', () => {
    new SkillsManager();
}); 