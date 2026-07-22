/* ============================================
   Smart Student Service Portal
   student-login.js — Auth Logic & Validation
   ============================================ */

'use strict';

const STUDENT_EMAIL_DOMAIN = '@psnacet.edu.in';

// Student registry — maps usernames to full profile data.
// Replace this lookup with a FastAPI/PostgreSQL call when the backend is ready.
const studentRegistry = {
  madhavapandi: {
    name: 'Madhavapandi S', regNo: '21CSE101', rollNo: '21101',
    gender: 'Male', dob: '12-03-2005', bloodGroup: 'O+',
    community: 'BC', nationality: 'Indian', aadhaar: 'XXXX-XXXX-5678',
    degree: 'B.E', department: 'Computer Science & Engineering',
    batch: '2027', admissionYear: '2023', currentYear: '3rd Year',
    semester: '5', section: 'A', academicStatus: 'Studying',
    expectedGradYear: '2027', phone: '+91 98765 43210',
    email: 'madhavapandi@psnacet.edu.in',
    address: '45, Main Road, Madurai', city: 'Madurai',
    state: 'Tamil Nadu', pincode: '625001',
    fatherName: 'P. Subramanian', motherName: 'P. Lakshmi',
    guardianName: 'P. Subramanian', parentPhone: '+91 98765 12345',
    tutorName: 'Dr. R. Anand'
  },
  kaviya: {
    name: 'Kaviya S', regNo: '21CSE045', rollNo: '21045',
    gender: 'Female', dob: '15-06-2004', bloodGroup: 'B+',
    community: 'OC', nationality: 'Indian', aadhaar: 'XXXX-XXXX-1234',
    degree: 'B.E', department: 'Computer Science & Engineering',
    batch: '2027', admissionYear: '2023', currentYear: '3rd Year',
    semester: '5', section: 'A', academicStatus: 'Studying',
    expectedGradYear: '2027', phone: '+91 98765 43210',
    email: 'kaviya.s@psna.ac.in',
    address: '123, Anna Nagar, Dindigul', city: 'Dindigul',
    state: 'Tamil Nadu', pincode: '624001',
    fatherName: 'S. Subramanian', motherName: 'S. Lalitha',
    guardianName: 'S. Subramanian', parentPhone: '+91 98765 12345',
    tutorName: 'Dr. R. Anand'
  },
  arun: {
    name: 'Arun K', regNo: '21IT023', rollNo: '21023',
    gender: 'Male', dob: '22-01-2005', bloodGroup: 'A+',
    community: 'MBC', nationality: 'Indian', aadhaar: 'XXXX-XXXX-9012',
    degree: 'B.Tech', department: 'Information Technology',
    batch: '2027', admissionYear: '2023', currentYear: '3rd Year',
    semester: '5', section: 'B', academicStatus: 'Studying',
    expectedGradYear: '2027', phone: '+91 98765 67890',
    email: 'arun@psnacet.edu.in',
    address: '78, Gandhi Nagar, Trichy', city: 'Trichy',
    state: 'Tamil Nadu', pincode: '620001',
    fatherName: 'K. Murugan', motherName: 'K. Devi',
    guardianName: 'K. Murugan', parentPhone: '+91 98765 54321',
    tutorName: 'Dr. S. Priya'
  },
  priya: {
    name: 'Priya R', regNo: '21EC056', rollNo: '21056',
    gender: 'Female', dob: '08-11-2004', bloodGroup: 'AB+',
    community: 'BC', nationality: 'Indian', aadhaar: 'XXXX-XXXX-3456',
    degree: 'B.E', department: 'Electronics & Communication Engineering',
    batch: '2027', admissionYear: '2023', currentYear: '3rd Year',
    semester: '5', section: 'A', academicStatus: 'Studying',
    expectedGradYear: '2027', phone: '+91 98765 78901',
    email: 'priya@psnacet.edu.in',
    address: '56, New Street, Salem', city: 'Salem',
    state: 'Tamil Nadu', pincode: '636001',
    fatherName: 'R. Rajan', motherName: 'R. Meena',
    guardianName: 'R. Rajan', parentPhone: '+91 98765 23456',
    tutorName: 'Dr. K. Vanishree'
  }
};

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
            showError(emailField, emailError, 'Username is required.');
            return false;
        }
        const clean = value.replace(/@.*$/, '').trim();
        if (!clean) {
            showError(emailField, emailError, 'Please enter a valid username.');
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

        // Transform username to full email
        const usernameRaw = emailField.value.trim();
        const username = usernameRaw.replace(/@.*$/, '').trim();
        emailField.value = username + STUDENT_EMAIL_DOMAIN;

        // Set Loading State
        submitBtn.disabled = true;
        if (btnSpinner) btnSpinner.style.display = 'inline-block';
        const btnText = submitBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Authenticating...';
        emailField.disabled = true;
        passwordField.disabled = true;
        announceLive('Authenticating credentials... Please wait.');

        // Simulated academic database latency delay
        setTimeout(() => {
            // Clear previous session
            ['studentProfile','certificateApps','studentNotifs','profilePhoto'].forEach(k=>localStorage.removeItem(k));

            // Build the authenticated student's profile
            const profile = studentRegistry[username.toLowerCase()];
            const studentProfile = profile ? { ...profile } : {
              name: username.charAt(0).toUpperCase() + username.slice(1),
              regNo: '—', rollNo: '—', gender: '—', dob: '—',
              bloodGroup: '—', community: '—', nationality: 'Indian',
              aadhaar: '—', degree: 'B.E', department: '—',
              batch: '—', admissionYear: '—', currentYear: '—',
              semester: '—', section: '—', academicStatus: '—',
              expectedGradYear: '—', phone: '—',
              email: username + STUDENT_EMAIL_DOMAIN,
              address: '—', city: '—', state: 'Tamil Nadu',
              pincode: '—', fatherName: '—', motherName: '—',
              guardianName: '—', parentPhone: '—', tutorName: '—'
            };

            localStorage.setItem('studentProfile', JSON.stringify(studentProfile));
            announceLive('Authentication successful! Loading Dashboard...');

            // Redirect simulation
            setTimeout(() => {
                window.location.href = 'student-dashboard.html';
            }, 500);

        }, 1500);
    });

});
