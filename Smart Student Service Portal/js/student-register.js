'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('studentRegisterForm');
    if (!form) return;

    const regNumber = document.getElementById('regNumber');
    const rollNumber = document.getElementById('rollNumber');
    const fullName = document.getElementById('fullName');
    const batch = document.getElementById('batch');
    const year = document.getElementById('year');
    const section = document.getElementById('section');
    const department = document.getElementById('department');
    const quota = document.getElementById('quota');
    const gender = document.getElementById('gender');
    const dob = document.getElementById('dob');
    const tutorName = document.getElementById('tutorName');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const terms = document.getElementById('terms');
    const submitBtn = document.getElementById('submitBtn');
    const btnSpinner = document.getElementById('btnSpinner');
    const statusLive = document.getElementById('regStatusLive');

    const strengthFill = document.getElementById('passwordStrengthFill');
    const strengthText = document.getElementById('passwordStrengthText');

    const allFields = [
        regNumber, rollNumber, fullName, batch, year, section,
        department, quota, gender, dob, tutorName, email,
        password, confirmPassword
    ];

    function announce(msg) {
        if (statusLive) statusLive.textContent = msg;
    }

    // Roll number: auto uppercase
    if (rollNumber) {
        rollNumber.addEventListener('input', () => {
            rollNumber.value = rollNumber.value.toUpperCase();
        });
    }

    // Registration number: numbers only
    if (regNumber) {
        regNumber.addEventListener('input', () => {
            regNumber.value = regNumber.value.replace(/\D/g, '').slice(0, 16);
        });
    }

    // Password strength
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

    // Eye toggles
    document.querySelectorAll('.auth-eye-toggle').forEach((btn) => {
        const input = btn.closest('.auth-field').querySelector('.auth-input');
        if (!input) return;
        btn.addEventListener('click', () => {
            const isPassword = input.getAttribute('type') === 'password';
            input.setAttribute('type', isPassword ? 'text' : 'password');
            btn.querySelector('.eye-on').style.display = isPassword ? 'block' : 'none';
            btn.querySelector('.eye-off').style.display = isPassword ? 'none' : 'block';
            btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        });
    });

    // Clear errors on input
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
        if (container) {
            container.classList.add('has-error');
        }
        field.setAttribute('aria-invalid', 'true');
        const errorDiv = container ? container.querySelector('.error-msg') : null;
        if (errorDiv) {
            errorDiv.textContent = msg;
            errorDiv.style.display = 'block';
        }
        announce(`Error: ${msg}`);
    }

    // Validate individual fields
    function validateRegNumber() {
        const val = regNumber.value.trim();
        if (!val) { showFieldError(regNumber, 'Registration number is required.'); return false; }
        if (!/^\d{16}$/.test(val)) { showFieldError(regNumber, 'Must contain exactly 16 digits.'); return false; }
        return true;
    }

    function validateRollNumber() {
        const val = rollNumber.value.trim();
        if (!val) { showFieldError(rollNumber, 'Roll number is required.'); return false; }
        if (val.length < 5 || val.length > 10) { showFieldError(rollNumber, 'Invalid roll number format.'); return false; }
        return true;
    }

    function validateFullName() {
        const val = fullName.value.trim();
        if (!val) { showFieldError(fullName, 'Full name is required.'); return false; }
        if (val.length < 2) { showFieldError(fullName, 'Please enter a valid name.'); return false; }
        return true;
    }

    function validateSelect(field, label) {
        if (!field.value) { showFieldError(field, `${label} is required.`); return false; }
        return true;
    }

    function validateDOB() {
        if (!dob.value) { showFieldError(dob, 'Date of birth is required.'); return false; }
        return true;
    }

    function validateTutorName() {
        const val = tutorName.value.trim();
        if (!val) { showFieldError(tutorName, 'Tutor name is required.'); return false; }
        return true;
    }

    function validateEmail() {
        const val = email.value.trim();
        if (!val) { showFieldError(email, 'Email address is required.'); return false; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { showFieldError(email, 'Please enter a valid email address.'); return false; }
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

    // Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const validations = [
            validateRegNumber(),
            validateRollNumber(),
            validateFullName(),
            validateSelect(batch, 'Batch'),
            validateSelect(year, 'Year'),
            validateSelect(section, 'Section'),
            validateSelect(department, 'Department'),
            validateSelect(quota, 'Quota'),
            validateSelect(gender, 'Gender'),
            validateDOB(),
            validateTutorName(),
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

        submitBtn.disabled = true;
        btnSpinner.style.display = 'inline-block';
        submitBtn.querySelector('.btn-text').textContent = 'Creating Account...';
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
