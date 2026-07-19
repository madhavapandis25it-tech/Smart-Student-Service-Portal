'use strict';

document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('otpVerifyForm');
    if (!form) return;

    const otpInputs = document.querySelectorAll('.otp-input');
    const otpError = document.getElementById('otpError');
    const submitBtn = document.getElementById('otpVerifyBtn');
    const btnSpinner = document.getElementById('otpSpinner');
    const resendLink = document.getElementById('otpResendLink');
    const statusLive = document.getElementById('otpStatusLive');

    function announce(msg) {
        if (statusLive) statusLive.textContent = msg;
    }

    function showError(msg) {
        if (otpError) {
            otpError.textContent = msg;
            otpError.style.display = 'block';
        }
        announce(`Error: ${msg}`);
    }

    function clearErrors() {
        if (otpError) {
            otpError.textContent = '';
            otpError.style.display = 'none';
        }
    }

    function getOTP() {
        let code = '';
        otpInputs.forEach((input) => {
            if (input) code += input.value;
        });
        return code;
    }

    function focusFirstEmpty(index) {
        for (let i = 0; i < otpInputs.length; i++) {
            if (!otpInputs[i].value) {
                otpInputs[i].focus();
                return;
            }
        }
    }

    otpInputs.forEach((input, index) => {
        if (!input) return;

        input.addEventListener('input', () => {
            clearErrors();
            input.value = input.value.replace(/\D/g, '').slice(0, 1);
            if (input.value && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && index > 0) {
                otpInputs[index - 1].focus();
            }
            if (e.key === 'ArrowLeft' && index > 0) {
                otpInputs[index - 1].focus();
            }
            if (e.key === 'ArrowRight' && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener('focus', () => {
            input.select();
        });
    });

    otpInputs.forEach((input) => {
        if (!input) return;
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '').slice(0, otpInputs.length);
            clearErrors();
            otpInputs.forEach((inp, i) => {
                if (inp && paste[i]) {
                    inp.value = paste[i];
                }
            });
            const firstEmpty = Array.from(otpInputs).findIndex(inp => !inp || !inp.value);
            if (firstEmpty >= 0 && otpInputs[firstEmpty]) {
                otpInputs[firstEmpty].focus();
            } else if (otpInputs[otpInputs.length - 1]) {
                otpInputs[otpInputs.length - 1].focus();
            }
        });
    });

    if (resendLink) {
        resendLink.addEventListener('click', (e) => {
            e.preventDefault();
            announce('Resending OTP...');
            otpInputs.forEach((input) => {
                if (input) input.value = '';
            });
            if (otpInputs[0]) otpInputs[0].focus();
            setTimeout(() => {
                announce('OTP resent successfully. Please check your email.');
            }, 1000);
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        const code = getOTP();
        if (code.length !== 6) {
            showError('Please enter the complete 6-digit OTP.');
            focusFirstEmpty(-1);
            return;
        }

        submitBtn.disabled = true;
        if (btnSpinner) btnSpinner.style.display = 'inline-block';
        const btnText = submitBtn.querySelector('.btn-text');
        if (btnText) btnText.textContent = 'Verifying...';
        otpInputs.forEach((input) => { if (input) input.disabled = true; });

        announce('Verifying OTP...');

        setTimeout(() => {
            announce('OTP verified successfully! Redirecting...');
            setTimeout(() => {
                window.location.href = 'reset-password.html';
            }, 500);
        }, 1500);
    });

});
