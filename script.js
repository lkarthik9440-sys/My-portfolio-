// ── Custom Cursor ──
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    follower.style.left = e.clientX + 'px';
    follower.style.top = e.clientY + 'px';
});

document.querySelectorAll('a, button, .btn, .btn-outline, .btn-ghost, .skill-card, .project-card, .ach-card, .stat-card, .social-btn').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
});

document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    follower.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    follower.style.opacity = '1';
});

// ── Particle Canvas ──
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouseX = 0, mouseY = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.hue = Math.random() > 0.5 ? 180 : 260;
    }
    update() {
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
            const force = (200 - dist) / 200 * 0.02;
            this.speedX += dx * force * 0.01;
            this.speedY += dy * force * 0.01;
        }
        this.speedX *= 0.98;
        this.speedY *= 0.98;
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const alpha = this.opacity * (0.6 + Math.sin(Date.now() * 0.001 + this.x) * 0.4);
        ctx.fillStyle = this.hue === 180
            ? `rgba(0, 240, 255, ${alpha})`
            : `rgba(139, 92, 246, ${alpha})`;
        ctx.fill();
    }
}

const particleCount = Math.min(80, Math.floor(window.innerWidth * 0.08));
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    // draw connections
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                const alpha = (1 - dist / 120) * 0.15;
                ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ── Typing Animation ──
const typedText = document.getElementById('typedText');
const phrases = [
    'AI & ML Student',
    'Creative Developer',
    'Future Tech Builder',
    'Creative Technologist'
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 80;

function typeEffect() {
    const current = phrases[phraseIndex];
    if (!isDeleting) {
        typedText.textContent = current.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
            isDeleting = true;
            typingSpeed = 1500;
        } else {
            typingSpeed = 60 + Math.random() * 40;
        }
    } else {
        typedText.textContent = current.substring(0, charIndex);
        charIndex--;
        if (charIndex < 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400;
        } else {
            typingSpeed = 30 + Math.random() * 20;
        }
    }
    setTimeout(typeEffect, typingSpeed);
}
typeEffect();

// ── Navbar Scroll Effect ──
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
});

// ── Active Nav Link ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}
window.addEventListener('scroll', updateActiveLink);

// ── Mobile Menu ──
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');

menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        mobileMenu.classList.remove('open');
    });
});

// ── Smooth Navigation ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ── Scroll Reveal (Intersection Observer) ──
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ── Animated Counters ──
const counters = document.querySelectorAll('.counter, .stat-number');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target'));
            if (!target) return;
            let current = 0;
            const increment = Math.ceil(target / 40);
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    el.textContent = target;
                    clearInterval(timer);
                } else {
                    el.textContent = current;
                }
            }, 40);
            counterObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

counters.forEach(c => counterObserver.observe(c));

// ── Progress Bars ──
const progressFills = document.querySelectorAll('.progress-fill');

const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const width = el.getAttribute('data-width');
            if (width) {
                el.style.width = width + '%';
            }
            progressObserver.unobserve(el);
        }
    });
}, { threshold: 0.3 });

progressFills.forEach(p => progressObserver.observe(p));

// ── Project Filtering ──
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                card.style.display = 'block';
                card.style.opacity = '0';
                setTimeout(() => { card.style.opacity = '1'; }, 50);
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ── Hero Buttons Navigation ──
document.getElementById('viewProjectsBtn') && document.getElementById('viewProjectsBtn').addEventListener('click', () => {
    document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
});
document.getElementById('contactBtn') && document.getElementById('contactBtn').addEventListener('click', () => {
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
});

// ── Hero Buttons (data-target) ──
document.querySelectorAll('[data-target]').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = document.querySelector(btn.getAttribute('data-target'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// ── Magnetic Buttons ──
document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
    });
});

// ── Contact Form ──
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        contactForm.style.display = 'none';
        formSuccess.classList.add('show');
        setTimeout(() => {
            formSuccess.classList.remove('show');
            contactForm.style.display = 'block';
            contactForm.reset();
        }, 3000);
    });
}

// ── Initial Reveal for Hero elements ──
window.addEventListener('load', () => {
    document.querySelector('.hero-title').style.opacity = '0';
    document.querySelector('.hero-title').style.transform = 'translateY(30px)';
    document.querySelector('.hero-subtitle').style.opacity = '0';
    document.querySelector('.hero-subtitle').style.transform = 'translateY(20px)';
    document.querySelector('.hero-intro').style.opacity = '0';
    document.querySelector('.hero-intro').style.transform = 'translateY(20px)';
    document.querySelector('.hero-buttons').style.opacity = '0';
    document.querySelector('.hero-buttons').style.transform = 'translateY(20px)';

    setTimeout(() => {
        document.querySelector('.hero-title').style.transition = 'all 0.8s cubic-bezier(0.4,0,0.2,1)';
        document.querySelector('.hero-title').style.opacity = '1';
        document.querySelector('.hero-title').style.transform = 'translateY(0)';
    }, 200);
    setTimeout(() => {
        document.querySelector('.hero-subtitle').style.transition = 'all 0.8s cubic-bezier(0.4,0,0.2,1)';
        document.querySelector('.hero-subtitle').style.opacity = '1';
        document.querySelector('.hero-subtitle').style.transform = 'translateY(0)';
    }, 600);
    setTimeout(() => {
        document.querySelector('.hero-intro').style.transition = 'all 0.8s cubic-bezier(0.4,0,0.2,1)';
        document.querySelector('.hero-intro').style.opacity = '1';
        document.querySelector('.hero-intro').style.transform = 'translateY(0)';
    }, 1000);
    setTimeout(() => {
        document.querySelector('.hero-buttons').style.transition = 'all 0.8s cubic-bezier(0.4,0,0.2,1)';
        document.querySelector('.hero-buttons').style.opacity = '1';
        document.querySelector('.hero-buttons').style.transform = 'translateY(0)';
    }, 1400);
});
