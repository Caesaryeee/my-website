document.addEventListener('DOMContentLoaded', function() {
    // 创建新的Canvas动态背景
    const createCanvasBackground = function() {
        // 创建Canvas元素
        const canvas = document.createElement('canvas');
        canvas.id = 'background-canvas';
        document.body.appendChild(canvas);
        
        // 创建动态背景容器
        const dynamicBg = document.createElement('div');
        dynamicBg.className = 'dynamic-bg';
        document.body.appendChild(dynamicBg);
        
        // 设置Canvas尺寸
        const resizeCanvas = function() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        // 初始调整尺寸
        resizeCanvas();
        
        // 窗口大小变化时调整Canvas尺寸
        window.addEventListener('resize', resizeCanvas);
        
        // 获取Canvas上下文
        const ctx = canvas.getContext('2d');
        
        // 创建粒子数组
        const particles = [];
        const particleCount = 50; // 粒子数量
        
        // 粒子类
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 5 + 1;
                this.speedX = Math.random() * 3 - 1.5;
                this.speedY = Math.random() * 3 - 1.5;
                this.color = `rgba(229, 9, 20, ${Math.random() * 0.5})`;
            }
            
            // 更新粒子位置
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // 边界检查
                if (this.x > canvas.width) this.x = 0;
                else if (this.x < 0) this.x = canvas.width;
                
                if (this.y > canvas.height) this.y = 0;
                else if (this.y < 0) this.y = canvas.height;
            }
            
            // 绘制粒子
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // 初始化粒子
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        // 连接粒子的函数
        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        const opacity = 1 - distance / 150;
                        ctx.strokeStyle = `rgba(229, 9, 20, ${opacity * 0.2})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        // 动画循环
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // 更新并绘制所有粒子
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            
            // 连接粒子
            connectParticles();
            
            requestAnimationFrame(animate);
        }
        
        // 启动动画
        animate();
    };
    
    // 调用创建Canvas背景函数
    createCanvasBackground();
    
    // 增强的视差滚动效果
    const throttleScroll = (function() {
        let lastTime = 0;
        const limit = 16; // 约60fps的刷新率
        return function(callback) {
            const now = Date.now();
            if (now - lastTime >= limit) {
                callback();
                lastTime = now;
            }
        };
    })();

    window.addEventListener('scroll', function() {
        throttleScroll(() => {
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            
            // 更新滚动进度指示器
            const scrollProgress = scrollPosition / (documentHeight - windowHeight);
            
            // 为各个部分添加视差效果
            document.querySelectorAll('section').forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionMiddle = sectionTop + sectionHeight / 2;
                
                // 计算section在视口中的位置比例 (-1到1之间)
                const viewportPosition = (sectionMiddle - scrollPosition - windowHeight / 2) / windowHeight;
                
                // 减小视差效果强度
                const backgroundShift = viewportPosition * 30; // 降低视差强度
                
                // 应用背景位移 - 使用更平滑的过渡
                section.style.backgroundPositionY = `calc(50% + ${backgroundShift}px)`;
                
                // 为内容添加更轻微的视差效果
                const contentElements = section.querySelectorAll('.container > *');
                contentElements.forEach((element, elementIndex) => {
                    const delay = elementIndex * 0.03; // 减小延迟时间
                    const elementShift = viewportPosition * 10 * (1 - delay); // 大幅减小内容的视差强度
                    element.style.transform = `translateY(${elementShift}px)`;
                });
                
                // 为视差层添加温和效果
                const parallaxLayer = section.querySelector('.parallax-layer');
                if (parallaxLayer) {
                    const layerShift = viewportPosition * 50; // 减小视差层的视差强度
                    const rotationEffect = viewportPosition * 0.3; // 减小旋转效果
                    parallaxLayer.style.transform = `translateY(${layerShift}px) rotate(${rotationEffect}deg)`;
                    const opacityChange = 0.6 + (Math.abs(viewportPosition) * 0.05); // 减小透明度变化
                    parallaxLayer.style.opacity = opacityChange.toFixed(2);
                }
                
                // 为动态背景添加更平滑的效果
                const dynamicBg = section.querySelector('.dynamic-bg');
                if (dynamicBg) {
                    const bgShift = -viewportPosition * 20; // 减小背景移动幅度
                    dynamicBg.style.transform = `translateY(${bgShift}px)`;
                }
            });
        });
    }, { passive: true });
    
    // 鼠标移动跟随效果已移除，保留滚动效果
    
    // 添加滚动进度指示器
    const createScrollIndicator = function() {
        // 创建进度条容器
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        indicator.style.position = 'fixed';
        indicator.style.top = '0';
        indicator.style.left = '0';
        indicator.style.height = '4px';
        indicator.style.backgroundColor = '#e50914';
        indicator.style.zIndex = '2000';
        indicator.style.width = '0%';
        indicator.style.transition = 'width 0.1s ease-out';
        document.body.appendChild(indicator);
        
        // 更新进度条
        window.addEventListener('scroll', function() {
            const windowHeight = document.documentElement.clientHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY / documentHeight * 100;
            indicator.style.width = scrolled + '%';
        });
    };
    createScrollIndicator();
    
    // 添加页面切换的水平滑动效果
    let startX, startY, dist, threshold = 150, allowedTime = 300, elapsedTime, startTime;
    
    // 获取所有主要部分
    const sections = Array.from(document.querySelectorAll('section'));
    let currentSectionIndex = 0;
    
    // 触摸事件开始
    document.addEventListener('touchstart', function(e) {
        const touchobj = e.changedTouches[0];
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime();
    }, false);
    
    // 触摸事件结束
    document.addEventListener('touchend', function(e) {
        const touchobj = e.changedTouches[0];
        dist = touchobj.pageX - startX;
        elapsedTime = new Date().getTime() - startTime;
        
        // 检查是否为水平滑动
        const distY = Math.abs(touchobj.pageY - startY);
        
        // 如果是快速的水平滑动，且垂直移动较小
        if (elapsedTime <= allowedTime && Math.abs(dist) >= threshold && distY <= 100) {
            // 向右滑动，显示上一部分
            if (dist > 0 && currentSectionIndex > 0) {
                currentSectionIndex--;
                scrollToSection(sections[currentSectionIndex]);
            }
            // 向左滑动，显示下一部分
            else if (dist < 0 && currentSectionIndex < sections.length - 1) {
                currentSectionIndex++;
                scrollToSection(sections[currentSectionIndex]);
            }
        }
    }, false);
    
    // 滚动到指定部分
    function scrollToSection(section) {
        window.scrollTo({
            top: section.offsetTop - 70,
            behavior: 'smooth'
        });
    }
    
    // 添加键盘导航
    document.addEventListener('keydown', function(e) {
        // 更新当前部分索引
        updateCurrentSectionIndex();
        
        // 向上箭头或左箭头 - 上一部分
        if ((e.key === 'ArrowUp' || e.key === 'ArrowLeft') && currentSectionIndex > 0) {
            currentSectionIndex--;
            scrollToSection(sections[currentSectionIndex]);
        }
        // 向下箭头或右箭头 - 下一部分
        else if ((e.key === 'ArrowDown' || e.key === 'ArrowRight') && currentSectionIndex < sections.length - 1) {
            currentSectionIndex++;
            scrollToSection(sections[currentSectionIndex]);
        }
    });
    
    // 更新当前部分索引
    function updateCurrentSectionIndex() {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        for (let i = 0; i < sections.length; i++) {
            const section = sections[i];
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSectionIndex = i;
                break;
            }
        }
    }
    
    // 添加滚轮动画效果
    let isScrolling = false;
    window.addEventListener('wheel', function(e) {
        if (!isScrolling) {
            isScrolling = true;
            
            // 更新当前部分索引
            updateCurrentSectionIndex();
            
            // 向上滚动 - 上一部分
            if (e.deltaY < 0 && currentSectionIndex > 0) {
                currentSectionIndex--;
                scrollToSection(sections[currentSectionIndex]);
            }
            // 向下滚动 - 下一部分
            else if (e.deltaY > 0 && currentSectionIndex < sections.length - 1) {
                currentSectionIndex++;
                scrollToSection(sections[currentSectionIndex]);
            }
            
            // 防止频繁触发
            setTimeout(function() {
                isScrolling = false;
            }, 800);
        }
    }, { passive: true });
    
    // 删除重复的动态背景函数声明，只保留对已定义函数的调用
    // 重用已定义的动态背景函数
    // createDynamicBackground();
});

// 时间轴交互功能
const initTimelineInteraction = function() {
    // 为时间轴点添加脉动动画
    const timelineDots = document.querySelectorAll('.timeline-dot');
    timelineDots.forEach(dot => {
        // 添加脉动动画
        dot.style.animation = `timelinePulse 2s infinite`;
        
        // 点击时间点时展开对应的内容
        dot.addEventListener('click', function() {
            const timelineContent = this.nextElementSibling;
            timelineContent.classList.toggle('expanded');
            
            // 更新查看更多/收起文本
            const toggleBtn = timelineContent.querySelector('.timeline-toggle');
            if (toggleBtn) {
                toggleBtn.textContent = timelineContent.classList.contains('expanded') ? '收起' : '查看更多';
            }
        });
    });
    
    // 为查看更多按钮添加点击事件
    const toggleButtons = document.querySelectorAll('.timeline-toggle');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const timelineContent = this.parentElement;
            timelineContent.classList.toggle('expanded');
            this.textContent = timelineContent.classList.contains('expanded') ? '收起' : '查看更多';
        });
    });
    
    // 为时间轴项添加增强的视差滚动效果
    const timelineItems = document.querySelectorAll('.timeline-item');
    // 重用已定义的timelineDots变量
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        
        timelineItems.forEach((item, index) => {
            const itemTop = item.getBoundingClientRect().top + scrollPosition;
            const itemHeight = item.offsetHeight;
            const windowHeight = window.innerHeight;
            
            // 计算item在视口中的位置比例
            const viewportPosition = (itemTop - scrollPosition - windowHeight / 2) / (windowHeight / 2);
            
            // 应用增强的视差效果
            const translateY = viewportPosition * -20; // 增强视差强度
            const translateX = viewportPosition * (index % 2 === 0 ? 5 : -5); // 添加水平方向的轻微移动
            const scale = 1 - Math.abs(viewportPosition) * 0.05;
            const opacity = 1 - Math.abs(viewportPosition) * 0.3;
            const rotateY = viewportPosition * (index % 2 === 0 ? 2 : -2); // 添加轻微的3D旋转
            
            // 仅在元素接近视口时应用效果
            if (Math.abs(viewportPosition) < 1.5) {
                item.style.transform = `translateY(${translateY}px) translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`;
                item.style.opacity = opacity > 0.5 ? opacity : 0.5;
                
                // 当元素完全进入视口时添加高亮效果
                if (Math.abs(viewportPosition) < 0.3) {
                    item.classList.add('timeline-highlight');
                } else {
                    item.classList.remove('timeline-highlight');
                }
            }
        });
        
        // 为时间轴点添加动态效果
        timelineDots.forEach((dot, index) => {
            const dotTop = dot.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            // 当时间轴点进入视口时增强动画效果
            if (dotTop < windowHeight * 0.8 && dotTop > 0) {
                dot.style.animationDuration = '1.5s';
                dot.style.transform = 'scale(1.2)';
            } else {
                dot.style.animationDuration = '2s';
                dot.style.transform = 'scale(1)';
            }
        });
    });
};

// 视差效果核心函数
function createParallaxEffects() {
  // 缓存视口尺寸
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight
  };

  // 统一处理所有视差元素
  function updateParallaxElements(scrollPos) {
    document.querySelectorAll('section').forEach((section, index) => {
      const sectionRect = section.getBoundingClientRect();
      const progress = (sectionRect.top + scrollPos) / (viewport.height * 2);
      
      applySectionParallax(section, progress);
      applyContentParallax(section, progress);
      applyLayerEffects(section, progress);
    });
  }

  // 节流滚动处理
  const throttleScroll = (function() {
    let lastTime = 0;
    return function(callback, limit = 100) {
      const now = Date.now();
      if (now - lastTime >= limit) {
        callback();
        lastTime = now;
      }
    };
  })();

  // 初始化滚动监听
  function initScrollListener() {
    window.addEventListener('scroll', () => {
      throttleScroll(() => {
        updateParallaxElements(window.scrollY);
      });
    }, { passive: true });
  }

  return {
    init: initScrollListener
  };
}

// 在页面加载完成后初始化时间轴交互功能
document.addEventListener('DOMContentLoaded', function() {
    // 其他初始化代码...
    
    // 删除重复的initTimelineInteraction函数定义
    initTimelineInteraction();
});

// 滚动动画触发
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < window.innerHeight * 0.8) {
            el.classList.add('visible');
        }
    });
};

// 技能条动画延迟触发
const animateSkillBars = () => {
    document.querySelectorAll('.skill-level').forEach((bar, index) => {
        bar.style.animationDelay = `${index * 0.2}s`;
    });
};

// 初始化事件监听
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', () => {
    animateOnScroll();
    animateSkillBars();
});