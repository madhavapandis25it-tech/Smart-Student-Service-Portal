'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('staffLoginForm');
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const passwordToggle = document.getElementById('passwordToggle');
    const submitBtn = document.getElementById('submitBtn');
    const btnSpinner = document.getElementById('btnSpinner');
    const authStatusLive = document.getElementById('authStatusLive');

    if (!loginForm) return;

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

    if (passwordToggle && passwordField) {
        passwordToggle.addEventListener('click', () => {
            const isPassword = passwordField.getAttribute('type') === 'password';
            passwordField.setAttribute('type', isPassword ? 'text' : 'password');
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

    function announceLive(message) {
        if (authStatusLive) {
            authStatusLive.textContent = message;
        }
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validateEmail() {
        const value = emailField.value.trim();
        if (!value) {
            showError(emailField, emailError, 'Email address is required.');
            return false;
        }
        if (!isValidEmail(value)) {
            showError(emailField, emailError, 'Please enter a valid email address.');
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

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();

        if (!isEmailValid || !isPasswordValid) {
            if (!isEmailValid) {
                emailField.focus();
            } else if (!isPasswordValid) {
                passwordField.focus();
            }
            return;
        }

        submitBtn.disabled = true;
        if (btnSpinner) btnSpinner.style.display = 'inline-block';
        const btnText = submitBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Authenticating...';
        emailField.disabled = true;
        passwordField.disabled = true;

        announceLive('Authenticating credentials... Please wait.');

        setTimeout(() => {
            announceLive('Authentication successful! Loading Dashboard...');
            setTimeout(() => {
                window.location.href = 'staff-role-selection.html';
            }, 500);
        }, 1500);
    });

});
