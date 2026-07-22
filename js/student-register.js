'use strict';

const TUTORS_BY_DEPT = {
    'Computer Science and Engineering': ['Dr. Arunkumar', 'Mrs. Deepa', 'Mr. Sathish', 'Dr. Revathi'],
    'Information Technology': ['Dr. Kumar', 'Mrs. Priya', 'Mr. Rajesh', 'Dr. Meena'],
    'Bio Medical Engineering': ['Dr. Anitha', 'Mr. Dinesh', 'Mrs. Lavanya'],
    'Computer Science and Business Systems': ['Dr. Jayashree', 'Mr. Karthik', 'Mrs. Nandhini'],
    'Artificial Intelligence and Data Science': ['Dr. Senthil', 'Mrs. Uma', 'Mr. Praveen'],
    'CSE (Cyber Security)': ['Dr. Raghavan', 'Mr. Arun', 'Mrs. Swathi'],
    'CSE (Artificial Intelligence and Machine Learning)': ['Dr. Kavitha', 'Mr. Vinoth', 'Mrs. Anandhi'],
    'Electronics Engineering (VLSI Design and Technology)': ['Dr. Gowri', 'Mr. Manikandan', 'Mrs. Shanthi'],
    'Business Administration (MBA)': ['Dr. Balaji', 'Mr. Muthu', 'Mrs. Selvi'],
    'Computer Applications (MCA)': ['Dr. Ramesh', 'Mrs. Padma', 'Mr. Prakash'],
    'Science and Humanities': ['Dr. Vasanthi', 'Mr. Ganesan', 'Mrs. Lalitha', 'Dr. Murugan'],
    'Civil Engineering': ['Dr. Sekar', 'Mr. Ravi', 'Mrs. Geetha'],
    'Mechanical Engineering': ['Dr. Venkatesh', 'Mr. Saravanan', 'Mrs. Dhanalakshmi'],
    'Electronics and Communication Engineering': ['Dr. Sharmila', 'Mr. Karthikeyan', 'Mrs. Nirmala', 'Dr. Prabhu'],
    'Electrical and Electronics Engineering': ['Dr. Maheshwari', 'Mr. Jegan', 'Mrs. Abinaya']
};

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
    dob.addEventListener('keydown', (e) => e.preventDefault());
    const tutorName = document.getElementById('tutorName');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    const terms = document.getElementById('terms');
    const submitBtn = document.getElementById('submitBtn');
    const btnSpinner = document.getElementById('btnSpinner');
    const statusLive = document.getElementById('regStatusLive');

    const previewSection = document.getElementById('registrationPreview');
    const previewDetails = document.getElementById('previewDetails');
    const previewEditBtn = document.getElementById('previewEditBtn');
    const previewConfirmBtn = document.getElementById('previewConfirmBtn');
    const confirmSpinner = document.getElementById('confirmSpinner');

    const strengthFill = document.getElementById('passwordStrengthFill');
    const strengthText = document.getElementById('passwordStrengthText');

    const allFields = [
        regNumber, rollNumber, fullName, batch, year, section,
        department, quota, gender, dob, tutorName, email,
        password, confirmPassword
    ];

    const EMAIL_DOMAIN = '@psnacet.edu.in';

    function announce(msg) {
        if (statusLive) statusLive.textContent = msg;
    }

    function getFullEmail() {
        const username = email.value.trim();
        if (!username) return '';
        const clean = username.replace(/@.*$/, '').trim();
        return clean + EMAIL_DOMAIN;
    }

    // Roll number: digits only, max 3
    if (rollNumber) {
        rollNumber.addEventListener('input', () => {
            rollNumber.value = rollNumber.value.replace(/\D/g, '').slice(0, 3);
        });
    }

    // Registration number: numbers only, no length limit
    if (regNumber) {
        regNumber.addEventListener('input', () => {
            regNumber.value = regNumber.value.replace(/\D/g, '');
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

    // Tutor dropdown: update when department changes
    if (department && tutorName) {
        department.addEventListener('change', () => {
            const dept = department.value;
            tutorName.innerHTML = '';
            if (!dept) {
                const opt = document.createElement('option');
                opt.value = '';
                opt.disabled = true;
                opt.selected = true;
                opt.textContent = 'Select Department First';
                tutorName.appendChild(opt);
                tutorName.disabled = true;
            } else {
                const placeholder = document.createElement('option');
                placeholder.value = '';
                placeholder.disabled = true;
                placeholder.selected = true;
                placeholder.textContent = 'Select your tutor';
                tutorName.appendChild(placeholder);
                const tutors = TUTORS_BY_DEPT[dept] || [];
                tutors.forEach(t => {
                    const opt = document.createElement('option');
                    opt.value = t;
                    opt.textContent = t;
                    tutorName.appendChild(opt);
                });
                tutorName.disabled = false;
            }
            clearFieldError(tutorName);
        });
    }

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
        if (!/^\d+$/.test(val)) { showFieldError(regNumber, 'Must contain only digits.'); return false; }
        return true;
    }

    function validateRollNumber() {
        const val = rollNumber.value.trim();
        if (!val) { showFieldError(rollNumber, 'Roll number is required.'); return false; }
        if (!/^\d{1,3}$/.test(val)) { showFieldError(rollNumber, 'Must contain 1 to 3 digits.'); return false; }
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

        const parts = dob.value.split('-');
        if (parts.length !== 3) { showFieldError(dob, 'Please enter a valid date.'); return false; }

        const yearStr = parts[0];
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        const year = parseInt(yearStr, 10);

        if (yearStr.length !== 4 || isNaN(year) || year < 1) { showFieldError(dob, 'Year must be exactly 4 digits.'); return false; }

        if (isNaN(month) || month < 1 || month > 12) { showFieldError(dob, 'Please enter a valid date.'); return false; }

        const maxDay = new Date(year, month, 0).getDate();
        if (isNaN(day) || day < 1 || day > maxDay) { showFieldError(dob, 'Please enter a valid date.'); return false; }

        const today = new Date();
        today.setHours(23, 59, 59, 999);
        if (new Date(dob.value + 'T00:00:00') > today) { showFieldError(dob, 'Date of birth cannot be in the future.'); return false; }

        if (year < 1995 || year > 2010) { showFieldError(dob, 'Please enter a valid date of birth (1995–2010).'); return false; }

        return true;
    }

    function validateTutorName() {
        if (!tutorName.value) { showFieldError(tutorName, 'Please select a tutor.'); return false; }
        return true;
    }

    function validateEmail_() {
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

    function getFormData() {
        return {
            regNo: regNumber.value.trim(),
            rollNo: rollNumber.value.trim(),
            name: fullName.value.trim(),
            batch: batch.value,
            year: year.value,
            section: section.value,
            department: department.value,
            quota: quota.value,
            gender: gender.value,
            dob: dob.value,
            tutor: tutorName.value,
            email: getFullEmail()
        };
    }

    function renderPreview(data) {
        const fields = [
            { label: 'Registration Number', value: data.regNo },
            { label: 'Roll Number', value: data.rollNo },
            { label: 'Full Name', value: data.name },
            { label: 'Batch', value: data.batch },
            { label: 'Year', value: data.year },
            { label: 'Section', value: data.section },
            { label: 'Department', value: data.department },
            { label: 'Quota', value: data.quota },
            { label: 'Gender', value: data.gender },
            { label: 'Date of Birth', value: data.dob },
            { label: 'Tutor', value: data.tutor },
            { label: 'Email', value: data.email }
        ];
        previewDetails.innerHTML = fields.map(f =>
            `<div class="preview-item${f.label === 'Full Name' || f.label === 'Department' ? ' preview-item-full' : ''}">
                <span class="preview-item-label">${f.label}</span>
                <span class="preview-item-value">${f.value}</span>
            </div>`
        ).join('');
    }

    // Show preview
    function showPreview() {
        const data = getFormData();
        renderPreview(data);
        form.style.display = 'none';
        previewSection.style.display = 'block';
        submitBtn.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Back to form with values preserved
    function backToForm() {
        previewSection.style.display = 'none';
        form.style.display = '';
        submitBtn.style.display = '';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Final submission
    function submitRegistration() {
        submitBtn.disabled = true;
        if (confirmSpinner) confirmSpinner.style.display = 'inline-block';
        const confirmText = previewConfirmBtn.querySelector('.btn-text');
        if (confirmText) confirmText.textContent = 'Creating Account...';
        previewEditBtn.disabled = true;
        previewConfirmBtn.disabled = true;

        announce('Creating your account...');

        const data = getFormData();

        setTimeout(() => {
            const profileData = {
                name: data.name,
                regNo: data.regNo,
                rollNo: data.rollNo,
                gender: data.gender,
                dob: data.dob,
                batch: data.batch,
                currentYear: data.year,
                semester: '1',
                section: data.section,
                department: data.department,
                tutorName: data.tutor,
                email: data.email,
                initials: data.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
            };
            const existing = JSON.parse(localStorage.getItem('studentProfile')) || {};
            const merged = { ...existing, ...profileData };
            localStorage.setItem('studentProfile', JSON.stringify(merged));

            announce('Account created successfully! Redirecting...');
            setTimeout(() => {
                window.location.href = 'registration-success.html';
            }, 500);
        }, 1500);
    }

    // Edit button: back to form
    if (previewEditBtn) {
        previewEditBtn.addEventListener('click', backToForm);
    }

    // Confirm button: finalize
    if (previewConfirmBtn) {
        previewConfirmBtn.addEventListener('click', submitRegistration);
    }

    // Submit: first show preview
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
            validateEmail_(),
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

        showPreview();
    });

});
