'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const roleCards = document.querySelectorAll('.role-card');
    const rippleContainer = document.querySelector('.ripple-container');

    if (!roleCards.length) return;

    function createRipple(e, card) {
        if (!rippleContainer) return;
        const rect = card.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        rippleContainer.appendChild(ripple);
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    }

    function selectRole(role, card) {
        try {
            sessionStorage.setItem('selectedStaffRole', role);
        } catch (err) {
            // fallback: sessionStorage may be unavailable
        }

        card.classList.add('selected');
        card.style.transition = 'transform 0.3s var(--ease-spring)';
        card.style.transform = 'scale(0.96)';

        setTimeout(() => {
            card.style.transform = '';
            window.location.href = 'staff-login.html';
        }, 300);
    }

    roleCards.forEach((card) => {
        card.addEventListener('click', (e) => {
            createRipple(e, card);
            const role = card.getAttribute('data-role');
            if (role) {
                selectRole(role, card);
            }
        });

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const role = card.getAttribute('data-role');
                if (role) {
                    selectRole(role, card);
                }
            }
        });
    });

});
