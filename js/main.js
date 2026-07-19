/* ============================================
   Smart Student Service Portal
   main.js — Core Functionality
   ============================================ */

'use strict';

const App = (() => {

    /* ----- DOM References ----- */
    const header = document.querySelector('.header');
    const mobileToggle = document.querySelector('.header-mobile-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const rippleContainer = document.querySelector('.ripple-container');
    const bgCampus = document.querySelector('.bg-campus');

    /* ----- Header scroll effect ----- */
    function initHeaderScroll() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (window.scrollY > 20) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /* ----- Mobile navigation ----- */
    function initMobileNav() {
        if (!mobileToggle || !mobileNav) return;

        function openNav() {
            mobileNav.classList.add('open');
            mobileToggle.classList.add('active');
            mobileToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        }

        function closeNav() {
            mobileNav.classList.remove('open');
            mobileToggle.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        mobileToggle.addEventListener('click', () => {
            const isOpen = mobileNav.classList.contains('open');
            if (isOpen) closeNav();
            else openNav();
        });

        if (mobileNavClose) {
            mobileNavClose.addEventListener('click', closeNav);
        }

        mobileNavLinks.forEach((link) => {
            link.addEventListener('click', closeNav);
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
                closeNav();
            }
        });

        // Close on backdrop click
        mobileNav.addEventListener('click', (e) => {
            if (e.target === mobileNav) {
                closeNav();
            }
        });
    }

    /* ----- Button ripple effect ----- */
    function initRipple() {
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn');
            if (!btn) return;

            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.width = size + 'px';
            ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';

            if (!rippleContainer) return;
            rippleContainer.appendChild(ripple);

            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        });
    }

    /* ----- Mouse parallax on hero glass spheres (throttled) ----- */
    function initParallax() {
        const spheres = document.querySelectorAll('.hero-glass-sphere');
        if (!spheres.length) return;

        let ticking = false;

        document.addEventListener('mousemove', (e) => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const x = (e.clientX / window.innerWidth - 0.5) * 2;
                    const y = (e.clientY / window.innerHeight - 0.5) * 2;

                    spheres.forEach((sphere, index) => {
                        const factor = 15 + index * 10;
                        sphere.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /* ----- Camera background image loading ----- */
    function initBackground() {
        if (!bgCampus) return;
        // Check if campus background image exists
        const img = new Image();
        img.onload = function() {
            bgCampus.style.backgroundImage = 'url(assets/images/campus-bg.jpg)';
            bgCampus.classList.add('loaded');
        };
        img.onerror = function() {
            // Fallback gradient is already set in CSS
            bgCampus.classList.add('fallback');
        };
        img.src = 'assets/images/campus-bg.jpg';
    }

    /* ----- Smooth anchor scrolling ----- */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    /* ----- Keyboard navigation enhancement ----- */
    function initKeyboardNav() {
        const cards = document.querySelectorAll('.portal-card');
        cards.forEach((card) => {
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
    }

    /* ----- Initialize ----- */
    function init() {
        initHeaderScroll();
        initMobileNav();
        initRipple();
        initParallax();
        initBackground();
        initSmoothScroll();
        initKeyboardNav();
        Animations.init();
    }

    return { init };

})();

/* ----- Start on DOM ready ----- */
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
