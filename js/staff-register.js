'use strict';

const STAFF_REG_EMAIL_DOMAIN = '@psnacet.edu.in';

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('staffRegisterForm');
    if (!form) return;

    const fullName = document.getElementById('fullName');
    const employeeId = document.getElementById('employeeId');
    const department = document.getElementById('department');
    const designation = document.getElementById('designation');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const terms = document.getElementById('terms');
    const submitBtn = document.getElementById('submitBtn');
    const btnSpinner = document.getElementById('btnSpinner');
    const statusLive = document.getElementById('regStatusLive');

    const strengthFill = document.getElementById('passwordStrengthFill');
    const strengthText = document.getElementById('passwordStrengthText');

    const allFields = [fullName, employeeId, department, designation, email, password, confirmPassword];

    function announce(msg) {
        if (statusLive) statusLive.textContent = msg;
    }

    if (employeeId) {
        employeeId.addEventListener('input', () => {
            employeeId.value = employeeId.value.toUpperCase().replace(/\s/g, '');
        });
    }

    if (password && strengthFill && strengthText) {
        password.addEventListener('input', () => {
            const val = password.value;
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

    allFields.forEach((field) => {
        if (!field) return;
        field.addEventListener('input', () => clearFieldError(field));
        field.addEventListener('change', () => clearFieldError(field));
    });

    function clearFieldError(field) {
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

    function showFieldError(field, msg) {
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

    function validateFullName() {
        const val = fullName.value.trim();
        if (!val) { showFieldError(fullName, 'Full name is required.'); return false; }
        if (val.length < 2) { showFieldError(fullName, 'Please enter a valid name.'); return false; }
        return true;
    }

    function validateEmployeeId() {
        const val = employeeId.value.trim();
        if (!val) { showFieldError(employeeId, 'Employee ID is required.'); return false; }
        if (val.length < 3) { showFieldError(employeeId, 'Please enter a valid Employee ID.'); return false; }
        return true;
    }

    function validateSelect(field, label) {
        if (!field.value) { showFieldError(field, `${label} is required.`); return false; }
        return true;
    }

    function validateEmail() {
        const val = email.value.trim();
        if (!val) { showFieldError(email, 'Username is required.'); return false; }
        const clean = val.replace(/@.*$/, '').trim();
        if (!clean) { showFieldError(email, 'Please enter a valid username.'); return false; }
        return true;
    }

    function validatePassword() {
        const val = password.value;
        if (!val) { showFieldError(password, 'Password is required.'); return false; }
        if (val.length < 6) { showFieldError(password, 'Password must be at least 6 characters.'); return false; }
        return true;
    }

    function validateConfirmPassword() {
        if (!confirmPassword.value) { showFieldError(confirmPassword, 'Please confirm your password.'); return false; }
        if (confirmPassword.value !== password.value) { showFieldError(confirmPassword, 'Passwords do not match.'); return false; }
        return true;
    }

    function validateTerms() {
        const container = terms.closest('.auth-field');
        const errorDiv = container ? container.querySelector('.error-msg') : null;
        if (!terms.checked) {
            if (container) container.classList.add('has-error');
            if (errorDiv) {
                errorDiv.textContent = 'You must agree to the Terms & Conditions.';
                errorDiv.style.display = 'block';
            }
            announce('Error: You must agree to the Terms & Conditions.');
            return false;
        }
        if (container) container.classList.remove('has-error');
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
        }
        return true;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const validations = [
            validateFullName(),
            validateEmployeeId(),
            validateSelect(department, 'Department'),
            validateSelect(designation, 'Designation'),
            validateEmail(),
            validatePassword(),
            validateConfirmPassword(),
            validateTerms()
        ];

        if (validations.some(v => !v)) {
            const firstError = form.querySelector('.has-error');
            if (firstError) {
                const firstInput = firstError.querySelector('input, select');
                if (firstInput) firstInput.focus();
            }
            return;
        }

        const usernameRaw = email.value.trim();
        const username = usernameRaw.replace(/@.*$/, '').trim();
        email.value = username + STAFF_REG_EMAIL_DOMAIN;

        submitBtn.disabled = true;
        if (btnSpinner) btnSpinner.style.display = 'inline-block';
        const btnText = submitBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Creating Account...';
        allFields.forEach(f => { if (f) f.disabled = true; });

        announce('Creating your account...');

        setTimeout(() => {
            announce('Account created successfully! Redirecting...');
            setTimeout(() => {
                window.location.href = 'registration-success.html';
            }, 500);
        }, 1500);
    });

});
