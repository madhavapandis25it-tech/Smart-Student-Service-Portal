/* ============================================
   Smart Student Service Portal
   animations.js — Animation Controllers
   ============================================ */

'use strict';

const Animations = (() => {

    /* ----- Scroll Reveal ----- */
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal, .stagger-item');

        if (!revealElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach((el) => observer.observe(el));
    }

    /* ----- Background Sparkles ----- */
    function createSparkles(count) {
        const container = document.querySelector('.bg-sparkle-container');
        if (!container) return;

        for (let i = 0; i < count; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'bg-sparkle';
            sparkle.setAttribute('aria-hidden', 'true');
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.width = (2 + Math.random() * 3) + 'px';
            sparkle.style.height = sparkle.style.width;
            sparkle.style.animation = `sparkle ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 5}s infinite`;
            container.appendChild(sparkle);
        }
    }

    /* ----- Animate hero on scroll (parallax opacity) ----- */
    function initHeroParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        const heroContent = hero.querySelector('.hero-content');
        if (!heroContent) return;

        let ticking = false;
        heroContent.style.willChange = 'transform, opacity';

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const heroHeight = hero.offsetHeight;

                    if (scrollY < heroHeight) {
                        const progress = scrollY / heroHeight;
                        heroContent.style.opacity = 1 - progress * 0.5;
                        heroContent.style.transform = `translateY(${scrollY * 0.2}px)`;
                    }
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /* ----- Animate feature cards stagger on scroll ----- */
    function initFeaturesReveal() {
        const cards = document.querySelectorAll('.feature-card');
        cards.forEach((card, index) => {
            card.classList.add('reveal');
            card.style.transitionDelay = (0.1 + index * 0.1) + 's';
        });
    }

    /* ----- Animate portal cards stagger on load (handled by .page-load CSS) ----- */
    function initPortalsReveal() {
        // Portal cards are animated via .page-load CSS; no reveal class needed
    }

    /* ----- Public API ----- */
    function init() {
        createSparkles(20);
        initScrollReveal();
        initHeroParallax();
        initFeaturesReveal();
        initPortalsReveal();
    }

    return { init };

})();
