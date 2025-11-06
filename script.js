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
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add theme transition effect
        body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    });
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
// Required feature projects
const projects = [
    { 
        title: 'ATXI Team Introduction', 
        date: 'Sep 2025', 
        description: 'Team intro sizzle with dynamic pacing and captions.',
        thumbnail: 'assets/images/logo atxi.jpg',
        url: 'https://drive.google.com/file/d/1D6nr4XwvCyoXvPNKECxD0f3QiNWq2WmR/view?usp=sharing'
    },
    { 
        title: 'Ascentra App Showcase', 
        date: 'Mar 2025', 
        description: 'Product showcase highlighting features and UX.',
        thumbnail: 'assets/images/ascentra.png',
        url: 'https://drive.google.com/file/d/168YgF23XKmLHShx7d9Y0smdE2fvX_hfs/view?usp=sharing'
    },
    { 
        title: 'Museo', 
        date: 'Jun 2025', 
        description: 'Cinematic piece focusing on composition and tone.',
        thumbnail: 'assets/images/museo cover.png',
        url: 'https://drive.google.com/file/d/1g27qO8OKOvqH1gunGrD7EjhY6fBBEimU/view?usp=sharing'
    },
    { 
        title: 'Panagtagbo Recap Showcase', 
        date: 'Aug 2025', 
        description: 'Event recap with energetic cutting and rhythm.',
        thumbnail: 'assets/images/poster (1).png',
        url: 'https://drive.google.com/file/d/1ikO2u03XuWD5OXo8RsU-kh4wInl3JpS9/view?usp=sharing'
    },
    {
        title: 'Develop Kreativity Intro',
        date: '2025',
        description: 'Intro piece edited for Develop Kreativity.',
        thumbnail: 'assets/images/logo develop kreativity.jpg',
        url: 'https://drive.google.com/file/d/1QOOna3RNJJds2hHrxZnu2-dc7Mhi4MgN/view?usp=sharing'
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
    // Fallback placeholder
    return 'assets/images/placeholder.svg';
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

function initProjects() {
    const projectsGrid = document.querySelector('#projectsGrid') || document.querySelector('.projects-grid');
    if (!projectsGrid) {
        console.warn('Projects grid not found');
        return;
    }
    console.log('📁 Initializing projects...');

    projects.forEach(async (project, index) => {
        // Build a unified card
        const card = createUnifiedCard(project, index, {
            type: 'project',
            onClick: () => {
                if (project.url) {
                    window.open(project.url, '_blank', 'noopener');
                }
            }
        });

        projectsGrid.appendChild(card);

        // If project explicitly provides a thumbnail, use it; otherwise resolve
        const thumbEl = card.querySelector('.project-thumbnail');
        if (thumbEl) {
            const thumbUrl = project.thumbnail || await resolveThumbnail(project.title);
            thumbEl.style.backgroundImage = `url('${thumbUrl}')`;
        }

        card.dataset.url = project.url || '';
    });

    if (projects.length === 5) {
        projectsGrid.classList.add('grid-five');
    }

    // Initialize modal wiring
    initVideoModal();
}

// Unified card builder used for both projects and teams to ensure consistent layout/styling
function createUnifiedCard(item, index, options = {}) {
    const { type = 'project', onClick } = options;
    const card = document.createElement('div');
    // Use skill-card styling for teams to match Skills & Expertise layout, otherwise use project-card
    card.className = type === 'team' ? 'skill-card team-card' : 'project-card';
    // Common animation attributes
    card.setAttribute('data-anim', 'zoom-in');
    card.setAttribute('data-delay', (index * 100).toString());

    if (type === 'team') {
        // Skill-style card: thumbnail in .skill-icon, title, and description
        card.innerHTML = `
            <div class="skill-icon" data-parallax data-speed="0.22">
                <img class="skill-icon-img team-logo-image" src="${item.thumbnail || ''}" alt="${item.title} logo" />
            </div>
            <div class="skill-name">${item.title}</div>
            <div class="skill-description">${item.description || ''}</div>
        `;
    } else {
        // Project card (unchanged)
        card.innerHTML = `
            <div class="project-thumbnail" data-parallax data-speed="0.2">
                <div class="project-play-icon">▶</div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${item.title}</h3>
                <p class="project-description">${item.description || ''}</p>
            </div>
        `;
    }

    // Click handling: projects open modal, teams open external link (or custom handler)
    card.addEventListener('click', (e) => {
        // Attempt custom onClick first
        if (typeof onClick === 'function') return onClick(e);

        if (type === 'project') {
            const mediaUrl = card.dataset.mediaUrl;
            const isVideo = card.dataset.isVideo === '1';
            openVideoModal({
                title: item.title,
                date: item.date,
                description: item.description,
                mediaUrl,
                isVideo
            });
        } else if (type === 'team' && item.url) {
            window.open(item.url, '_blank', 'noopener');
        }
    });

    // Hover effects (same as before)
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-12px) scale(1.02)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });

    return card;
}

// Initialize Teams section using the same card system
const teams = [
    {
        title: 'Develop Kreativity',
        description: 'Assigned as Video Editor and Motion Graphics Designer for various projects.',
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
        // Get progress percentage from data attribute or default
        const progress = progressBar.getAttribute('data-progress') || '85';
        
        // Set CSS variable for animation
        progressBar.style.setProperty('--progress', progress + '%');
        
        // Animate progress bar
        setTimeout(() => {
            progressBar.classList.add('animate');
        }, 200);
        
        // Animate progress text
        if (progressText) {
            animateNumber(progressText, 0, parseInt(progress), 1500);
        }
    }
    
    // Animate skill icon
    const skillIcon = skillCard.querySelector('.skill-icon');
    if (skillIcon) {
        skillIcon.style.animation = 'iconFloat 3s ease-in-out infinite';
    }
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
    return function() {
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
