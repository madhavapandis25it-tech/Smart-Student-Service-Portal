'use strict';

var STORAGE_KEY = 'passwordResetTokens';

document.addEventListener('DOMContentLoaded', function() {

    var form = document.getElementById('rpResetForm');
    var newPassword = document.getElementById('rpNewPassword');
    var confirmPassword = document.getElementById('rpConfirmPassword');
    var strengthFill = document.getElementById('rpStrengthFill');
    var strengthText = document.getElementById('rpStrengthText');
    var submitBtn = document.getElementById('rpSubmitBtn');
    var btnSpinner = document.getElementById('rpSpinner');
    var statusLive = document.getElementById('rpStatusLive');
    var tokenError = document.getElementById('rpTokenError');
    var formView = document.getElementById('rpFormView');
    var successView = document.getElementById('rpSuccessView');
    var errorTitle = document.getElementById('rpErrorTitle');
    var errorMessage = document.getElementById('rpErrorMessage');

    var tokenData = null;

    function announce(msg) {
        if (statusLive) statusLive.textContent = msg;
    }

    function showTokenError(title, msg) {
        if (errorTitle) errorTitle.textContent = title;
        if (errorMessage) errorMessage.textContent = msg;
        if (formView) formView.style.display = 'none';
        if (tokenError) tokenError.style.display = 'block';
        if (successView) successView.style.display = 'none';
        var subtitle = document.getElementById('rpSubtitle');
        if (subtitle) subtitle.textContent = msg;
    }

    function showSuccess() {
        if (formView) formView.style.display = 'none';
        if (tokenError) tokenError.style.display = 'none';
        if (successView) successView.style.display = 'block';
        var title = document.getElementById('rpTitle');
        var welcome = document.getElementById('rpWelcome');
        var subtitle = document.getElementById('rpSubtitle');
        if (title) title.textContent = 'Password Reset';
        if (welcome) welcome.textContent = 'Success';
        if (subtitle) subtitle.textContent = 'Your password has been updated successfully.';
    }

    function getLoginPageForRole(role) {
        switch (role) {
            case 'staff': return 'staff-role-selection.html';
            case 'admin': return 'admin-login.html';
            case 'hod': return 'hod-login.html';
            case 'tutor': return 'tutor-login.html';
            case 'nodal': return 'nodal-officer-login.html';
            case 'os': return 'os-login.html';
            case 'drs': return 'drs-login.html';
            case 'hostel-manager': return 'hostel-manager-login.html';
            default: return 'student-login.html';
        }
    }

    function validateToken() {
        var params = new URLSearchParams(window.location.search);
        var token = params.get('token');

        if (!token) {
            showTokenError('Invalid Reset Link', 'This password reset link is invalid. Please request a new one.');
            return null;
        }

        var tokens = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        var found = null;
        for (var i = 0; i < tokens.length; i++) {
            if (tokens[i].token === token) {
                found = tokens[i];
                break;
            }
        }

        if (!found) {
            showTokenError('Invalid Reset Link', 'This password reset link is invalid. Please request a new one.');
            return null;
        }

        if (found.used) {
            showTokenError('Link Already Used', 'This password reset link has already been used. Please request a new one.');
            return null;
        }

        if (Date.now() > found.expiresAt) {
            showTokenError('Link Expired', 'Your password reset link has expired. Please request a new one.');
            return null;
        }

        return found;
    }

    tokenData = validateToken();

    if (tokenData) {
        var loginPage = getLoginPageForRole(tokenData.role);
        var backLink = document.getElementById('rpBackLink');
        if (backLink) backLink.href = loginPage;
        var goToLogin = document.getElementById('rpGoToLoginBtn');
        if (goToLogin) goToLogin.href = loginPage;
        var sendNewLink = document.getElementById('rpSendNewLinkBtn');
        if (sendNewLink) sendNewLink.href = 'forgot-password.html?role=' + tokenData.role;
    }

    if (!form) return;

    document.querySelectorAll('.auth-eye-toggle').forEach(function(btn) {
        var container = btn.closest('.auth-field');
        if (!container) return;
        var input = container.querySelector('.auth-input');
        if (!input) return;
        btn.addEventListener('click', function() {
            var isPassword = input.getAttribute('type') === 'password';
            input.setAttribute('type', isPassword ? 'text' : 'password');
            var eyeOn = btn.querySelector('.eye-on');
            var eyeOff = btn.querySelector('.eye-off');
            if (eyeOn) eyeOn.style.display = isPassword ? 'block' : 'none';
            if (eyeOff) eyeOff.style.display = isPassword ? 'none' : 'block';
            btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        });
    });

    if (newPassword && strengthFill && strengthText) {
        newPassword.addEventListener('input', function() {
            var val = newPassword.value;
            updateStrength(val);
            updateRequirements(val);
        });
    }

    function updateStrength(val) {
        if (!val) {
            strengthFill.style.width = '0%';
            strengthFill.className = 'password-strength-fill';
            strengthText.textContent = '';
            return;
        }
        var score = 0;
        if (val.length >= 8) score++;
        if (/[A-Z]/.test(val)) score++;
        if (/[a-z]/.test(val)) score++;
        if (/[0-9]/.test(val)) score++;
        if (/[^A-Za-z0-9]/.test(val)) score++;
        if (score <= 1) {
            strengthFill.className = 'password-strength-fill weak';
            strengthText.textContent = 'Weak';
            strengthText.className = 'password-strength-text weak';
        } else if (score === 2) {
            strengthFill.className = 'password-strength-fill medium';
            strengthText.textContent = 'Fair';
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
    }

    function updateRequirements(val) {
        var items = document.querySelectorAll('.rp-req-item');
        if (!items.length) return;
        var checks = {
            length: val.length >= 8,
            upper: /[A-Z]/.test(val),
            lower: /[a-z]/.test(val),
            number: /[0-9]/.test(val),
            special: /[^A-Za-z0-9]/.test(val)
        };
        items.forEach(function(item) {
            var req = item.getAttribute('data-req');
            var icon = item.querySelector('.rp-req-icon');
            if (checks[req]) {
                item.style.color = 'var(--accent-gold)';
                if (icon) icon.innerHTML = '&#9670;';
            } else {
                item.style.color = 'var(--text-secondary)';
                if (icon) icon.innerHTML = '&#9679;';
            }
        });
    }

    function clearError(field) {
        var container = field.closest('.auth-field');
        if (container) {
            container.classList.remove('has-error');
            field.removeAttribute('aria-invalid');
        }
        var errorDiv = container ? container.querySelector('.error-msg') : null;
        if (errorDiv) {
            errorDiv.textContent = '';
            errorDiv.style.display = 'none';
        }
    }

    function showError(field, msg) {
        var container = field.closest('.auth-field');
        if (container) container.classList.add('has-error');
        field.setAttribute('aria-invalid', 'true');
        var errorDiv = container ? container.querySelector('.error-msg') : null;
        if (errorDiv) {
            errorDiv.textContent = msg;
            errorDiv.style.display = 'block';
        }
        announce('Error: ' + msg);
    }

    if (newPassword) {
        newPassword.addEventListener('input', function() { clearError(newPassword); });
    }
    if (confirmPassword) {
        confirmPassword.addEventListener('input', function() { clearError(confirmPassword); });
    }

    function validateNewPassword() {
        var val = newPassword.value;
        if (!val) { showError(newPassword, 'New password is required.'); return false; }
        if (val.length < 8) { showError(newPassword, 'Password must be at least 8 characters.'); return false; }
        if (!/[A-Z]/.test(val)) { showError(newPassword, 'Password must contain an uppercase letter.'); return false; }
        if (!/[a-z]/.test(val)) { showError(newPassword, 'Password must contain a lowercase letter.'); return false; }
        if (!/[0-9]/.test(val)) { showError(newPassword, 'Password must contain a number.'); return false; }
        if (!/[^A-Za-z0-9]/.test(val)) { showError(newPassword, 'Password must contain a special character.'); return false; }
        return true;
    }

    function validateConfirmPassword() {
        if (!confirmPassword.value) { showError(confirmPassword, 'Please confirm your new password.'); return false; }
        if (confirmPassword.value !== newPassword.value) { showError(confirmPassword, 'Passwords do not match.'); return false; }
        return true;
    }

    function markTokenUsed(token) {
        var tokens = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        for (var i = 0; i < tokens.length; i++) {
            if (tokens[i].token === token) {
                tokens[i].used = true;
                break;
            }
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        if (!tokenData) return;

        var validations = [validateNewPassword(), validateConfirmPassword()];

        if (validations.some(function(v) { return !v; })) {
            var firstError = form.querySelector('.has-error');
            if (firstError) {
                var firstInput = firstError.querySelector('input');
                if (firstInput) firstInput.focus();
            }
            return;
        }

        submitBtn.disabled = true;
        if (btnSpinner) btnSpinner.style.display = 'inline-block';
        var btnText = submitBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Resetting Password...';
        if (newPassword) newPassword.disabled = true;
        if (confirmPassword) confirmPassword.disabled = true;

        announce('Resetting your password...');

        setTimeout(function() {
            markTokenUsed(tokenData.token);
            announce('Password reset successful!');
            showSuccess();
        }, 1500);
    });

});
