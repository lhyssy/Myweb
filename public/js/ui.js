// UI管理器
export const uiManager = {
    init() {
        this.initElements();
        this.initMobileMenu();
        this.initScrollSpy();
    },

    initElements() {
        this.navbar = document.querySelector('.navbar');
        this.hamburger = document.querySelector('.hamburger');
        this.navLinks = document.querySelector('.nav-links');
        this.backToTop = document.getElementById('backToTop');
    },

    initMobileMenu() {
        this.hamburger.addEventListener('click', () => {
            this.navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // 点击链接后关闭菜单
        this.navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.navLinks.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        });
    },

    initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navItems = document.querySelectorAll('.nav-links a');

        window.addEventListener('scroll', () => {
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= sectionTop - 60) {
                    current = section.getAttribute('id');
                }
            });

            navItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('href').slice(1) === current) {
                    item.classList.add('active');
                }
            });
        });
    },

    updateScrollBasedUI() {
        // 更新返回顶部按钮显示状态
        if (window.scrollY > 500) {
            this.backToTop.classList.add('visible');
        } else {
            this.backToTop.classList.remove('visible');
        }

        // 更新导航栏样式
        if (window.scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
    }
}; 