class SkillsManager {
    constructor() {
        this.skillBars = document.querySelectorAll('.progress-bar .progress');
        this.initSkills();
    }

    initSkills() {
        // 创建 Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkill(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
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
        });
    }

    // 主题变化时重新应用动画
    handleThemeChange() {
        this.resetAnimations();
        setTimeout(() => {
            this.skillBars.forEach(bar => {
                this.animateSkill(bar);
            });
        }, 100);
    }
}

export const skillsManager = new SkillsManager();

// 监听主题变化
window.addEventListener('themechange', () => {
    skillsManager.handleThemeChange();
}); 