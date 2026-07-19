'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('superAdminLoginForm');
    const adminIdField = document.getElementById('adminId');
    const passwordField = document.getElementById('password');
    const adminIdError = document.getElementById('adminIdError');
    const passwordError = document.getElementById('passwordError');
    const passwordToggle = document.getElementById('passwordToggle');
    const submitBtn = document.getElementById('submitBtn');
    const btnSpinner = document.getElementById('btnSpinner');
    const authStatusLive = document.getElementById('authStatusLive');

    if (!loginForm) return;

    [adminIdField, passwordField].filter(Boolean).forEach((input) => {
        input.addEventListener('input', () => {
            const container = input.closest('.auth-field');
            if (container) {
                container.classList.remove('has-error');
                input.removeAttribute('aria-invalid');
            }
            const errorDiv = input.id === 'adminId' ? adminIdError : passwordError;
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

    function validateAdminId() {
        const value = adminIdField.value.trim();
        if (!value) {
            showError(adminIdField, adminIdError, 'Administrator ID or email is required.');
            return false;
        }
        if (value.length < 3) {
            showError(adminIdField, adminIdError, 'Please enter a valid administrator ID or email.');
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

        const isAdminIdValid = validateAdminId();
        const isPasswordValid = validatePassword();

        if (!isAdminIdValid || !isPasswordValid) {
            if (!isAdminIdValid) {
                adminIdField.focus();
            } else if (!isPasswordValid) {
                passwordField.focus();
            }
            return;
        }

        submitBtn.disabled = true;
        if (btnSpinner) btnSpinner.style.display = 'inline-block';
        const btnText = submitBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Authenticating...';
        adminIdField.disabled = true;
        passwordField.disabled = true;

        announceLive('Authenticating credentials... Please wait.');

        setTimeout(() => {
            sessionStorage.setItem('adminAuthenticated', 'true');
                announceLive('Authentication successful! Loading management console...');
            setTimeout(() => {
                window.location.href = 'admin-dashboard.html';
            }, 500);
        }, 1500);
    });

});
