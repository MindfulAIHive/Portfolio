// Theme Management
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.init();
    }

    init() {
        // Check for saved theme or default to system preference
        const savedTheme = localStorage.getItem('theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        const currentTheme = savedTheme || systemTheme;

        this.setTheme(currentTheme);
        this.bindEvents();
    }

    setTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
        localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    bindEvents() {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.header = document.getElementById('header');
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.getElementById('navMenu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleScroll();
    }

    bindEvents() {
        // Mobile menu toggle
        this.hamburger.addEventListener('click', () => this.toggleMobileMenu());

        // Close mobile menu when clicking on nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        // Smooth scrolling for navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.smoothScroll(e));
        });

        // Header scroll effect
        window.addEventListener('scroll', () => this.handleScroll());

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && !this.hamburger.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    smoothScroll(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }

    handleScroll() {
        const scrolled = window.scrollY > 20;
        this.header.classList.toggle('header-scrolled', scrolled);
        
        // Update active navigation link
        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href="#${id}"]`);

            if (scrollPos >= top && scrollPos <= bottom) {
                this.navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) navLink.classList.add('active');
            }
        });
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.animatedElements = document.querySelectorAll('.scroll-animate');
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.addScrollAnimationClasses();
    }

    addScrollAnimationClasses() {
        // Add scroll animation classes to elements
        const elementsToAnimate = [
            '.hero-text',
            '.hero-image',
            '.about-text',
            '.about-image',
            '.skill-item',
            '.project-card',
            '.timeline-item',
            '.contact-info',
            '.contact-form'
        ];

        elementsToAnimate.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((el, index) => {
                el.classList.add('scroll-animate');
                el.style.transitionDelay = `${index * 0.1}s`;
            });
        });
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        // Observe all elements with scroll-animate class
        document.querySelectorAll('.scroll-animate').forEach(el => {
            observer.observe(el);
        });
    }
}

// Form Management
class FormManager {
    constructor() {
        this.contactForm = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (this.contactForm) {
            this.bindEvents();
        }
    }

    bindEvents() {
        this.contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Add input validation
        const inputs = this.contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
            input.addEventListener('input', () => this.clearValidation(input));
        });
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.contactForm);
        const data = Object.fromEntries(formData);
        
        // Validate form
        if (!this.validateForm(data)) {
            return;
        }

        // Show loading state
        this.setFormLoading(true);

        try {
            // Simulate form submission (replace with actual API call)
            await this.simulateFormSubmission(data);
            this.showSuccessMessage();
            this.contactForm.reset();
        } catch (error) {
            this.showErrorMessage();
        } finally {
            this.setFormLoading(false);
        }
    }

    validateForm(data) {
        let isValid = true;
        
        // Name validation
        if (!data.name || data.name.trim().length < 2) {
            this.showInputError('name', 'Name must be at least 2 characters long');
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!data.email || !emailRegex.test(data.email)) {
            this.showInputError('email', 'Please enter a valid email address');
            isValid = false;
        }

        // Subject validation
        if (!data.subject || data.subject.trim().length < 5) {
            this.showInputError('subject', 'Subject must be at least 5 characters long');
            isValid = false;
        }

        // Message validation
        if (!data.message || data.message.trim().length < 10) {
            this.showInputError('message', 'Message must be at least 10 characters long');
            isValid = false;
        }

        return isValid;
    }

    validateInput(input) {
        const value = input.value.trim();
        const name = input.name;

        switch (name) {
            case 'name':
                if (value.length < 2) {
                    this.showInputError(name, 'Name must be at least 2 characters long');
                    return false;
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    this.showInputError(name, 'Please enter a valid email address');
                    return false;
                }
                break;
            case 'subject':
                if (value.length < 5) {
                    this.showInputError(name, 'Subject must be at least 5 characters long');
                    return false;
                }
                break;
            case 'message':
                if (value.length < 10) {
                    this.showInputError(name, 'Message must be at least 10 characters long');
                    return false;
                }
                break;
        }

        this.clearInputError(name);
        return true;
    }

    showInputError(inputName, message) {
        const input = this.contactForm.querySelector(`[name="${inputName}"]`);
        const formGroup = input.closest('.form-group');
        
        // Remove existing error
        this.clearInputError(inputName);
        
        // Add error styles
        input.style.borderColor = '#EF4444';
        
        // Add error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#EF4444';
        errorDiv.style.fontSize = '0.8rem';
        errorDiv.style.marginTop = '0.25rem';
        
        formGroup.appendChild(errorDiv);
    }

    clearInputError(inputName) {
        const input = this.contactForm.querySelector(`[name="${inputName}"]`);
        const formGroup = input.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        
        if (errorMessage) {
            errorMessage.remove();
        }
        
        input.style.borderColor = '';
    }

    clearValidation(input) {
        this.clearInputError(input.name);
    }

    setFormLoading(loading) {
        const submitBtn = this.contactForm.querySelector('button[type="submit"]');
        
        if (loading) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            this.contactForm.classList.add('loading');
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message';
            this.contactForm.classList.remove('loading');
        }
    }

    async simulateFormSubmission(data) {
        // Simulate API call delay
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure (you can modify this for testing)
                const success = Math.random() > 0.1; // 90% success rate
                if (success) {
                    resolve(data);
                } else {
                    reject(new Error('Failed to send message'));
                }
            }, 2000);
        });
    }

    showSuccessMessage() {
        this.showMessage('Message sent successfully! I\'ll get back to you soon.', 'success');
    }

    showErrorMessage() {
        this.showMessage('Failed to send message. Please try again later.', 'error');
    }

    showMessage(text, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = text;
        
        const styles = {
            padding: '1rem',
            borderRadius: '8px',
            marginTop: '1rem',
            fontSize: '0.9rem',
            fontWeight: '500'
        };

        if (type === 'success') {
            styles.backgroundColor = '#DCFCE7';
            styles.color = '#166534';
            styles.border = '1px solid #BBF7D0';
        } else {
            styles.backgroundColor = '#FEF2F2';
            styles.color = '#DC2626';
            styles.border = '1px solid #FECACA';
        }

        Object.assign(messageDiv.style, styles);
        
        this.contactForm.appendChild(messageDiv);

        // Auto-remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait) {
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

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    static isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// Performance Optimization
class PerformanceOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.optimizeImages();
        this.preloadCriticalResources();
        this.setupServiceWorker();
    }

    optimizeImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    preloadCriticalResources() {
        // Preload critical CSS and fonts
        const criticalResources = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = 'style';
            document.head.appendChild(link);
        });
    }

    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                // Service worker registration would go here
                console.log('Service worker support detected');
            });
        }
    }
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    const themeManager = new ThemeManager();
    const navigationManager = new NavigationManager();
    const scrollAnimations = new ScrollAnimations();
    const formManager = new FormManager();
    const performanceOptimizer = new PerformanceOptimizer();

    // Add smooth reveal animation to hero section
    const heroElements = document.querySelectorAll('.hero-text > *, .hero-image');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        el.style.transitionDelay = `${index * 0.2}s`;
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100);
    });

    // Add typing effect to hero title (optional)
    const heroTitle = document.querySelector('.hero-title .highlight');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }

    console.log('Portfolio website initialized successfully!');
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause non-critical animations when page is hidden
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when page becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Export for testing purposes (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThemeManager,
        NavigationManager,
        ScrollAnimations,
        FormManager,
        Utils
    };
}












// class WhatsAppContactForm {
//     constructor() {
//         this.form = document.getElementById('contactForm');
//         this.sendBtn = document.getElementById('sendBtn');
//         this.btnText = document.getElementById('btnText');
//         this.loadingSpinner = document.getElementById('loadingSpinner');
        
//         // WhatsApp number - Update this with your actual WhatsApp number
//         // Format: country code + number (no spaces or special characters)
//         // Example: '1234567890' for +1 (234) 567-8900
//         this.whatsappNumber = +923707614737; // UPDATE THIS WITH YOUR NUMBER
        
//         this.init();
//     }

//     init() {
//         this.form.addEventListener('submit', (e) => this.handleSubmit(e));
//         this.addInputListeners();
//     }

//     addInputListeners() {
//         const inputs = this.form.querySelectorAll('input, textarea');
//         inputs.forEach(input => {
//             input.addEventListener('input', () => this.clearError(input));
//             input.addEventListener('blur', () => this.validateField(input));
//         });
//     }

//     clearError(input) {
//         const formGroup = input.closest('.form-group');
//         formGroup.classList.remove('error', 'success');
//         const errorElement = formGroup.querySelector('.error-message');
//         errorElement.textContent = '';
//         errorElement.classList.remove('show');
//     }

//     showError(input, message) {
//         const formGroup = input.closest('.form-group');
//         formGroup.classList.add('error');
//         formGroup.classList.remove('success');
//         const errorElement = formGroup.querySelector('.error-message');
//         errorElement.textContent = message;
//         errorElement.classList.add('show');
//     }

//     showSuccess(input) {
//         const formGroup = input.closest('.form-group');
//         formGroup.classList.add('success');
//         formGroup.classList.remove('error');
//         const errorElement = formGroup.querySelector('.error-message');
//         errorElement.classList.remove('show');
//     }

//     validateEmail(email) {
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return emailRegex.test(email);
//     }

//     validateField(input) {
//         const value = input.value.trim();
//         let isValid = true;

//         switch (input.name) {
//             case 'name':
//                 if (!value) {
//                     this.showError(input, 'Name is required');
//                     isValid = false;
//                 } else if (value.length < 2) {
//                     this.showError(input, 'Name must be at least 2 characters');
//                     isValid = false;
//                 } else {
//                     this.showSuccess(input);
//                 }
//                 break;

//             case 'email':
//                 if (!value) {
//                     this.showError(input, 'Email is required');
//                     isValid = false;
//                 } else if (!this.validateEmail(value)) {
//                     this.showError(input, 'Please enter a valid email address');
//                     isValid = false;
//                 } else {
//                     this.showSuccess(input);
//                 }
//                 break;

//             case 'subject':
//                 if (!value) {
//                     this.showError(input, 'Subject is required');
//                     isValid = false;
//                 } else if (value.length < 3) {
//                     this.showError(input, 'Subject must be at least 3 characters');
//                     isValid = false;
//                 } else {
//                     this.showSuccess(input);
//                 }
//                 break;

//             case 'message':
//                 if (!value) {
//                     this.showError(input, 'Message is required');
//                     isValid = false;
//                 } else if (value.length < 10) {
//                     this.showError(input, 'Message must be at least 10 characters');
//                     isValid = false;
//                 } else {
//                     this.showSuccess(input);
//                 }
//                 break;
//         }

//         return isValid;
//     }

//     validateForm() {
//         const inputs = this.form.querySelectorAll('input, textarea');
//         let isFormValid = true;

//         inputs.forEach(input => {
//             const isFieldValid = this.validateField(input);
//             if (!isFieldValid) {
//                 isFormValid = false;
//             }
//         });

//         return isFormValid;
//     }

//     formatWhatsAppMessage(formData) {
//         return `*New Contact Form Submission*

// *Name:* ${formData.name}
// *Email:* ${formData.email}
// *Subject:* ${formData.subject}

// *Message:*
// ${formData.message}

// ---
// Sent from your website contact form`;
//     }

//     setLoadingState(isLoading) {
//         if (isLoading) {
//             this.sendBtn.classList.add('loading');
//             this.sendBtn.disabled = true;
//         } else {
//             this.sendBtn.classList.remove('loading');
//             this.sendBtn.disabled = false;
//         }
//     }

//     showSuccessMessage() {
//         // Create a temporary success message
//         const successDiv = document.createElement('div');
//         successDiv.style.cssText = `
//             position: fixed;
//             top: 20px;
//             right: 20px;
//             background: linear-gradient(135deg, #48bb78, #38a169);
//             color: white;
//             padding: 16px 24px;
//             border-radius: 12px;
//             box-shadow: 0 10px 25px rgba(72, 187, 120, 0.3);
//             z-index: 1000;
//             animation: slideInRight 0.5s ease-out;
//         `;
//         successDiv.innerHTML = `
//             <div style="display: flex; align-items: center; gap: 8px;">
//                 <div style="width: 20px; height: 20px;">✓</div>
//                 <div>Message sent! Opening WhatsApp...</div>
//             </div>
//         `;

//         // Add animation keyframes
//         if (!document.getElementById('successAnimation')) {
//             const style = document.createElement('style');
//             style.id = 'successAnimation';
//             style.textContent = `
//                 @keyframes slideInRight {
//                     from {
//                         transform: translateX(100%);
//                         opacity: 0;
//                     }
//                     to {
//                         transform: translateX(0);
//                         opacity: 1;
//                     }
//                 }
//             `;
//             document.head.appendChild(style);
//         }

//         document.body.appendChild(successDiv);

//         // Remove the success message after 3 seconds
//         setTimeout(() => {
//             successDiv.style.animation = 'slideInRight 0.5s ease-out reverse';
//             setTimeout(() => {
//                 document.body.removeChild(successDiv);
//             }, 500);
//         }, 3000);
//     }

//     resetForm() {
//         this.form.reset();
        
//         // Clear all validation states
//         const formGroups = this.form.querySelectorAll('.form-group');
//         formGroups.forEach(group => {
//             group.classList.remove('success', 'error');
//             const errorElement = group.querySelector('.error-message');
//             errorElement.textContent = '';
//             errorElement.classList.remove('show');
//         });
//     }

//     async handleSubmit(e) {
//         e.preventDefault();

//         if (!this.validateForm()) {
//             // Scroll to first error
//             const firstError = this.form.querySelector('.form-group.error');
//             if (firstError) {
//                 firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
//             }
//             return;
//         }

//         // Set loading state
//         this.setLoadingState(true);

//         try {
//             // Get form data
//             const formData = new FormData(this.form);
//             const data = {
//                 name: formData.get('name').trim(),
//                 email: formData.get('email').trim(),
//                 subject: formData.get('subject').trim(),
//                 message: formData.get('message').trim()
//             };

//             // Format message for WhatsApp
//             const whatsappMessage = this.formatWhatsAppMessage(data);
//             const encodedMessage = encodeURIComponent(whatsappMessage);

//             // Create WhatsApp URL
//             const whatsappURL = `https://wa.me/${this.whatsappNumber}?text=${encodedMessage}`;

//             // Simulate processing time (remove this in production if not needed)
//             await new Promise(resolve => setTimeout(resolve, 1500));

//             // Open WhatsApp
//             window.open(whatsappURL, '_blank');

//             // Show success message
//             this.showSuccessMessage();

//             // Reset form
//             this.resetForm();

//         } catch (error) {
//             console.error('Error sending message:', error);
            
//             // Show error message
//             const errorDiv = document.createElement('div');
//             errorDiv.style.cssText = `
//                 position: fixed;
//                 top: 20px;
//                 right: 20px;
//                 background: linear-gradient(135deg, #fc8181, #f56565);
//                 color: white;
//                 padding: 16px 24px;
//                 border-radius: 12px;
//                 box-shadow: 0 10px 25px rgba(252, 129, 129, 0.3);
//                 z-index: 1000;
//             `;
//             errorDiv.innerHTML = `
//                 <div style="display: flex; align-items: center; gap: 8px;">
//                     <div style="width: 20px; height: 20px;">✕</div>
//                     <div>Failed to send message. Please try again.</div>
//                 </div>
//             `;
            
//             document.body.appendChild(errorDiv);
//             setTimeout(() => {
//                 if (document.body.contains(errorDiv)) {
//                     document.body.removeChild(errorDiv);
//                 }
//             }, 5000);

//         } finally {
//             // Remove loading state
//             this.setLoadingState(false);
//         }
//     }
// }

// // Initialize the form when the page loads
// document.addEventListener('DOMContentLoaded', () => {
//     new WhatsAppContactForm();
// });

// // Add some additional interactive features
// document.addEventListener('DOMContentLoaded', () => {
//     // Add focus effect to form wrapper
//     const inputs = document.querySelectorAll('input, textarea');
//     const formWrapper = document.querySelector('.form-wrapper');
    
//     inputs.forEach(input => {
//         input.addEventListener('focus', () => {
//             formWrapper.style.boxShadow = '0 25px 50px rgba(66, 153, 225, 0.2)';
//         });
        
//         input.addEventListener('blur', () => {
//             formWrapper.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.3)';
//         });
//     });
// });