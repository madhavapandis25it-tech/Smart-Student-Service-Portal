'use strict';

const FP_INSTITUTIONAL_DOMAIN = '@psnacet.edu.in';
const FP_TOKEN_EXPIRY_MS = 15 * 60 * 1000;
const STORAGE_KEY = 'passwordResetTokens';

document.addEventListener('DOMContentLoaded', () => {

    const step1 = document.getElementById('fpStep1');
    const step2 = document.getElementById('fpStep2');
    const emailForm = document.getElementById('fpEmailForm');
    const fpEmail = document.getElementById('fpEmail');
    const sendBtn = document.getElementById('sendResetLinkBtn');
    const sendSpinner = document.getElementById('sendResetSpinner');
    const resendBtn = document.getElementById('resendLinkBtn');
    const resendSpinner = document.getElementById('resendSpinner');
    const statusLive = document.getElementById('fpStatusLive');

    let currentEmail = '';

    function announce(msg) {
        if (statusLive) statusLive.textContent = msg;
    }

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
        announce('Error: ' + msg);
    }

    function generateResetToken() {
        const array = new Uint8Array(32);
        crypto.getRandomValues(array);
        return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
    }

    function saveToken(email, token) {
        const tokens = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const now = Date.now();
        const emailLower = email.toLowerCase();

        const filtered = tokens.filter(function(t) {
            if (t.email === emailLower && !t.used && t.expiresAt > now) {
                return false;
            }
            return true;
        });

        filtered.push({
            token: token,
            email: emailLower,
            role: 'student',
            createdAt: now,
            expiresAt: now + FP_TOKEN_EXPIRY_MS,
            used: false
        });

        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }

    function sendResetEmail(email) {
        const token = generateResetToken();
        saveToken(email, token);

        const resetLink = window.location.origin.replace(/\/+$/, '') +
            '/reset-password.html?token=' + token;

        console.log('--- SIMULATED EMAIL ---');
        console.log('To:', email);
        console.log('Subject: Password Reset Request');
        console.log('Body:');
        console.log('Dear Student,');
        console.log('');
        console.log('A request has been received to reset your password for the Smart Student Service Portal.');
        console.log('');
        console.log('Click the secure link below to reset your password:');
        console.log(resetLink);
        console.log('');
        console.log('This link is valid for 15 minutes.');
        console.log('');
        console.log('If you did not request this reset, please ignore this email.');
        console.log('');
        console.log('Regards,');
        console.log('Smart Student Service Portal');
        console.log('PSNA College of Engineering and Technology');
        console.log('--- END EMAIL ---');
    }

    function showSuccessView(email) {
        currentEmail = email;
        step1.style.display = 'none';
        step2.style.display = 'block';
        announce('Password reset link sent to ' + email + '. Please check your inbox.');
    }

    function showEmailForm() {
        step2.style.display = 'none';
        step1.style.display = 'block';
        fpEmail.value = '';
        fpEmail.focus();
    }

    function handleSendResetLink(email) {
        clearFieldError(fpEmail);
        sendBtn.disabled = true;
        if (sendSpinner) sendSpinner.style.display = 'inline-block';
        var btnText = sendBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Sending...';
        announce('Sending password reset link to your email...');

        setTimeout(function() {
            sendResetEmail(email);
            showSuccessView(email);
            sendBtn.disabled = false;
            if (sendSpinner) sendSpinner.style.display = 'none';
            if (btnText) btnText.textContent = 'Send Reset Link';
        }, 1500);
    }

    emailForm.addEventListener('submit', function(e) {
        e.preventDefault();

        var val = fpEmail.value.trim();

        if (!val) {
            showFieldError(fpEmail, 'Email is required.');
            fpEmail.focus();
            return;
        }

        var username = val.replace(/@.*$/, '').trim();
        if (!username) {
            showFieldError(fpEmail, 'Please enter a valid username.');
            fpEmail.focus();
            return;
        }

        var email = username + FP_INSTITUTIONAL_DOMAIN;
        fpEmail.value = username;

        handleSendResetLink(email);
    });

    fpEmail.addEventListener('input', function() {
        clearFieldError(fpEmail);
    });

    if (resendBtn) {
        resendBtn.addEventListener('click', function() {
            if (!currentEmail) return;
            resendBtn.disabled = true;
            if (resendSpinner) resendSpinner.style.display = 'inline-block';
            var btnText = resendBtn.querySelector('.btn-text');
            if (btnText) btnText.textContent = 'Resending...';
            announce('Resending password reset link...');

            setTimeout(function() {
                sendResetEmail(currentEmail);
                announce('Password reset link resent to ' + currentEmail + '.');
                resendBtn.disabled = false;
                if (resendSpinner) resendSpinner.style.display = 'none';
                if (btnText) btnText.textContent = 'Resend Link';
            }, 1500);
        });
    }

});
