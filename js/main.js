document.addEventListener('DOMContentLoaded', function() {
    // 导航栏响应式切换
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    burger.addEventListener('click', () => {
        // 切换导航菜单
        nav.classList.toggle('nav-active');
        
        // 导航链接动画
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // 汉堡按钮动画
        burger.classList.toggle('toggle');
    });
    
    // 滚动时导航栏样式变化
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        header.classList.toggle('scrolled', window.scrollY > 10);
    });
    
    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // 如果导航菜单是打开的，点击后关闭它
                if (nav.classList.contains('nav-active')) {
                    nav.classList.remove('nav-active');
                    burger.classList.remove('toggle');
                    
                    navLinks.forEach(link => {
                        link.style.animation = '';
                    });
                }
            }
        });
    });
    
    // 作品集过滤功能
    const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItemsForFilter = document.querySelectorAll('.portfolio-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的active类
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // 给当前点击的按钮添加active类
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // 表单交互和提交处理
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        // 为每个输入框添加焦点效果
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            // 焦点效果
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
                
                // 简单验证
                if (this.value.trim() !== '') {
                    this.classList.add('has-value');
                    this.parentElement.classList.add('has-value');
                } else {
                    this.classList.remove('has-value');
                    this.parentElement.classList.remove('has-value');
                }
                
                // 验证邮箱格式
                if (this.type === 'email' && this.value.trim() !== '') {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(this.value)) {
                        this.classList.add('invalid');
                        this.parentElement.classList.add('invalid');
                    } else {
                        this.classList.remove('invalid');
                        this.parentElement.classList.remove('invalid');
                    }
                }
            });
        });
        
        // 表单提交处理
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 验证所有字段
            let isValid = true;
            formInputs.forEach(input => {
                if (input.value.trim() === '') {
                    isValid = false;
                    input.classList.add('invalid');
                    input.parentElement.classList.add('invalid');
                }
                
                if (input.type === 'email') {
                    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailPattern.test(input.value)) {
                        isValid = false;
                        input.classList.add('invalid');
                        input.parentElement.classList.add('invalid');
                    }
                }
            });
            
            if (isValid) {
                // 提交按钮动画
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 发送中...';
                submitBtn.disabled = true;
                
                // 模拟提交延迟
                setTimeout(() => {
                    // 成功提交反馈
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> 发送成功！';
                    submitBtn.style.backgroundColor = '#4CAF50';
                    
                    // 重置表单
                    setTimeout(() => {
                        contactForm.reset();
                        submitBtn.innerHTML = '发送消息 <i class="fas fa-paper-plane"></i>';
                        submitBtn.style.backgroundColor = '';
                        submitBtn.disabled = false;
                        
                        // 重置所有输入框状态
                        formInputs.forEach(input => {
                            input.classList.remove('has-value', 'invalid');
                            input.parentElement.classList.remove('has-value', 'invalid');
                        });
                    }, 2000);
                }, 1500);
            }
        });
    }
    
    // 添加动画效果
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animated');
                
                // 为不同元素添加不同的动画类
                if (element.hasAttribute('data-animation')) {
                    const animationType = element.getAttribute('data-animation');
                    element.classList.add(animationType);
                }
            }
        });
        
        // 为技能条添加动画
        const skillSections = document.querySelectorAll('.skill-category');
        skillSections.forEach(section => {
            const sectionPosition = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionPosition < windowHeight - 100) {
                section.classList.add('animated');
                
                // 为每个技能条设置自定义宽度变量
                const skillLevels = section.querySelectorAll('.skill-level');
                skillLevels.forEach(level => {
                    const width = level.style.width;
                    level.style.setProperty('--skill-percent', width);
                });
            }
        });
        
        // 为关于我部分添加动画
        const aboutSection = document.querySelector('.about-text');
        if (aboutSection) {
            const aboutPosition = aboutSection.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (aboutPosition < windowHeight - 100) {
                aboutSection.classList.add('animated');
            }
        }
    };
    
    // 添加鼠标悬停特效
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left; // 鼠标在元素内的X坐标
            const y = e.clientY - rect.top;  // 鼠标在元素内的Y坐标
            
            // 计算旋转角度，根据鼠标位置调整
            const rotateX = (y - rect.height / 2) / 10;
            const rotateY = (rect.width / 2 - x) / 10;
            
            // 应用3D变换
            item.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        // 鼠标离开时恢复原状
        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
            setTimeout(() => {
                item.style.transition = 'all 0.5s ease';
            }, 100);
        });
        
        // 鼠标进入时移除过渡效果，使动画更流畅
        item.addEventListener('mouseenter', () => {
            item.style.transition = 'all 0.1s ease';
        });
    });
    
    // 初始检查元素是否在视口中
    window.addEventListener('load', animateOnScroll);
    // 滚动时检查
    window.addEventListener('scroll', animateOnScroll);
}); // 结束DOMContentLoaded事件监听器
