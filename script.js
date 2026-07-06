// ==================== CUSTOM CURSOR ====================
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');

if (cursor && cursorDot) {
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
    });

    // Smooth cursor following
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects on interactive elements
    const hoverElements = document.querySelectorAll('a, button, .project-card, .service-card, .btn, .ghost-wrapper');
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '60px';
            cursor.style.height = '60px';
            cursor.style.borderColor = 'var(--accent)';
            cursor.style.mixBlendMode = 'normal';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.borderColor = 'var(--accent)';
            cursor.style.mixBlendMode = 'difference';
        });
    });
}

// ==================== LOADER ====================
let percent = 0;
const percentEl = document.getElementById('loaderPercent');
const loader = document.getElementById('loader');

const loadInterval = setInterval(() => {
    percent++;
    percentEl.textContent = percent;
    
    if (percent >= 100) {
        clearInterval(loadInterval);
        setTimeout(() => {
            loader.classList.add('hidden');
            initAnimations();
            initMagneticButtons();
            initTiltEffect();
        }, 400);
    }
}, 14);

// ==================== NAVIGATION ====================
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const navbar = document.getElementById('navbar');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

function closeMobileMenu() {
    menuToggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    updateScrollProgress();
    toggleScrollTop();
});

// ==================== PAGE NAVIGATION ====================
const pageTransition = document.getElementById('pageTransition');

function navigateTo(pageName) {
    const currentPage = document.querySelector('.page.active');
    const targetPage = document.getElementById(`page-${pageName}`);
    
    if (!targetPage || currentPage === targetPage) return;
    
    pageTransition.classList.add('active');
    
    setTimeout(() => {
        currentPage.classList.remove('active');
        targetPage.classList.add('active');
        window.scrollTo(0, 0);
        
        pageTransition.classList.remove('active');
        pageTransition.classList.add('exit');
        
        setTimeout(() => {
            pageTransition.classList.remove('exit');
            initAnimations();
        }, 650);
    }, 650);
    
    closeMobileMenu();
}

function scrollToSection(sectionId) {
    const homePage = document.getElementById('page-home');
    
    if (!homePage.classList.contains('active')) {
        navigateTo('home');
        setTimeout(() => {
            const section = document.getElementById(sectionId);
            if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 750);
    } else {
        const section = document.getElementById(sectionId);
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    closeMobileMenu();
}

// ==================== SCROLL PROGRESS ====================
function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / docHeight) * 100;
    document.getElementById('scrollProgress').style.width = progress + '%';
}

// ==================== SCROLL TO TOP ====================
const scrollTopBtn = document.getElementById('scrollTop');

function toggleScrollTop() {
    if (window.scrollY > 600) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
}

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ==================== REVEAL ANIMATIONS ====================
function initAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    });
    
    reveals.forEach(el => {
        el.classList.remove('active');
        observer.observe(el);
    });
    
    // Animate counters
    animateCounters();
}

// ==================== COUNTER ANIMATION ====================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        if (!target) return;
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                let current = 0;
                const increment = target / 60;
                const duration = 1400;
                const startTime = Date.now();
                
                const updateCounter = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Ease out animation
                    const eased = 1 - Math.pow(1 - progress, 3);
                    current = Math.floor(target * eased);
                    
                    counter.textContent = current;
                    
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                observer.disconnect();
            }
        }, { threshold: 0.6 });
        
        observer.observe(counter);
    });
}

// ==================== MAGNETIC BUTTONS ====================
function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.magnetic-btn, .btn');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            const distance = Math.sqrt(x * x + y * y);
            const maxDistance = 80;
            
            if (distance < maxDistance) {
                const strength = (maxDistance - distance) / maxDistance;
                this.style.transform = `translate(${x * strength * 0.4}px, ${y * strength * 0.4}px)`;
            }
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
        
        // Click effect
        btn.addEventListener('mousedown', function() {
            this.style.transform = 'scale(0.95)';
        });
        
        btn.addEventListener('mouseup', function() {
            this.style.transform = '';
        });
    });
}

// ==================== TILT EFFECT ON CARDS ====================
function initTiltEffect() {
    const tiltCards = document.querySelectorAll('.service-card, .project-card, .testimonial-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            const rotateX = (50 - y) * 0.18;
            const rotateY = (x - 50) * 0.18;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.6s var(--transition)';
            this.style.transform = '';
            
            setTimeout(() => {
                this.style.transition = 'transform 0.4s var(--transition), box-shadow 0.4s var(--transition)';
            }, 600);
        });
    });
}

// ==================== ENHANCED GHOST INTERACTION ====================
document.addEventListener('DOMContentLoaded', () => {
    const ghost = document.querySelector('.ghost-wrapper');
    const ghostBody = document.querySelector('.ghost-body');
    const ghostFace = document.querySelector('.ghost-face');
    const bubble = document.querySelector('.ghost-speech-bubble');
    const heroSection = document.querySelector('.hero');

    if (!ghost || !ghostBody) return;

    let isBubbleOpen = false;
    let lastMoveTime = Date.now();

    // 1. FLOATING GHOST
    function moveGhostRandomly() {
        if (!heroSection || !ghost) return;

        const parentW = heroSection.offsetWidth;
        const parentH = heroSection.offsetHeight;

        const padX = 130;
        const padY = 110;

        const randomX = Math.floor(Math.random() * (parentW - padX * 2)) + padX;
        const randomY = Math.floor(Math.random() * (parentH - padY * 2)) + padY;

        ghost.style.transition = 'left 3.8s cubic-bezier(0.23,1,0.32,1), top 3.8s cubic-bezier(0.23,1,0.32,1)';
        ghost.style.left = `${randomX}px`;
        ghost.style.top = `${randomY}px`;

        const nextTime = Math.random() * 2800 + 5200;
        setTimeout(moveGhostRandomly, nextTime);
    }

    setTimeout(moveGhostRandomly, 2200);

    // 2. MOUSE TRACKING + HAPPY FACE
    document.addEventListener('mousemove', (e) => {
        if (!ghostFace || !ghostBody) return;

        const rect = ghost.getBoundingClientRect();
        const ghostX = rect.left + rect.width / 2;
        const ghostY = rect.top + rect.height / 2;

        const dx = e.clientX - ghostX;
        const dy = e.clientY - ghostY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const xMove = Math.min(Math.max(dx / 19, -14), 14);
        const yMove = Math.min(Math.max(dy / 19, -11), 11);

        ghostFace.style.transition = 'transform 0.1s ease-out';
        ghostFace.style.transform = `translate(${xMove}px, ${yMove}px)`;

        // Happy expression
        if (distance < 280) {
            ghostBody.classList.add('happy');
        } else {
            ghostBody.classList.remove('happy');
        }
    });

    // 3. CLICK TO OPEN SOCIAL BUBBLE
    ghost.addEventListener('click', (e) => {
        if (e.target.closest('.ghost-speech-bubble')) return;

        isBubbleOpen = !isBubbleOpen;

        if (isBubbleOpen) {
            bubble.classList.add('visible');
            ghostBody.style.transition = 'transform 0.3s cubic-bezier(0.23,1,0.32,1)';
            ghostBody.style.transform = 'scale(1.08) translateY(-14px)';
            
            setTimeout(() => {
                ghostBody.style.transform = '';
            }, 320);
        } else {
            bubble.classList.remove('visible');
        }
    });

    // Close bubble when clicking outside
    document.addEventListener('click', (e) => {
        if (isBubbleOpen && !ghost.contains(e.target)) {
            isBubbleOpen = false;
            bubble.classList.remove('visible');
        }
    });

    // Extra micro animation: Ghost hand wave on hover
    ghost.addEventListener('mouseenter', () => {
        const hands = document.querySelectorAll('.ghost-hand');
        hands.forEach(hand => {
            hand.style.transition = 'transform 0.4s ease';
            hand.style.transform = 'rotate(25deg)';
        });
    });

    ghost.addEventListener('mouseleave', () => {
        const hands = document.querySelectorAll('.ghost-hand');
        hands.forEach(hand => hand.style.transform = '');
    });
});

// ==================== FORM HANDLING ====================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const btn = this.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;
        
        // Simulate sending
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
            btn.style.background = '#22c55e';
            
            // Confetti effect
            createConfetti();
            
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
                this.reset();
            }, 2600);
        }, 1650);
    });
}

// Confetti animation
function createConfetti() {
    const colors = ['#ff3c00', '#ff6b3d', '#6366f1', '#ffffff'];
    
    for (let i = 0; i < 45; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.zIndex = '99999';
        confetti.style.width = Math.random() * 9 + 6 + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * window.innerWidth + 'px';
        confetti.style.top = '-20px';
        confetti.style.opacity = Math.random() + 0.6;
        document.body.appendChild(confetti);
        
        const duration = Math.random() * 2800 + 2100;
        const angle = Math.random() * 70 - 35;
        
        confetti.animate([
            { 
                transform: `translateY(0) rotate(0deg)`,
                opacity: confetti.style.opacity 
            },
            { 
                transform: `translateY(${window.innerHeight + 100}px) rotate(${angle * 6}deg)`,
                opacity: 0 
            }
        ], {
            duration: duration,
            easing: 'cubic-bezier(0.23, 1, 0.32, 1)'
        }).onfinish = () => confetti.remove();
    }
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    });
});

// ==================== KEYBOARD NAVIGATION ====================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

// ==================== EXTRA: Parallax Hero Orbs ====================
window.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.hero-orb');
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;

    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.6;
        orb.style.transition = 'transform 0.6s ease-out';
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
    });
});

// ==================== INIT EVERYTHING ====================
window.addEventListener('load', () => {
    // Make sure cursor works after load
    if (window.innerWidth > 900) {
        document.body.style.cursor = 'none';
    }
    
    // Trigger initial animations after loader
    setTimeout(() => {
        const firstReveals = document.querySelectorAll('.hero .reveal');
        firstReveals.forEach((el, i) => {
            setTimeout(() => {
                el.classList.add('active');
            }, i * 180);
        });
    }, 600);
});