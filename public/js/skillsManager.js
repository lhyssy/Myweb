class SkillsManager {
    constructor() {
        this.skillBars = document.querySelectorAll('.progress-bar .progress');
        this.skillsContainer = document.querySelector('.skills-container');
        this.initSkills();
        this.addTestControls();
    }

    initSkills() {
        // 初始化技能条数据
        this.skillBars.forEach(bar => {
            const percent = bar.getAttribute('data-target');
            bar.style.setProperty('--progress-width', `${percent}%`);
        });

        // 创建观察器
        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    this.animateSkills();
                    this.updateTestStatus('技能条进入视图，动画已触发');
                }
            },
            { threshold: 0.3 }
        );

        observer.observe(this.skillsContainer);
    }

    animateSkills() {
        this.skillBars.forEach((bar, index) => {
            setTimeout(() => {
                bar.classList.add('animate');
                this.updateTestStatus(`技能条 ${index + 1} 动画已开始`);
            }, index * 200);
        });
    }

    resetAnimations() {
        this.skillBars.forEach(bar => {
            bar.classList.remove('animate');
            void bar.offsetWidth; // 触发重排
        });
        this.updateTestStatus('动画已重置');
        this.animateSkills();
    }

    addTestControls() {
        // 创建测试控制面板
        const controls = document.createElement('div');
        controls.className = 'test-controls';
        controls.innerHTML = `
            <button class="test-button" id="testAnimate">测试动画</button>
            <button class="test-button" id="testReset">重置动画</button>
            <div class="test-status" id="testStatus">测试状态: 就绪</div>
        `;
        this.skillsContainer.appendChild(controls);

        // 绑定测试按钮事件
        document.getElementById('testAnimate').addEventListener('click', () => {
            this.animateSkills();
            this.updateTestStatus('手动触发动画测试');
        });

        document.getElementById('testReset').addEventListener('click', () => {
            this.resetAnimations();
            this.updateTestStatus('手动重置动画测试');
        });
    }

    updateTestStatus(message) {
        const status = document.getElementById('testStatus');
        if (status) {
            const time = new Date().toLocaleTimeString();
            status.textContent = `测试状态: ${message} (${time})`;
        }
        console.log(`[SkillsManager] ${message}`);
    }
}

// 初始化技能管理器
document.addEventListener('DOMContentLoaded', () => {
    const skillsManager = new SkillsManager();
    window.skillsManager = skillsManager; // 暴露给控制台测试
}); 