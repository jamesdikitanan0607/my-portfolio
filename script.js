// Portfolio Website JavaScript - Parallax & Modern UI

// Global Variables
let isScrolling = false;
let scrollTimeout;
let lastScrollY = window.scrollY;
let ticking = false;

// Performance optimization: Use requestAnimationFrame for smooth animations
function requestTick() {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing Portfolio Website...');

    // Initialize all components
    applyHeroOnlyFirstLoad();
    initTheme();
    initNavigation();
    initParallax();
    initScrollAnimations();
    initProjects();
    initTeams();
    initSkills();
    initVideoCarousel();
    initCounters();
    initScrollProgress();
    initMobileMenu();
    initHeroAnimations();
    // initSocialAnimations removed (Let's Connect section deleted)

    // Micro-interaction initializers
    initPreloader();
    initHeroReveal();
    initCustomCursor();
    initAmbientDust();
    initAboutImageHover();
    console.log('✅ Portfolio Website Initialized Successfully');
});

/* Preloader */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    // Remove preloader after a small delay to allow assets to settle
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.transition = 'opacity 0.45s ease';
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 500);
        }, 350);
    });
}

/* Hero masked reveal */
function initHeroReveal() {
    const tagline = document.querySelector('.hero-tagline');
    if (!tagline) return;

    // Respect reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
        tagline.classList.add('revealed');
        return;
    }

    // Reveal after a slight delay to feel cinematic
    setTimeout(() => {
        tagline.classList.add('revealed');
    }, 800);
}

/* Ambient dust particles (very subtle) */
function initAmbientDust() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    const dustLayer = document.createElement('canvas');
    dustLayer.className = 'ambient-dust';
    dustLayer.width = hero.clientWidth;
    dustLayer.height = hero.clientHeight;
    hero.appendChild(dustLayer);

    // Draw a few soft dots and animate their positions slowly using requestAnimationFrame
    const ctx = dustLayer.getContext('2d');
    const particles = [];
    const count = 18;
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * dustLayer.width,
            y: Math.random() * dustLayer.height,
            r: 0.6 + Math.random() * 2.4,
            vx: (Math.random() - 0.5) * 0.05,
            vy: (Math.random() - 0.5) * 0.02,
            alpha: 0.02 + Math.random() * 0.06
        });
    }

    function draw() {
        ctx.clearRect(0, 0, dustLayer.width, dustLayer.height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < -20) p.x = dustLayer.width + 20;
            if (p.x > dustLayer.width + 20) p.x = -20;
            if (p.y < -20) p.y = dustLayer.height + 20;
            if (p.y > dustLayer.height + 20) p.y = -20;

            ctx.beginPath();
            ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }

    // Respect reduced motion
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        draw();
    }
}
function initAboutImageHover() {
    const img = document.querySelector('.about-image');
    if (!img) return;
    const originalSrc = img.getAttribute('src');
    const hoverSrc = 'assets/images/pic2.jpg';
    const preloaded = new Image();
    preloaded.src = hoverSrc;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const fadeSwap = (newSrc) => {
        if (prefersReduced) { img.src = newSrc; return; }
        const prevTransition = img.style.transition;
        img.style.transition = 'opacity 120ms ease';

        const handleFadeOutEnd = (e) => {
            if (e.propertyName !== 'opacity') return;
            img.removeEventListener('transitionend', handleFadeOutEnd);
            img.src = newSrc;
            requestAnimationFrame(() => {
                const handleFadeInEnd = (e2) => {
                    if (e2.propertyName !== 'opacity') return;
                    img.removeEventListener('transitionend', handleFadeInEnd);
                    // Restore any prior transition (let CSS cascade apply if empty)
                    img.style.transition = prevTransition;
                };
                img.addEventListener('transitionend', handleFadeInEnd, { once: true });
                img.style.opacity = '1';
            });
        };
        img.addEventListener('transitionend', handleFadeOutEnd);
        img.style.opacity = '0';
    };

    img.addEventListener('mouseenter', () => {
        if (preloaded.complete) {
            fadeSwap(hoverSrc);
        } else {
            preloaded.addEventListener('load', () => fadeSwap(hoverSrc), { once: true });
        }
    });
    img.addEventListener('mouseleave', () => {
        fadeSwap(originalSrc);
    });
}

/* Custom cursor */
function initCustomCursor() {
    const cursor = document.getElementById('customCursor');
    if (!cursor) return;

    // Hide native cursor
    document.documentElement.style.cursor = 'none';

    // Track mouse and move the custom cursor with slight smoothing
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let posX = mouseX;
    let posY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.display = 'block';
    });

    function update() {
        posX += (mouseX - posX) * 0.18;
        posY += (mouseY - posY) * 0.18;
        cursor.style.left = posX + 'px';
        cursor.style.top = posY + 'px';
        requestAnimationFrame(update);
    }
    update();

    // Toggle hover state when entering interactive elements
    const hoverSelectors = 'a, button, .project-card, .social-icon, .skill-card, .cta-button';
    document.querySelectorAll(hoverSelectors).forEach(el => {
        el.addEventListener('mouseenter', () => document.documentElement.classList.add('is-hovering-link'));
        el.addEventListener('mouseleave', () => document.documentElement.classList.remove('is-hovering-link'));
    });

    // Clean up for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.cursor = '';
        cursor.remove();
    }
}

// Theme Management
function initTheme() {
    const body = document.body;
    // Always use dark theme and clear any saved preference
    body.setAttribute('data-theme', 'dark');
    try { localStorage.removeItem('theme'); } catch (e) { }
}

// Navigation with Hide/Show on Scroll
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Hide/show navbar on scroll
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down
            navbar.classList.add('hidden');
        } else {
            // Scrolling up
            navbar.classList.remove('hidden');
        }

        lastScrollY = currentScrollY;
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Mobile Menu
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Parallax Scrolling Effects
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (parallaxElements.length === 0) return;

    window.addEventListener('scroll', requestTick);
    window.addEventListener('resize', requestTick);

    // Initial update
    updateParallax();
}

function updateParallax() {
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;

    // Update parallax elements
    document.querySelectorAll('[data-parallax]').forEach(element => {
        // prefer explicit data-speed, fallback to data-parallax value
        const speedAttr = element.getAttribute('data-speed') || element.getAttribute('data-parallax');
        const speed = parseFloat(speedAttr) || 0.5;
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrolled;
        const elementHeight = rect.height;

        // Only animate if element is in viewport
        if (scrolled + windowHeight > elementTop && scrolled < elementTop + elementHeight) {
            const yPos = -(scrolled - elementTop) * speed;

            if (element.classList.contains('hero-image')) {
                // Special handling for hero image
                element.style.transform = `translateY(${yPos * 0.3}px) scale(1.05)`;
            } else if (element.classList.contains('about-image')) {
                // Special handling for about image
                element.style.transform = `translateY(${yPos * 0.2}px) rotate(${yPos * 0.01}deg)`;
            } else {
                // Default parallax
                element.style.transform = `translateY(${yPos}px)`;
            }
        }
    });

    // Update floating particles
    document.querySelectorAll('.particle').forEach((particle, index) => {
        const speed = 0.1 + (index * 0.02);
        const yPos = -(scrolled * speed);
        particle.style.transform = `translateY(${yPos}px) rotate(${yPos * 0.5}deg)`;
    });

    // Update background shapes
    document.querySelectorAll('.shape').forEach((shape, index) => {
        const speed = 0.05 + (index * 0.01);
        const yPos = -(scrolled * speed);
        const xPos = Math.sin(scrolled * 0.001 + index) * 20;
        shape.style.transform = `translate(${xPos}px, ${yPos}px) rotate(${yPos * 0.1}deg)`;
    });

    ticking = false;
}

// Scroll Progress Indicator
function initScrollProgress() {
    const scrollProgress = document.querySelector('.scroll-progress');

    if (!scrollProgress) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        scrollProgress.style.width = scrollPercent + '%';
    });
}

// Scroll-triggered Animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-anim]');

    if (animatedElements.length === 0) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const animation = element.getAttribute('data-anim');
                const delay = element.getAttribute('data-delay') || 0;

                // Add animation class with delay
                setTimeout(() => {
                    element.classList.add('animate');
                }, parseInt(delay));

                // Stop observing after animation
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Hero Section Animations
function initHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    const heroImage = document.querySelector('.hero-image');

    // Animate hero elements on load
    setTimeout(() => {
        if (heroTitle) heroTitle.style.opacity = '1';
        if (heroSubtitle) heroSubtitle.style.opacity = '1';
        if (heroButtons) heroButtons.style.opacity = '1';
        if (heroImage) heroImage.style.opacity = '1';
    }, 100);

    // Scroll indicator click
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const aboutSection = document.querySelector('.about-section');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Typing effect for hero title
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.opacity = '1';

        let charIndex = 0;
        const typeWriter = () => {
            if (charIndex < text.length) {
                heroTitle.textContent += text.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 50);
            }
        };

        setTimeout(typeWriter, 500);
    }
}

// Projects Section with Video Modal
// Projects based on resume and GitHub repositories
const projects = [
    {
        title: 'Beanly',
        status: 'Completed',
        platform: 'Software',
        details: [
            'Developed a fully functional Point of Sale system for a coffee shop.',
            'Implemented inventory management, sales tracking, and transaction processing.',
            'Applied OOP principles and collaborated using Git.'
        ],
        tech: ['Java', 'Git'],
        url: 'https://github.com/jamesdikitanan0607/Beanly'
    },
    {
        title: 'Sugbo-Aid',
        status: 'Completed',
        platform: 'Software',
        details: [
            'Built a donation management system to track contributors and generate reports.',
            'Designed intuitive user interfaces and implemented data validation.'
        ],
        tech: ['Java'],
        url: 'https://github.com/jamesdikitanan0607/sugbo-aid'
    },
    {
        title: 'Ascentra Dashboard',
        status: 'Completed',
        platform: 'Full Stack',
        details: [
            'Created a dashboard to manage user data, analytics, and administrative tasks.',
            'Improved front-end logic using TypeScript and designed UI/UX layouts.'
        ],
        tech: ['Java', 'TypeScript'],
        url: 'https://github.com/jamesdikitanan0607/Ascentra-'
    },
    {
        title: 'Admin Ascentra',
        status: 'Completed',
        platform: 'Full Stack',
        details: [
            'Developed the administrative side for user management and system monitoring.',
            'Implemented secure access and dynamic analytical views.'
        ],
        tech: ['TypeScript', 'JavaScript'],
        url: 'https://github.com/jamesdikitanan0607/admin-ascentra'
    },
    {
        title: 'Invex',
        status: 'Completed',
        platform: 'Website',
        details: [
            'Developed an interactive dashboard with dynamic data visualization.',
            'Integrated APIs and implemented responsive design.'
        ],
        tech: ['TypeScript', 'JavaScript', 'REST API'],
        url: 'https://github.com/jamesdikitanan0607/Invex'
    },
    {
        title: 'Shipping Company (South Shore)',
        status: 'Completed',
        platform: 'Website',
        details: [
            'Contributed to designing the website’s user interface and user experience.',
            'Applied responsive design principles and ensured accessibility across devices.'
        ],
        tech: ['TypeScript', 'HTML', 'CSS'],
        url: 'https://github.com/jamesdikitanan0607/southshore-b2b-mockup'
    }
];

// Video Projects Data
const videoProjects = [
    {
        title: 'ATXI Vid Demo',
        id: '1UVk1tENe57P7gmSIl2zm4u998eda1lKy',
        url: 'https://drive.google.com/file/d/1UVk1tENe57P7gmSIl2zm4u998eda1lKy/view'
    },
    {
        title: 'Company Introduction',
        id: '1eBgsFJIT4nYaDmjYMt9a7XGsZIwO7yx1',
        url: 'https://drive.google.com/file/d/1eBgsFJIT4nYaDmjYMt9a7XGsZIwO7yx1/view'
    },
    {
        title: 'Tiktok Content 1',
        id: '1-lazb-JF-TnOaYw9c1yfshAP9pJt8wVD',
        url: 'https://drive.google.com/file/d/1-lazb-JF-TnOaYw9c1yfshAP9pJt8wVD/view'
    },
    {
        title: 'Tiktok Content 2',
        id: '1J5yJvJGL1SacEkaI8md9wADCT0McZPtI',
        url: 'https://drive.google.com/file/d/1J5yJvJGL1SacEkaI8md9wADCT0McZPtI/view?usp=sharing'
    },
    {
        title: 'Tiktok Content 3',
        id: '15Q7bzKFhEzIJPsffN0zFt5_vdbSQG1aW',
        url: 'https://drive.google.com/file/d/15Q7bzKFhEzIJPsffN0zFt5_vdbSQG1aW/view'
    }
];

// Helpers to resolve asset filenames dynamically from assets/images
const IMG_EXTS = ['png', 'jpg', 'jpeg', 'webp'];
const VID_EXTS = ['mp4', 'webm', 'mov'];

function toSlugVariants(title) {
    const base = title.trim();
    const lower = base.toLowerCase();
    const noPunct = lower.replace(/[^a-z0-9\s-]/g, '').trim();
    const dash = noPunct.replace(/\s+/g, '-');
    const underscore = noPunct.replace(/\s+/g, '_');
    const plain = noPunct.replace(/\s+/g, '');
    return [base, lower, noPunct, dash, underscore, plain];
}

function imageNameCandidates(title) {
    const slugs = toSlugVariants(title);
    const suffixes = ['', ' cover', ' thumbnail', ' thumb'];
    const names = [];
    for (const s of slugs) {
        for (const suf of suffixes) {
            names.push(`${s}${suf}`);
        }
    }
    return names;
}

function videoNameCandidates(title) {
    const slugs = toSlugVariants(title);
    const suffixes = ['', ' video', ' showcase', ' intro', ' final'];
    const names = [];
    for (const s of slugs) {
        for (const suf of suffixes) {
            names.push(`${s}${suf}`);
        }
    }
    // Known special case
    if (/museo/i.test(title)) names.unshift('Museo Final', 'museo final');
    return names;
}

function tryLoadImage(url) {
    return new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve({ ok: true, url });
        img.onerror = () => resolve({ ok: false, url });
        img.src = url;
    });
}

async function resolveThumbnail(title) {
    const candidates = imageNameCandidates(title);
    for (const name of candidates) {
        for (const ext of IMG_EXTS) {
            const url = `assets/images/${name}.${ext}`;
            // eslint-disable-next-line no-await-in-loop
            const res = await tryLoadImage(url);
            if (res.ok) return url;
        }
    }
    // Fallback placeholder (using a generic coding-themed gradient)
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzZkMDBmZiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzBhMGUwZiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==';
}

async function resolveMedia(title) {
    const candidates = videoNameCandidates(title);
    for (const name of candidates) {
        for (const ext of VID_EXTS) {
            const url = `assets/images/${name}.${ext}`;
            // We cannot reliably probe video existence without fetching; assume presence and let error handler hide if missing
            return { url, isVideo: true };
        }
    }
    // If no video guessed, fall back to image
    const img = await resolveThumbnail(title);
    return { url: img, isVideo: false };
}

async function initProjects() {
    const projectsGrid = document.querySelector('#projectsGrid') || document.querySelector('.projects-grid');
    if (!projectsGrid) {
        console.warn('Projects grid not found');
        return;
    }

    projectsGrid.innerHTML = '';

    projects.forEach((project, index) => {
        const card = createUnifiedCard(project, index, { type: 'project' });
        projectsGrid.appendChild(card);
    });

    // Re-initialize scroll animations for new elements
    initScrollAnimations();
}

// Unified card builder used for both projects and teams to ensure consistent layout/styling
function createUnifiedCard(item, index, options = {}) {
    const { type = 'project', onClick } = options;
    const card = document.createElement('div');
    card.className = type === 'team' ? 'skill-card team-card' : 'project-card';
    card.setAttribute('data-anim', 'zoom-in');
    card.setAttribute('data-delay', (index * 100).toString());

    if (type === 'team') {
        card.innerHTML = `
            <div class="skill-icon" data-parallax data-speed="0.22">
                <img class="skill-icon-img team-logo-image" src="${item.thumbnail || ''}" alt="${item.title} logo" />
            </div>
            <div class="skill-name">${item.title}</div>
            <div class="skill-role">${item.role || ''}</div>
            <div class="skill-description">${item.description || ''}</div>
        `;
    } else {
        // New project card structure
        const detailsHtml = item.details ? `
            <div class="project-details">
                <ul>
                    ${item.details.map(detail => `<li>${detail}</li>`).join('')}
                </ul>
            </div>
        ` : '';

        const techHtml = item.tech ? `
            <div class="project-tech">
                ${item.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>
        ` : '';

        card.innerHTML = `
            <div class="project-content">
                <div class="project-header">
                    <h3 class="project-title">${item.title}</h3>
                    <div class="project-badges">
                        <span class="badge badge-status">${item.status}</span>
                        <span class="badge badge-platform">${item.platform}</span>
                    </div>
                </div>
                ${detailsHtml}
                ${techHtml}
            </div>
        `;
    }

    if ((type === 'team' || type === 'project') && item.url) {
        card.addEventListener('click', () => {
            window.open(item.url, '_blank', 'noopener');
        });
        card.style.cursor = 'pointer';
    }

    return card;
}

// Initialize Teams section using the same card system
const teams = [
    {
        title: 'Develop Kreativity',
        role: 'Dev Team & Video Editor',
        description: 'Designed UI/UX layouts, workflows, and produced marketing/presentation videos and motion graphics.',
        thumbnail: 'assets/images/logo develop kreativity.jpg',
        url: 'https://www.developkreativity.com'
    }
];

function initTeams() {
    const teamsGrid = document.querySelector('#teamsGrid') || document.querySelector('.teams-grid');
    if (!teamsGrid) {
        console.warn('Teams grid not found');
        return;
    }

    teams.forEach(async (team, index) => {
        const card = createUnifiedCard(team, index, { type: 'team' });
        teamsGrid.appendChild(card);

        // If the team card includes an <img> (skill-style), set its src to the provided thumbnail
        const imgEl = card.querySelector('img.team-logo-image');
        if (imgEl) {
            // Use explicit thumbnail if provided, otherwise try to resolve by title
            imgEl.src = team.thumbnail || await resolveThumbnail(team.title);
            imgEl.alt = team.title + ' logo';
            // Add parallax attributes to the thumbnail container (already applied in createUnifiedCard)
            const parentIcon = imgEl.closest('.skill-icon');
            if (parentIcon) {
                parentIcon.setAttribute('data-parallax', '');
                parentIcon.setAttribute('data-speed', '0.22');
            }
            card.dataset.isVideo = '0';
        }
    });
}

function initVideoModal() {
    const modal = document.getElementById('videoModal') || document.querySelector('.video-modal');
    if (!modal) return;
    const overlay = document.getElementById('modalOverlay') || modal.querySelector('.modal-overlay');
    const closeBtn = document.getElementById('modalClose') || modal.querySelector('.modal-close');
    if (overlay) overlay.addEventListener('click', closeVideoModal);
    if (closeBtn) closeBtn.addEventListener('click', closeVideoModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeVideoModal(); });
}

function openVideoModal({ title, date, description, mediaUrl, isVideo }) {
    const modal = document.getElementById('videoModal') || document.querySelector('.video-modal');
    if (!modal) return;
    const titleEl = document.getElementById('modalTitle') || modal.querySelector('.modal-title');
    const videoEl = document.getElementById('modalVideo') || modal.querySelector('video');
    const descEl = document.getElementById('modalDescription') || modal.querySelector('.modal-description');

    if (titleEl) titleEl.textContent = title || '';
    if (descEl) descEl.textContent = description || '';

    // Reset any existing container content and create video element with autoplay handling
    const container = modal.querySelector('.modal-video-container');
    if (container) {
        container.innerHTML = '';
        if (isVideo && mediaUrl) {
            const vid = document.createElement('video');
            vid.controls = true;
            vid.autoplay = true;
            vid.muted = false;
            vid.playsInline = true;
            vid.setAttribute('playsinline', '');
            vid.setAttribute('webkit-playsinline', '');
            const source = document.createElement('source');
            source.src = mediaUrl;
            source.type = 'video/mp4';
            vid.appendChild(source);
            container.appendChild(vid);

            // Try to play; if blocked, mute then play
            const p = vid.play();
            if (p && p.catch) {
                p.catch(() => {
                    vid.muted = true;
                    vid.play().catch(err => console.warn('Muted autoplay failed', err));
                });
            }
        } else if (mediaUrl) {
            const img = document.createElement('img');
            img.src = mediaUrl;
            img.alt = title || 'Project image';
            img.style.maxWidth = '100%';
            container.appendChild(img);
        }
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.querySelector('.video-modal');

    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';

        // Stop any playing videos
        const videos = modal.querySelectorAll('video');
        videos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });
    }
}

// Skills Section with Animated Progress Bars
function initSkills() {
    const skillCards = document.querySelectorAll('.skill-card');

    if (skillCards.length === 0) return;

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillCard = entry.target;
                animateSkillCard(skillCard);
                skillObserver.unobserve(skillCard);
            }
        });
    }, { threshold: 0.5 });

    skillCards.forEach(card => {
        skillObserver.observe(card);
    });
}

function animateSkillCard(skillCard) {
    const progressBar = skillCard.querySelector('.progress-bar');
    const progressText = skillCard.querySelector('.progress-text');

    if (progressBar) {
        const progress = progressBar.getAttribute('data-progress');
        progressBar.style.setProperty('--progress', `${progress}%`);
        progressBar.classList.add('animate');
    }
}

// Video Carousel Initialization
function initVideoCarousel() {
    const track = document.getElementById('videoCarouselTrack');
    const prevBtn = document.getElementById('videoPrev');
    const nextBtn = document.getElementById('videoNext');

    if (!track) return;

    // Load video cards
    videoProjects.forEach((video, index) => {
        const card = createVideoCard(video, index);
        track.appendChild(card);
    });

    // Scroll amount (card width + gap)
    const getScrollAmount = () => {
        const firstCard = track.querySelector('.video-card');
        if (!firstCard) return 300;
        const style = window.getComputedStyle(track);
        const gap = parseInt(style.gap) || 0;
        return firstCard.offsetWidth + gap;
    };

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            track.scrollBy({
                left: -getScrollAmount(),
                behavior: 'smooth'
            });
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            track.scrollBy({
                left: getScrollAmount(),
                behavior: 'smooth'
            });
        });
    }

    // Optional: Hide/Show arrows based on scroll position
    const updateArrows = () => {
        if (prevBtn) prevBtn.style.opacity = track.scrollLeft <= 0 ? '0.3' : '1';
        if (nextBtn) {
            const isAtEnd = track.scrollLeft + track.offsetWidth >= track.scrollWidth - 10;
            nextBtn.style.opacity = isAtEnd ? '0.3' : '1';
        }
    };

    track.addEventListener('scroll', updateArrows);
    window.addEventListener('resize', updateArrows);
    setTimeout(updateArrows, 500); // Initial check
}

function createVideoCard(video, index) {
    const card = document.createElement('div');
    card.className = 'video-card';
    card.setAttribute('data-anim', 'fade-up');
    card.setAttribute('data-delay', (index * 100).toString());

    // Google Drive Thumbnail URL
    const thumbUrl = `https://drive.google.com/thumbnail?id=${video.id}&sz=w800`;

    card.innerHTML = `
        <div class="video-thumbnail-wrapper">
            <img src="${thumbUrl}" alt="${video.title}" class="video-thumbnail" loading="lazy">
            <div class="video-play-hint">
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>
            </div>
        </div>
        <div class="video-info">
            <h3 class="video-title">${video.title}</h3>
        </div>
    `;

    card.addEventListener('click', () => {
        window.open(video.url, '_blank', 'noopener');
    });

    return card;
}

// Animated Counters for About Section
function initCounters() {
    const statItems = document.querySelectorAll('.stat-item');

    if (statItems.length === 0) return;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const item = entry.target;
            const numberEl = item.querySelector('.stat-number');
            if (!numberEl) return;

            // Read raw counter value from parent data-counter (supports '20+' etc.)
            let raw = item.getAttribute('data-counter') || numberEl.getAttribute('data-target') || '0';
            const hasPlus = /\+$/.test(raw);
            raw = raw.replace(/\+$/, '');
            const targetValue = parseInt(raw, 10) || 0;

            // If prefers reduced motion, set final value immediately
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                numberEl.textContent = targetValue + (hasPlus ? '+' : '');
                counterObserver.unobserve(item);
                return;
            }

            // Animate numeric portion
            animateNumber(numberEl, 0, targetValue, 1800);

            // Append plus sign (if present) after animation completes
            setTimeout(() => {
                if (hasPlus && !numberEl.textContent.includes('+')) numberEl.textContent = numberEl.textContent + '+';
            }, 1850);

            counterObserver.unobserve(item);
        });
    }, { threshold: 0.5 });

    statItems.forEach(item => counterObserver.observe(item));
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const isPercentage = element.textContent.includes('%');

    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = Math.floor(start + (end - start) * easeOutQuart);

        element.textContent = currentValue + (isPercentage ? '%' : '');

        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }

    requestAnimationFrame(updateNumber);
}

// Social Section Animations
// initSocialAnimations removed — social section deleted from HTML/CSS

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance optimization: Debounce resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced scroll event handling
const optimizedScrollHandler = throttle(() => {
    // Update scroll-based animations
    updateParallax();

    // Update navigation visibility
    const navbar = document.querySelector('.navbar');
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 100) {
        navbar?.classList.add('hidden');
    } else {
        navbar?.classList.remove('hidden');
    }

    lastScrollY = currentScrollY;
}, 16); // ~60fps

// Enhanced resize event handling
const optimizedResizeHandler = debounce(() => {
    // Update parallax on resize
    updateParallax();

    // Re-check responsive behaviors
    checkResponsiveBehaviors();
}, 250);

// Attach optimized event listeners
window.addEventListener('scroll', optimizedScrollHandler);
window.addEventListener('resize', optimizedResizeHandler);

// Responsive behavior checker
function checkResponsiveBehaviors() {
    const width = window.innerWidth;
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');

    if (width > 768 && navMenu && hamburger) {
        // Reset mobile menu on desktop
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
}

// Error handling for missing assets
function handleMissingAssets() {
    const images = document.querySelectorAll('img');
    const videos = document.querySelectorAll('video');

    images.forEach(img => {
        img.addEventListener('error', () => {
            console.warn(`Failed to load image: ${img.src}`);
            img.style.opacity = '0.5';
            img.alt = 'Image not found';
        });
    });

    videos.forEach(video => {
        video.addEventListener('error', () => {
            console.warn(`Failed to load video: ${video.src}`);
            video.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.textContent = 'Video not available';
            fallback.style.padding = '20px';
            fallback.style.background = 'var(--glass-bg)';
            fallback.style.borderRadius = '8px';
            video.parentNode.appendChild(fallback);
        });
    });
}

// Initialize error handling
document.addEventListener('DOMContentLoaded', handleMissingAssets);

// Debug function for testing
function debugPortfolio() {
    console.log('🔍 Portfolio Debug Info:');
    console.log('Theme:', document.body.getAttribute('data-theme'));
    console.log('Scroll Y:', window.scrollY);
    console.log('Viewport Height:', window.innerHeight);
    console.log('Document Height:', document.documentElement.scrollHeight);
    console.log('Projects:', projects.length);
    console.log('Parallax Elements:', document.querySelectorAll('[data-parallax]').length);
    console.log('Animated Elements:', document.querySelectorAll('[data-anim]').length);
}

// Add debug function to global scope
window.debugPortfolio = debugPortfolio;

// Performance monitoring
let frameCount = 0;
let lastTime = performance.now();

function monitorPerformance() {
    frameCount++;
    const currentTime = performance.now();

    if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

        if (fps < 30) {
            console.warn(`Low FPS detected: ${fps}`);
        }

        frameCount = 0;
        lastTime = currentTime;
    }

    requestAnimationFrame(monitorPerformance);
}

// Start performance monitoring
// requestAnimationFrame(monitorPerformance);

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    // Remove event listeners
    window.removeEventListener('scroll', optimizedScrollHandler);
    window.removeEventListener('resize', optimizedResizeHandler);

    // Close any open modals
    closeVideoModal();
});

// Export functions for global access
window.openVideoModal = openVideoModal;
window.closeVideoModal = closeVideoModal;
window.debugPortfolio = debugPortfolio;

console.log('📄 Portfolio JavaScript Loaded');

// Show only hero on first load until user scrolls or interacts
function applyHeroOnlyFirstLoad() {
    const body = document.body;
    const seen = localStorage.getItem('heroSeen');
    if (seen) return; // already expanded before

    // Lock down the page to hero-only view
    body.classList.add('hero-only');

    function expandAll() {
        body.classList.remove('hero-only');
        localStorage.setItem('heroSeen', '1');
        // Reveal nav/footer back
        // trigger animations if needed
        setTimeout(() => {
            initScrollAnimations();
            updateParallax();
        }, 100);
        // Remove temporary listeners
        window.removeEventListener('scroll', onFirstScroll);
        window.removeEventListener('keydown', onKey);
        document.removeEventListener('click', onFirstClick);
    }

    function onFirstScroll() { expandAll(); }
    function onKey(e) { if (e.key === 'ArrowDown' || e.key === ' ') expandAll(); }
    function onFirstClick() { expandAll(); }

    window.addEventListener('scroll', onFirstScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    document.addEventListener('click', onFirstClick, { once: true });
}
