'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('rpResetForm');
    if (!form) return;

    const newPassword = document.getElementById('rpNewPassword');
    const confirmPassword = document.getElementById('rpConfirmPassword');
    const strengthFill = document.getElementById('rpStrengthFill');
    const strengthText = document.getElementById('rpStrengthText');
    const submitBtn = document.getElementById('rpSubmitBtn');
    const btnSpinner = document.getElementById('rpSpinner');
    const statusLive = document.getElementById('rpStatusLive');

    function announce(msg) {
        if (statusLive) statusLive.textContent = msg;
    }

    document.querySelectorAll('.auth-eye-toggle').forEach((btn) => {
        const container = btn.closest('.auth-field');
        if (!container) return;
        const input = container.querySelector('.auth-input');
        if (!input) return;
        btn.addEventListener('click', () => {
            const isPassword = input.getAttribute('type') === 'password';
            input.setAttribute('type', isPassword ? 'text' : 'password');
            const eyeOn = btn.querySelector('.eye-on');
            const eyeOff = btn.querySelector('.eye-off');
            if (eyeOn) eyeOn.style.display = isPassword ? 'block' : 'none';
            if (eyeOff) eyeOff.style.display = isPassword ? 'none' : 'block';
            btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        });
    });

    if (newPassword && strengthFill && strengthText) {
        newPassword.addEventListener('input', () => {
            const val = newPassword.value;
            if (!val) {
                strengthFill.style.width = '0%';
                strengthFill.className = 'password-strength-fill';
                strengthText.textContent = '';
                return;
            }
            let score = 0;
            if (val.length >= 6) score++;
            if (val.length >= 10) score++;
            if (/[A-Z]/.test(val)) score++;
            if (/[0-9]/.test(val)) score++;
            if (/[^A-Za-z0-9]/.test(val)) score++;
            if (score <= 1) {
                strengthFill.className = 'password-strength-fill weak';
                strengthText.textContent = 'Weak';
                strengthText.className = 'password-strength-text weak';
            } else if (score === 2) {
                strengthFill.className = 'password-strength-fill medium';
                strengthText.textContent = 'Medium';
                strengthText.className = 'password-strength-text medium';
            } else if (score <= 4) {
                strengthFill.className = 'password-strength-fill strong';
                strengthText.textContent = 'Strong';
                strengthText.className = 'password-strength-text strong';
            } else {
                strengthFill.className = 'password-strength-fill very-strong';
                strengthText.textContent = 'Very Strong';
                strengthText.className = 'password-strength-text very-strong';
            }
        });
    }

    function clearError(field) {
        const container = field.closest('.auth-field');
        if (container) {
            container.classList.remove('has-error');
            field.removeAttribute('aria-invalid');
        }
        const errorDiv = container ? container.querySelector('.error-msg') : null;
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
        }
    }

    function showError(field, msg) {
        const container = field.closest('.auth-field');
        if (container) container.classList.add('has-error');
        field.setAttribute('aria-invalid', 'true');
        const errorDiv = container ? container.querySelector('.error-msg') : null;
        if (errorDiv) {
            errorDiv.textContent = msg;
            errorDiv.style.display = 'block';
        }
        announce(`Error: ${msg}`);
    }

    if (newPassword) {
        newPassword.addEventListener('input', () => clearError(newPassword));
    }
    if (confirmPassword) {
        confirmPassword.addEventListener('input', () => clearError(confirmPassword));
    }

    function validateNewPassword() {
        const val = newPassword.value;
        if (!val) { showError(newPassword, 'New password is required.'); return false; }
        if (val.length < 6) { showError(newPassword, 'Password must be at least 6 characters.'); return false; }
        return true;
    }

    function validateConfirmPassword() {
        if (!confirmPassword.value) { showError(confirmPassword, 'Please confirm your new password.'); return false; }
        if (confirmPassword.value !== newPassword.value) { showError(confirmPassword, 'Passwords do not match.'); return false; }
        return true;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const validations = [validateNewPassword(), validateConfirmPassword()];

        if (validations.some(v => !v)) {
            const firstError = form.querySelector('.has-error');
            if (firstError) {
                const firstInput = firstError.querySelector('input');
                if (firstInput) firstInput.focus();
            }
            return;
        }

        submitBtn.disabled = true;
        if (btnSpinner) btnSpinner.style.display = 'inline-block';
        const btnText = submitBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Resetting Password...';
        if (newPassword) newPassword.disabled = true;
        if (confirmPassword) confirmPassword.disabled = true;

        announce('Resetting your password...');

        setTimeout(() => {
            announce('Password reset successful! Redirecting to login...');
            setTimeout(() => {
                window.location.href = 'student-login.html';
            }, 500);
        }, 1500);
    });

});
