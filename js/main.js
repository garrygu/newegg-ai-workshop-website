// Main JavaScript for Newegg AI Workshop Registration Site

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll reveal animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

// Observe all scroll-reveal elements
document.querySelectorAll('.scroll-reveal').forEach(el => {
    observer.observe(el);
});

// Add scroll reveal to cards
document.querySelectorAll('.level-card, .feature-card').forEach((card, index) => {
    card.classList.add('scroll-reveal');
    card.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(card);
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuIcon = menuToggle?.querySelector('.menu-icon');
    const menuClose = menuToggle?.querySelector('.menu-close');
    
    if (!menuToggle || !navMenu) return;
    
    function toggleMenu() {
        const isActive = navMenu.classList.toggle('active');
        menuOverlay?.classList.toggle('active', isActive);
        
        // Update button state
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', isActive);
            if (menuIcon) menuIcon.style.display = isActive ? 'none' : 'inline';
            if (menuClose) menuClose.style.display = isActive ? 'inline' : 'none';
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? 'hidden' : '';
    }
    
    function closeMenu() {
        navMenu.classList.remove('active');
        menuOverlay?.classList.remove('active');
        if (menuToggle) {
            menuToggle.setAttribute('aria-expanded', 'false');
            if (menuIcon) menuIcon.style.display = 'inline';
            if (menuClose) menuClose.style.display = 'none';
        }
        document.body.style.overflow = '';
    }
    
    // Toggle menu on button click
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });
    
    // Close menu when clicking overlay
    menuOverlay?.addEventListener('click', closeMenu);
    
    // Close menu when clicking a menu link
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            // Small delay to allow navigation
            setTimeout(closeMenu, 100);
        });
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close menu on window resize if it becomes desktop size
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                closeMenu();
            }
        }, 250);
    });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    
    // Add fade-in animation to hero
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.classList.add('fade-in');
    }
    
    // Add loading states to external links
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function() {
            // Could add analytics tracking here
            console.log('External link clicked:', this.href);
        });
    });
});

// Form validation helper (used by forms.js)
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\-\+\(\)]+$/;
    return re.test(phone);
}

// Utility function to show/hide form errors
function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    let errorDiv = formGroup.querySelector('.form-error');
    
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        formGroup.appendChild(errorDiv);
    }
    
    errorDiv.textContent = message;
    field.style.borderColor = '#ff4444';
}

function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    const errorDiv = formGroup.querySelector('.form-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.style.borderColor = '';
}

// Export for use in forms.js
window.formUtils = {
    validateEmail,
    validatePhone,
    showFieldError,
    clearFieldError
};

