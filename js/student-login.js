/* ============================================
   Smart Student Service Portal
   student-login.js — Auth Logic & Validation
   ============================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

    // DOM Targets
    const loginForm = document.getElementById('studentLoginForm');
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const passwordToggle = document.getElementById('passwordToggle');
    const submitBtn = document.getElementById('submitBtn');
    const btnSpinner = document.getElementById('btnSpinner');
    const authStatusLive = document.getElementById('authStatusLive');
    const googleBtn = document.getElementById('googleBtn');

    if (!loginForm) return;

    // Reset error structures on focus/type
    [emailField, passwordField].filter(Boolean).forEach((input) => {
        input.addEventListener('input', () => {
            const container = input.closest('.auth-field');
            if (container) {
                container.classList.remove('has-error');
                input.removeAttribute('aria-invalid');
            }
            const errorDiv = input.id === 'email' ? emailError : passwordError;
            if (errorDiv) {
                errorDiv.textContent = '';
                errorDiv.style.display = 'none';
            }
        });
    });

    // Password Visibility Toggle Logic
    if (passwordToggle && passwordField) {
        passwordToggle.addEventListener('click', () => {
            const isPassword = passwordField.getAttribute('type') === 'password';

            // Toggle type attribute
            passwordField.setAttribute('type', isPassword ? 'text' : 'password');

            // Toggle eye icon class states
            const eyeOnIcon = passwordToggle.querySelector('.eye-on');
            const eyeOffIcon = passwordToggle.querySelector('.eye-off');

            if (isPassword) {
                if (eyeOnIcon) eyeOnIcon.style.display = 'block';
                if (eyeOffIcon) eyeOffIcon.style.display = 'none';
                passwordToggle.setAttribute('aria-label', 'Hide password');
                announceLive('Password visible');
            } else {
                if (eyeOnIcon) eyeOnIcon.style.display = 'none';
                if (eyeOffIcon) eyeOffIcon.style.display = 'block';
                passwordToggle.setAttribute('aria-label', 'Show password');
                announceLive('Password hidden');
            }
        });
    }

    // Helper to speak feedback to assistive screens
    function announceLive(message) {
        if (authStatusLive) {
            authStatusLive.textContent = message;
        }
    }

    // Email address check pattern (standard enterprise regex validation)
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Individual Input validation
    function validateEmail() {
        const value = emailField.value.trim();
        if (!value) {
            showError(emailField, emailError, 'Email address is required.');
            return false;
        }
        if (!isValidEmail(value)) {
            showError(emailField, emailError, 'Please enter a valid academic email address.');
            return false;
        }
        return true;
    }

    function validatePassword() {
        const value = passwordField.value;
        if (!value) {
            showError(passwordField, passwordError, 'Password is required.');
            return false;
        }
        if (value.length < 6) {
            showError(passwordField, passwordError, 'Password must be at least 6 characters long.');
            return false;
        }
        return true;
    }

    // Render error settings
    function showError(input, errorElement, msg) {
        const container = input.closest('.auth-field');
        if (container) {
            container.classList.add('has-error');
        }
        input.setAttribute('aria-invalid', 'true');
        if (errorElement) {
            errorElement.textContent = msg;
            errorElement.style.display = 'block';
        }
        announceLive(`Error: ${msg}`);
    }

    // Google Button Click Simulated State
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            announceLive('Google login requested. Connecting to external service...');
            googleBtn.disabled = true;
            setTimeout(() => {
                announceLive('Google authentication simulation complete.');
                googleBtn.disabled = false;
            }, 1000);
        });
    }

    // Form submit controller
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Final sanity validations
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();

        if (!isEmailValid || !isPasswordValid) {
            // Refocus first structural error for accessibility
            if (!isEmailValid) {
                emailField.focus();
            } else if (!isPasswordValid) {
                passwordField.focus();
            }
            return;
        }

        // Set Loading State
        submitBtn.disabled = true;
        if (btnSpinner) btnSpinner.style.display = 'inline-block';
        const btnText = submitBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Authenticating...';
        emailField.disabled = true;
        passwordField.disabled = true;
        if (googleBtn) googleBtn.disabled = true;

        announceLive('Authenticating credentials... Please wait.');

        // Simulated academic database latency delay
        setTimeout(() => {
            announceLive('Authentication successful! Loading Dashboard...');

            // Redirect simulation
            setTimeout(() => {
                window.location.href = 'student-dashboard.html';
            }, 500);

        }, 1500);
    });

});
