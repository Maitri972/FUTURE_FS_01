document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initCustomCursor();
    initParticleCanvas();
    initThemeToggle();
    initTypingEffect();
    initCard3DEffect();
    initNavigation();
    initScrollAnimations();
});

// 1. Loader Engine
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const progressBar = document.querySelector('.loader-progress');
    let width = 0;
    
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            gsap.to(preloader, {
                opacity: 0,
                duration: 0.6,
                onComplete: () => {
                    preloader.style.display = 'none';
                    initHeroReveal();
                }
            });
        } else {
            width += 4;
            if(progressBar) progressBar.style.width = width + '%';
        }
    }, 30);
}

// 2. Custom Glowing Smooth-Follow Cursor
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const dot = document.querySelector('.custom-cursor-dot');
    if (!cursor || !dot) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.left = mouseX + 'px';
        dot.style.top = mouseY + 'px';
    });

    function render() {
        cursorX += (mouseX - cursorX) * 0.12;
        cursorY += (mouseY - cursorY) * 0.12;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(render);
    }
    render();

    const interactiveElements = document.querySelectorAll('a, button, .interactive-card, .form-group input, .form-group textarea');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '60px';
            cursor.style.height = '60px';
            cursor.style.backgroundColor = 'rgba(0, 242, 254, 0.05)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.backgroundColor = 'transparent';
        });
    });
}

// 3. Mathematical Particle Canvas Background
function initParticleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const particleCount = 65;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
            this.alpha = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        draw() {
            const isDark = document.body.classList.contains('dark-mode');
            ctx.fillStyle = isDark ? `rgba(0, 242, 254, ${this.alpha})` : `rgba(15, 23, 42, ${this.alpha * 0.4})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// 4. Dark & Light Mode Engine
function initThemeToggle() {
    const toggleBtn = document.getElementById('themeToggle');
    if (!toggleBtn) return;
    const icon = toggleBtn.querySelector('i');

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        document.body.classList.toggle('dark-mode');
        
        const isLight = document.body.classList.contains('light-mode');
        icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
        
        gsap.fromTo(toggleBtn, { rotate: 0 }, { rotate: 180, duration: 0.4, ease: "power2.out" });
    });
}

// 5. Hero Dynamic Typing Automation
function initTypingEffect() {
    const target = document.getElementById('typingText');
    if (!target) return;
    const roles = ["Computer Engineer", "Full-Stack Developer", "Problem Solver"];
    let roleIdx = 0, charIdx = 0, isDeleting = false;

    function type() {
        const currentRole = roles[roleIdx];
        if (isDeleting) {
            target.textContent = currentRole.substring(0, charIdx - 1);
            charIdx--;
        } else {
            target.textContent = currentRole.substring(0, charIdx + 1);
            charIdx++;
        }

        let typeSpeed = isDeleting ? 40 : 90;

        if (!isDeleting && charIdx === currentRole.length) {
            typeSpeed = 1600;
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            typeSpeed = 400;
        }
        setTimeout(type, typeSpeed);
    }
    setTimeout(type, 500);
}

// 6. 3D Card Hover Inertial Tilt
function initCard3DEffect() {
    const cards = document.querySelectorAll('.interactive-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            const angleX = (yc - y) / 16;
            const angleY = (x - xc) / 16;

            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
}

// 7. Navigation Matrix Links & Scroll Bars
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link');
    const progressBar = document.getElementById('progressBar');
    const backToTop = document.getElementById('backToTop');

    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinksContainer.classList.toggle('active');
        });

        navLinks.forEach(link => link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinksContainer.classList.remove('active');
        }));
    }

    window.addEventListener('scroll', () => {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progress = (window.pageYOffset / totalHeight) * 100;
            if(progressBar) progressBar.style.width = `${progress}%`;
        }

        if (window.pageYOffset > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        const sections = document.querySelectorAll('section');
        let currentSection = '';
        sections.forEach(sec => {
            const top = sec.offsetTop - 120;
            if (window.pageYOffset >= top) {
                currentSection = sec.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    if(backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// 8. Core GSAP Entrance Transitions
function initHeroReveal() {
    if (typeof gsap === 'undefined') return;
    const tl = gsap.timeline();
    tl.from('.navbar', { y: -40, opacity: 0, duration: 0.8, ease: 'power3.out' })
      .from('.hero-badge', { scale: 0.8, opacity: 0, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.2')
      .from('.hero-title', { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
      .from('.hero-subtitle', { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
      .from('.hero-description', { y: 20, opacity: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3')
      .from('.hero-ctas .btn', { y: 15, opacity: 0, duration: 0.4, stagger: 0.15, ease: 'power3.out' }, '-=0.2');
}

// 9. Scroll Trigger Reveals
function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const revealSections = ['#about', '#skills', '#journey', '#contact'];
    revealSections.forEach(selector => {
        gsap.from(`${selector} .section-header`, {
            scrollTrigger: {
                trigger: selector,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 35, opacity: 0, duration: 0.7, ease: 'power3.out'
        });
    });

    gsap.from('.about-grid > *', {
        scrollTrigger: { trigger: '.about-grid', start: 'top 80%' },
        y: 40, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out'
    });

    gsap.from('.skill-category', {
        scrollTrigger: { trigger: '.skills-grid', start: 'top 82%' },
        y: 40, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
        onComplete: () => {
            document.querySelectorAll('.p-fill').forEach(fill => {
                fill.style.transform = 'scaleX(1)';
            });
        }
    });

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        const directionX = item.classList.contains('left') ? -50 : 50;
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: 'top 85%'
            },
            x: directionX, opacity: 0, duration: 0.8, ease: 'power3.out'
        });
    });

    gsap.from('.contact-info > *, .contact-form .form-group', {
        scrollTrigger: { trigger: '.contact-grid', start: 'top 80%' },
        y: 20, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out'
    });
}

const contactForm = document.getElementById('contactForm');
if(contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('.form-submit-btn');
        submitBtn.innerHTML = 'Sending... <i class="fas fa-circle-notch fa-spin"></i>';
        
        setTimeout(() => {
            submitBtn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
            submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            contactForm.reset();
        }, 1500);
    });
}