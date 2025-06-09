// Portfolio Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');
    
    // Combine all internal navigation links
    const allNavElements = [...navLinks, ...heroButtons];
    
    allNavElements.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal links (starting with #)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const navbar = document.querySelector('.navbar');
                    const navbarHeight = navbar ? navbar.offsetHeight : 0;
                    const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                    
                    // Enhanced smooth scrolling
                    const startPosition = window.pageYOffset;
                    const distance = targetPosition - startPosition;
                    const duration = 800;
                    let start = null;
                    
                    function animation(currentTime) {
                        if (start === null) start = currentTime;
                        const timeElapsed = currentTime - start;
                        const run = ease(timeElapsed, startPosition, distance, duration);
                        window.scrollTo(0, run);
                        if (timeElapsed < duration) requestAnimationFrame(animation);
                    }
                    
                    // Easing function for smooth animation
                    function ease(t, b, c, d) {
                        t /= d / 2;
                        if (t < 1) return c / 2 * t * t + b;
                        t--;
                        return -c / 2 * (t * (t - 2) - 1) + b;
                    }
                    
                    requestAnimationFrame(animation);
                }
            }
        });
    });
    
    // Navbar background opacity on scroll
    const navbar = document.querySelector('.navbar');
    
    function updateNavbar() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            navbar.style.background = 'rgba(254, 254, 254, 0.98)';
            navbar.style.backdropFilter = 'blur(12px)';
            navbar.style.boxShadow = '0 2px 20px rgba(44, 62, 80, 0.1)';
        } else {
            navbar.style.background = 'rgba(254, 254, 254, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = 'none';
        }
    }
    
    // Initial navbar state
    updateNavbar();
    
    // Update navbar on scroll with throttling
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', function() {
        ticking = false;
        requestTick();
    });
    
    // Add active state to navigation links based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 150;
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });
        
        // Remove active class from all nav links
        navLinks.forEach(link => link.classList.remove('active'));
        
        // Add active class to current section's nav link
        if (currentSection) {
            const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }
    
    // Update active nav link on scroll with throttling
    let navTicking = false;
    function requestNavTick() {
        if (!navTicking) {
            requestAnimationFrame(updateActiveNavLink);
            navTicking = true;
        }
    }
    
    window.addEventListener('scroll', function() {
        navTicking = false;
        requestNavTick();
    });
    
    // Initial active nav link update
    updateActiveNavLink();
    
    // Add intersection observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.skill-item, .project-card, .contact-link');
    
    // Set initial styles for animation
    animateElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // Add stagger animation delay to grid items
    const skillItems = document.querySelectorAll('.skill-item');
    const projectCards = document.querySelectorAll('.project-card');
    
    skillItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });
    
    projectCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.15}s`;
    });
    
    // Handle skill icon loading and create fallbacks
    const skillIcons = [
        { name: 'Python', fallback: 'PY', color: '#3776AB' },
        { name: 'Java', fallback: 'JA', color: '#ED8B00' },
        { name: 'PostgreSQL', fallback: 'PG', color: '#336791' },
        { name: 'Git', fallback: 'GT', color: '#F05032' },
        { name: 'VS Code', fallback: 'VS', color: '#007ACC' }
    ];
    
    const skillImages = document.querySelectorAll('.skill-icon');
    
    skillImages.forEach((img, index) => {
        // Set a timeout to detect if image loads
        const loadTimeout = setTimeout(() => {
            if (!img.complete || img.naturalWidth === 0) {
                createFallbackIcon(img, index);
            }
        }, 3000);
        
        img.addEventListener('load', function() {
            clearTimeout(loadTimeout);
        });
        
        img.addEventListener('error', function() {
            clearTimeout(loadTimeout);
            createFallbackIcon(img, index);
        });
    });
    
    function createFallbackIcon(img, index) {
        const skillItem = img.closest('.skill-item');
        const skillName = skillItem.querySelector('.skill-name').textContent;
        
        // Hide the broken image
        img.style.display = 'none';
        
        // Create fallback icon
        const fallbackIcon = document.createElement('div');
        fallbackIcon.className = 'skill-icon-text';
        
        // Use predefined fallback or generate one
        const skillData = skillIcons.find(skill => skill.name === skillName) || {
            fallback: skillName.substring(0, 2).toUpperCase(),
            color: '#5DADE2'
        };
        
        fallbackIcon.textContent = skillData.fallback;
        fallbackIcon.style.background = `linear-gradient(135deg, ${skillData.color} 0%, ${skillData.color}CC 100%)`;
        fallbackIcon.style.color = 'white';
        fallbackIcon.style.width = '48px';
        fallbackIcon.style.height = '48px';
        fallbackIcon.style.display = 'flex';
        fallbackIcon.style.alignItems = 'center';
        fallbackIcon.style.justifyContent = 'center';
        fallbackIcon.style.borderRadius = '8px';
        fallbackIcon.style.fontSize = '14px';
        fallbackIcon.style.fontWeight = '600';
        fallbackIcon.style.marginBottom = '12px';
        fallbackIcon.style.transition = 'transform 0.3s ease';
        
        img.parentNode.insertBefore(fallbackIcon, img);
    }
    
    // Ensure external contact links open in new tabs
    const contactLinks = document.querySelectorAll('.contact-link');
    contactLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.startsWith('http') || href.startsWith('mailto:'))) {
            link.setAttribute('target', '_blank');
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
    
    // Add typing effect to hero tagline
    const heroTagline = document.querySelector('.hero-tagline');
    if (heroTagline) {
        const originalText = heroTagline.textContent;
        heroTagline.textContent = '';
        heroTagline.style.borderRight = '2px solid var(--color-primary)';
        
        let i = 0;
        function typeWriter() {
            if (i < originalText.length) {
                heroTagline.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 30);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    heroTagline.style.borderRight = 'none';
                }, 1000);
            }
        }
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 1500);
    }
    
    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Add loading animation
    const loader = document.createElement('div');
    loader.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #FEFEFE;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        ">
            <div style="
                width: 40px;
                height: 40px;
                border: 3px solid #F8F9FA;
                border-top: 3px solid #5DADE2;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
        </div>
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    document.body.appendChild(loader);
    
    // Hide loader after page loads
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(loader);
            }, 500);
        }, 500);
    });
    
    // Console log for debugging
    console.log('Portfolio website loaded successfully!');
    console.log('Navigation links:', navLinks.length);
    console.log('Project cards:', projectCards.length);
    console.log('Skill items:', skillItems.length);
});