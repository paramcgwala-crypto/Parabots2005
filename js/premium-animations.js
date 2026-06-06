// ===================================
// PARAMCGWALABOTS - Premium Animations
// ===================================

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ===================================
// Loading Screen Animation
// ===================================
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (!loadingScreen) return;

    // Hide loading screen after page load
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            
            // Remove from DOM after animation
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1500);
    });
}

// ===================================
// Mouse Follow Glow Effect
// ===================================
function initMouseGlow() {
    const mouseGlow = document.getElementById('mouseGlow');
    if (!mouseGlow) return;

    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateGlow() {
        // Smooth follow effect
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;

        mouseGlow.style.left = `${glowX}px`;
        mouseGlow.style.top = `${glowY}px`;

        requestAnimationFrame(animateGlow);
    }

    animateGlow();
}

// ===================================
// Floating Particles
// ===================================
function initParticles() {
    const particlesContainer = document.getElementById('particlesContainer');
    if (!particlesContainer) return;

    const particleCount = 50;
    const colors = ['#00F5D4', '#00BBF9', '#9B5DE5'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 4 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.background = color;
        particle.style.left = `${left}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;

        particlesContainer.appendChild(particle);
    }
}

// ===================================
// GSAP ScrollTrigger Animations
// ===================================
function initScrollAnimations() {
    // Hero Section Animations
    gsap.from('.hero-content', {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.5,
        ease: 'power3.out'
    });

    gsap.from('.founder-section', {
        opacity: 0,
        x: -50,
        duration: 1,
        delay: 0.7,
        ease: 'power3.out'
    });

    // Section Headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power2.out'
        });
    });

    // Glass Cards
    gsap.utils.toArray('.glass-card').forEach((card, i) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power2.out'
        });
    });

    // Service Cards with Stagger
    gsap.from('.service-card', {
        scrollTrigger: {
            trigger: '.services-section',
            start: 'top 70%'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
    });

    // Bot Cards with Stagger
    gsap.from('.bot-card', {
        scrollTrigger: {
            trigger: '.bots-section',
            start: 'top 70%'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
    });

    // Course Cards with Stagger
    gsap.from('.course-card', {
        scrollTrigger: {
            trigger: '.courses-section',
            start: 'top 70%'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
    });

    // Project Cards with Stagger
    gsap.from('.project-card', {
        scrollTrigger: {
            trigger: '.projects-section',
            start: 'top 70%'
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
    });

    // Trust Numbers Counter Animation
    gsap.utils.toArray('.trust-number').forEach(number => {
        const target = parseInt(number.getAttribute('data-target'));
        
        gsap.to(number, {
            scrollTrigger: {
                trigger: number,
                start: 'top 80%',
                once: true
            },
            innerText: target,
            duration: 2,
            snap: { innerText: 1 },
            ease: 'power1.out'
        });
    });

    // Stat Numbers Counter Animation
    gsap.utils.toArray('.stat-number[data-count]').forEach(stat => {
        const target = parseInt(stat.getAttribute('data-count'));
        
        gsap.to(stat, {
            scrollTrigger: {
                trigger: stat,
                start: 'top 80%',
                once: true
            },
            innerText: target,
            duration: 2,
            snap: { innerText: 1 },
            ease: 'power1.out'
        });
    });

    // Parallax Effect for Hero
    gsap.to('.hero-section', {
        scrollTrigger: {
            trigger: '.hero-section',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        backgroundPosition: '50% 100%',
        ease: 'none'
    });

    // Navbar Scroll Effect
    ScrollTrigger.create({
        start: 'top -80',
        end: 99999,
        toggleClass: {className: 'scrolled', targets: '.navbar'}
    });
}

// ===================================
// Magnetic Buttons Effect
// ===================================
function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-cta, .btn-premium');

    magneticBtns.forEach(btn => {
        btn.classList.add('magnetic-btn');

        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.5)'
            });
        });
    });
}

// ===================================
// Tilt Card Effect
// ===================================
function initTiltCards() {
    const tiltCards = document.querySelectorAll('.glass-card');

    tiltCards.forEach(card => {
        card.classList.add('tilt-card');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
    });
}

// ===================================
// Scroll Reveal Animation
// ===================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');

    revealElements.forEach(el => {
        gsap.fromTo(el, 
            {
                opacity: 0,
                y: 50
            },
            {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power2.out'
            }
        );
    });
}

// ===================================
// Smooth Scroll
// ===================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: target,
                        offsetY: 80
                    },
                    ease: 'power3.inOut'
                });
            }
        });
    });
}

// ===================================
// Premium Card Hover Effects
// ===================================
function initPremiumCards() {
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        card.classList.add('premium-card');
    });
}

// ===================================
// Gradient Text Animation
// ===================================
function initGradientText() {
    const gradientTexts = document.querySelectorAll('.hero-title, .section-title');

    gradientTexts.forEach(text => {
        text.classList.add('gradient-text-animated');
    });
}

// ===================================
// Initialize All Animations
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize loading screen first
    initLoadingScreen();
    
    // Initialize other animations after a short delay
    setTimeout(() => {
        initMouseGlow();
        initParticles();
        initScrollAnimations();
        initMagneticButtons();
        initTiltCards();
        initScrollReveal();
        initSmoothScroll();
        initPremiumCards();
        initGradientText();
    }, 100);
});

// ===================================
// Reinitialize on Window Resize
// ===================================
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});
