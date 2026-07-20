'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const step1 = document.getElementById('fpStep1');
    const step2 = document.getElementById('fpStep2');
    const emailForm = document.getElementById('fpEmailForm');
    const resetForm = document.getElementById('fpResetForm');
    const fpEmail = document.getElementById('fpEmail');
    const sendOtpBtn = document.getElementById('sendOtpBtn');
    const sendOtpSpinner = document.getElementById('sendOtpSpinner');
    const resetPwdBtn = document.getElementById('resetPwdBtn');
    const resetPwdSpinner = document.getElementById('resetPwdSpinner');
    const statusLive = document.getElementById('fpStatusLive');

    const otpInputs = [
        document.getElementById('otp1'),
        document.getElementById('otp2'),
        document.getElementById('otp3'),
        document.getElementById('otp4'),
        document.getElementById('otp5'),
        document.getElementById('otp6')
    ];

    const fpNewPassword = document.getElementById('fpNewPassword');
    const fpConfirmPassword = document.getElementById('fpConfirmPassword');

    let simulatedOtp = '';

    function announce(msg) {
        if (statusLive) statusLive.textContent = msg;
    }

    // --- Eye toggles ---
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

    // --- Clear errors ---
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

    // --- OTP Auto-advance ---
    otpInputs.forEach((input, index) => {
        if (!input) return;

        input.addEventListener('input', () => {
            input.value = input.value.replace(/\D/g, '').slice(0, 1);
            if (input.value) {
                input.classList.add('filled');
                if (index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            } else {
                input.classList.remove('filled');
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });

        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, 6);
            for (let i = 0; i < paste.length && i < otpInputs.length; i++) {
                otpInputs[i].value = paste[i];
                otpInputs[i].classList.add('filled');
            }
            const nextEmpty = otpInputs.findIndex(inp => !inp.value);
            if (nextEmpty >= 0 && nextEmpty < otpInputs.length) {
                otpInputs[nextEmpty].focus();
            } else {
                otpInputs[otpInputs.length - 1].focus();
            }
        });

        input.addEventListener('focus', () => input.select());
    });

    // --- Step 1: Send OTP ---
    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const val = fpEmail.value.trim();
        if (!val) {
            showFieldError(fpEmail, 'Email address is required.');
            fpEmail.focus();
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
            showFieldError(fpEmail, 'Please enter a valid email address.');
            fpEmail.focus();
            return;
        }

        clearFieldError(fpEmail);
        sendOtpBtn.disabled = true;
        if (sendOtpSpinner) sendOtpSpinner.style.display = 'inline-block';
        const sendBtnText = sendOtpBtn.querySelector('.btn-text');
        if (sendBtnText) sendBtnText.textContent = 'Sending...';
        announce('Sending OTP to your email...');

        setTimeout(() => {
            simulatedOtp = String(Math.floor(100000 + Math.random() * 900000));
            announce('OTP sent successfully. Check your email.');

            sendOtpBtn.style.display = 'none';
            step1.style.display = 'none';
            step2.style.display = 'block';

            otpInputs[0].focus();
        }, 1500);
    });

    // --- Step 2: Reset Password ---
    resetForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate OTP
        const otpValue = otpInputs.map(inp => inp.value).join('');
        const otpError = document.getElementById('otpError');

        if (otpValue.length !== 6) {
            if (otpError) {
                otpError.textContent = 'Please enter the complete 6-digit OTP.';
                otpError.style.display = 'block';
            }
            announce('Error: Please enter the complete 6-digit OTP.');
            const firstEmpty = otpInputs.findIndex(inp => !inp.value);
            if (firstEmpty >= 0) otpInputs[firstEmpty].focus();
            return;
        }

        if (otpValue !== simulatedOtp) {
            if (otpError) {
                otpError.textContent = 'Invalid OTP. Please try again.';
                otpError.style.display = 'block';
            }
            announce('Error: Invalid OTP.');
            otpInputs[0].focus();
            return;
        }

        if (otpError) {
            otpError.textContent = '';
            otpError.style.display = 'none';
        }

        // Validate passwords
        const pwd = fpNewPassword.value;
        if (!pwd) { showFieldError(fpNewPassword, 'Password is required.'); fpNewPassword.focus(); return; }
        if (pwd.length < 6) { showFieldError(fpNewPassword, 'Minimum 6 characters.'); fpNewPassword.focus(); return; }
        clearFieldError(fpNewPassword);

        if (!fpConfirmPassword.value) { showFieldError(fpConfirmPassword, 'Please confirm your password.'); fpConfirmPassword.focus(); return; }
        if (fpConfirmPassword.value !== pwd) { showFieldError(fpConfirmPassword, 'Passwords do not match.'); fpConfirmPassword.focus(); return; }
        clearFieldError(fpConfirmPassword);

        // Submit
        resetPwdBtn.disabled = true;
        if (resetPwdSpinner) resetPwdSpinner.style.display = 'inline-block';
        const resetBtnText = resetPwdBtn.querySelector('.btn-text');
        if (resetBtnText) resetBtnText.textContent = 'Resetting...';
        fpNewPassword.disabled = true;
        fpConfirmPassword.disabled = true;
        otpInputs.forEach(inp => inp.disabled = true);

        announce('Resetting your password...');

        setTimeout(() => {
            const role = sessionStorage.getItem('fpRole') || 'student';
            const loginPage = role === 'staff' ? 'staff-role-selection.html' : 'student-login.html';
            announce('Password reset successfully! Redirecting to login...');
            setTimeout(() => {
                window.location.href = loginPage;
            }, 1000);
        }, 1500);
    });

    // Clear OTP error on input
    otpInputs.forEach(inp => {
        inp.addEventListener('input', () => {
            const otpError = document.getElementById('otpError');
            if (otpError) {
                otpError.textContent = '';
                otpError.style.display = 'none';
            }
        });
    });

});
