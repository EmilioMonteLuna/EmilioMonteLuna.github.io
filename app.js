/**
 * Portfolio Website JavaScript
 * Emilio Montelongo Luna
 */

// Use IIFE for encapsulation and prevent global scope pollution
(function() {
  'use strict';

  // DOM Elements Cache
  const DOM = {
    navbar: document.querySelector('.navbar'),
    navLinks: document.querySelectorAll('.nav-link'),
    heroButtons: document.querySelectorAll('.hero-buttons .btn'),
    sections: document.querySelectorAll('section[id]'),
    skillItems: document.querySelectorAll('.skill-item'),
    projectCards: document.querySelectorAll('.project-card'),
    contactLinks: document.querySelectorAll('.contact-link'),
    heroTagline: document.querySelector('.hero-tagline'),
    hero: document.querySelector('.hero'),
    body: document.body,
    // New element references for enhanced features
    mobileNavToggle: document.getElementById('mobile-nav-toggle'),
    navMenu: document.getElementById('nav-menu'),
    themeToggle: document.getElementById('theme-toggle'),
    backToTop: document.getElementById('back-to-top'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    contactForm: document.getElementById('contact-form')
  };

  // Configuration
  const config = {
    scrollDuration: 800,
    skillItemAnimationDelay: 0.1,
    projectCardAnimationDelay: 0.15,
    observerThreshold: 0.1,
    observerRootMargin: '0px 0px -50px 0px',
    typewriterDelay: 30,
    initialDelay: 1500,
    loaderDisplayTime: 500,
    debounceDelay: 100,
    defaultTheme: 'light' // Set light as the default theme
  };

  // Skill Icon Fallbacks
  const skillIcons = [
    { name: 'Python', fallback: 'PY', color: '#3776AB' },
    { name: 'Java', fallback: 'JA', color: '#ED8B00' },
    { name: 'PostgreSQL', fallback: 'PG', color: '#336791' },
    { name: 'Git', fallback: 'GT', color: '#F05032' },
    { name: 'VS Code', fallback: 'VS', color: '#007ACC' },
    { name: 'Docker', fallback: 'DK', color: '#2496ED' },
    { name: 'AWS', fallback: 'AWS', color: '#FF9900' },
    { name: 'PyTorch', fallback: 'PT', color: '#EE4C2C' },
    { name: 'MongoDB', fallback: 'MG', color: '#47A248' },
    { name: 'Excel', fallback: 'XL', color: '#217346' },
    { name: 'Power BI', fallback: 'PBI', color: '#F2C811' },
    { name: 'Tableau', fallback: 'TB', color: '#E97627' },
    { name: 'C', fallback: 'C', color: '#A8B9CC' },
    { name: 'Linux', fallback: 'LX', color: '#FCC624' }
  ];

  /**
   * Utility functions
   */
  const utils = {
    // Easing function for smooth animation
    easeInOutQuad: (t, b, c, d) => {
      t /= d / 2;
      if (t < 1) return c / 2 * t * t + b;
      t--;
      return -c / 2 * (t * (t - 2) - 1) + b;
    },

    // Debounce function to limit function calls
    debounce: (func, wait) => {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },

    // Get current theme from localStorage or use light mode by default
    getCurrentTheme: () => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
      
      // Always return light theme as default, ignoring system preference
      return config.defaultTheme;
    },

    // Set theme and save to localStorage
    setTheme: (theme) => {
      document.documentElement.setAttribute('data-color-scheme', theme);
      localStorage.setItem('theme', theme);
      
      // Update theme toggle icon if it exists
      if (DOM.themeToggle) {
        const icon = DOM.themeToggle.querySelector('.theme-toggle-icon');
        if (icon) {
          // Moon icon for light mode (to switch to dark)
          // Sun icon for dark mode (to switch to light)
          icon.innerHTML = theme === 'dark' 
            ? `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>` 
            : `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
        }
      }
    },

    // Create a loading spinner
    createLoader: () => {
      const loader = document.createElement('div');
      loader.classList.add('page-loader');
      loader.innerHTML = `
        <div class="loader-container">
          <div class="loader-spinner"></div>
        </div>
      `;
      return loader;
    }
  };

  /**
   * Feature: Smooth Scrolling
   */
  const smoothScroll = {
    init: () => {
      // Combine all internal navigation links
      const allNavElements = [...DOM.navLinks, ...DOM.heroButtons];
      
      allNavElements.forEach(link => {
        link.addEventListener('click', smoothScroll.handleClick);
      });
      
      // Back to top button functionality
      if (DOM.backToTop) {
        DOM.backToTop.addEventListener('click', smoothScroll.handleClick);
        
        // Show/hide back to top button based on scroll position
        window.addEventListener('scroll', utils.debounce(() => {
          if (window.pageYOffset > 300) {
            DOM.backToTop.classList.add('visible');
          } else {
            DOM.backToTop.classList.remove('visible');
          }
        }, config.debounceDelay));
      }
    },
    
    handleClick: function(e) {
      const href = this.getAttribute('href');
      
      // Only handle internal links (starting with #)
      if (href && href.startsWith('#')) {
        e.preventDefault();
        
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          // Close mobile menu if open
          if (DOM.navMenu && DOM.navMenu.classList.contains('active')) {
            DOM.navMenu.classList.remove('active');
            if (DOM.mobileNavToggle) {
              DOM.mobileNavToggle.classList.remove('active');
            }
          }
          
          const navbarHeight = DOM.navbar ? DOM.navbar.offsetHeight : 0;
          const targetPosition = targetElement.offsetTop - navbarHeight - 20;
          
          smoothScroll.animateScroll(targetPosition);
        }
      }
    },
    
    animateScroll: (targetPosition) => {
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      const duration = config.scrollDuration;
      let start = null;
      
      function animation(currentTime) {
        if (start === null) start = currentTime;
        const timeElapsed = currentTime - start;
        const run = utils.easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      }
      
      requestAnimationFrame(animation);
    }
  };

  /**
   * Feature: Navigation UI Enhancement
   */
  const navigation = {
    init: () => {
      // Initial navbar state
      navigation.updateNavbar();
      
      // Update navbar on scroll with throttling
      window.addEventListener('scroll', () => {
        if (!navigation.ticking) {
          requestAnimationFrame(() => {
            navigation.updateNavbar();
            navigation.updateActiveNavLink();
            navigation.ticking = false;
          });
          navigation.ticking = true;
        }
      });
      
      // Mobile menu toggle
      if (DOM.mobileNavToggle && DOM.navMenu) {
        DOM.mobileNavToggle.addEventListener('click', () => {
          DOM.mobileNavToggle.classList.toggle('active');
          DOM.navMenu.classList.toggle('active');
        });
      }
      
      // Initial active nav link update
      navigation.updateActiveNavLink();
    },
    
    ticking: false,
    
    updateNavbar: () => {
      if (!DOM.navbar) return;
      
      const scrollY = window.scrollY;
      
      if (scrollY > 50) {
        DOM.navbar.classList.add('scrolled');
      } else {
        DOM.navbar.classList.remove('scrolled');
      }
    },
    
    updateActiveNavLink: () => {
      if (!DOM.sections || !DOM.sections.length) return;
      
      const scrollPosition = window.scrollY + 150;
      
      let currentSection = '';
      
      DOM.sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
          currentSection = sectionId;
        }
      });
      
      // Remove active class from all nav links
      DOM.navLinks.forEach(link => link.classList.remove('active'));
      
      // Add active class to current section's nav link
      if (currentSection) {
        const activeLink = document.querySelector(`.nav-link[href="#${currentSection}"]`);
        if (activeLink) {
          activeLink.classList.add('active');
        }
      }
    }
  };

  /**
   * Feature: Animation & Visual Effects
   */
  const animations = {
    init: () => {
      // Initialize intersection observer for animations
      animations.setupObserver();
      
      // Add staggered animation delay to grid items
      animations.setupStaggeredAnimations();
      
      // Add typing effect to hero tagline
      animations.setupTypingEffect();
      
      // Add parallax effect to hero section
      animations.setupParallaxEffect();
    },
    
    setupObserver: () => {
      const observerOptions = {
        threshold: config.observerThreshold,
        rootMargin: config.observerRootMargin
      };
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);
      
      // Observe elements for animation
      const animateElements = document.querySelectorAll('.skill-item, .project-card, .contact-link, .section-title, .about-content, .contact-form');
      
      animateElements.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
      });
    },
    
    setupStaggeredAnimations: () => {
      // Add stagger animation delay to grid items
      DOM.skillItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * config.skillItemAnimationDelay}s`;
      });
      
      DOM.projectCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * config.projectCardAnimationDelay}s`;
      });
    },
    
    setupTypingEffect: () => {
      if (!DOM.heroTagline) return;
      
      const originalText = DOM.heroTagline.textContent;
      DOM.heroTagline.textContent = '';
      DOM.heroTagline.classList.add('typing');
      
      let i = 0;
      function typeWriter() {
        if (i < originalText.length) {
          DOM.heroTagline.textContent += originalText.charAt(i);
          i++;
          setTimeout(typeWriter, config.typewriterDelay);
        } else {
          // Remove cursor after typing is complete
          setTimeout(() => {
            DOM.heroTagline.classList.remove('typing');
          }, 1000);
        }
      }
      
      // Start typing effect after a short delay
      setTimeout(typeWriter, config.initialDelay);
    },
    
    setupParallaxEffect: () => {
      if (!DOM.hero) return;
      
      window.addEventListener('scroll', utils.debounce(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.15;
        DOM.hero.style.backgroundPosition = `center ${rate}px`;
      }, 10));
    }
  };

  /**
   * Feature: Theme Switching
   */
  const themeManager = {
    init: () => {
      // Force light theme on initial load
      utils.setTheme('light');
      
      // Add theme toggle functionality
      if (DOM.themeToggle) {
        DOM.themeToggle.addEventListener('click', themeManager.toggleTheme);
        
        // Ensure toggle shows moon icon initially (for switching to dark mode)
        const icon = DOM.themeToggle.querySelector('.theme-toggle-icon');
        if (icon) {
          icon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
        }
      }
      
      // Ignore system preference changes - we want to keep user's explicit choice
    },
    
    toggleTheme: () => {
      const currentTheme = utils.getCurrentTheme();
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      utils.setTheme(newTheme);
    }
  };

  /**
   * Feature: Project Filtering
   */
  const projectFilters = {
    init: () => {
      if (!DOM.filterButtons || !DOM.filterButtons.length) return;
      
      DOM.filterButtons.forEach(button => {
        button.addEventListener('click', function() {
          // Remove active class from all buttons
          DOM.filterButtons.forEach(btn => btn.classList.remove('active'));
          
          // Add active class to clicked button
          this.classList.add('active');
          
          // Get filter value
          const filter = this.getAttribute('data-filter');
          
          // Filter projects
          DOM.projectCards.forEach(card => {
            if (filter === 'all') {
              card.style.display = 'block';
            } else {
              const category = card.getAttribute('data-category');
              if (category && category.includes(filter)) {
                card.style.display = 'block';
              } else {
                card.style.display = 'none';
              }
            }
          });
          
          // Trigger a small layout shift to fix any animation issues
          setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
          }, 300);
        });
      });
    }
  };

  /**
   * Feature: Contact Form Handling
   */
  const contactForm = {
    init: () => {
      if (!DOM.contactForm) return;
      
      DOM.contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitButton = this.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Collect form data
        const formData = new FormData(this);
        const formObject = {};
        formData.forEach((value, key) => {
          formObject[key] = value;
        });
        
        // For demonstration - simulate form submission
        setTimeout(() => {
          // Create success message
          const successMessage = document.createElement('div');
          successMessage.className = 'form-success-message';
          successMessage.textContent = 'Thank you for your message! I will get back to you soon.';
          
          // Hide form and show success message
          DOM.contactForm.style.display = 'none';
          DOM.contactForm.parentNode.appendChild(successMessage);
          
          // Log form data to console (in real world, this would be sent to a server)
          console.log('Form submitted:', formObject);
          
          // Reset form
          DOM.contactForm.reset();
          submitButton.textContent = originalButtonText;
          submitButton.disabled = false;
        }, 1500);
      });
    }
  };

  /**
   * Feature: Skill Icon Fallbacks
   */
  const iconFallbacks = {
    init: () => {
      const skillImages = document.querySelectorAll('.skill-icon');
      
      skillImages.forEach((img) => {
        // Set a timeout to detect if image loads
        const loadTimeout = setTimeout(() => {
          if (!img.complete || img.naturalWidth === 0) {
            iconFallbacks.createFallbackIcon(img);
          }
        }, 3000);
        
        img.addEventListener('load', function() {
          clearTimeout(loadTimeout);
        });
        
        img.addEventListener('error', function() {
          clearTimeout(loadTimeout);
          iconFallbacks.createFallbackIcon(img);
        });
      });
      
      // Ensure external contact links open in new tabs
      DOM.contactLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.startsWith('http') || href.startsWith('mailto:'))) {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');
        }
      });
    },
    
    createFallbackIcon: (img) => {
      const skillItem = img.closest('.skill-item');
      if (!skillItem) return;
      
      const skillName = skillItem.querySelector('.skill-name')?.textContent || '';
      
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
      
      img.parentNode.insertBefore(fallbackIcon, img);
    }
  };

  /**
   * Initialize all features when DOM is loaded
   */
  document.addEventListener('DOMContentLoaded', () => {
    // Create and show loader
    const loader = utils.createLoader();
    DOM.body.appendChild(loader);
    
    // Initialize all features
    smoothScroll.init();
    navigation.init();
    animations.init();
    themeManager.init();
    projectFilters.init();
    contactForm.init();
    iconFallbacks.init();
    
    // Log initialization success
    console.log('Portfolio website initialized successfully!');
    
    // Hide loader after everything is loaded
    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
          DOM.body.removeChild(loader);
        }, config.loaderDisplayTime);
      }, config.loaderDisplayTime);
    });
  });
})();