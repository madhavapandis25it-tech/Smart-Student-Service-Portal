'use strict';

const AdminDashboard = (() => {

    const ROLES = ['HOD', 'TUTOR', 'NODAL OFFICER', 'OS', 'WARDEN', 'DRSS'];

    const DEPARTMENTS = [
        'Computer Science and Engineering',
        'Information Technology',
        'Bio Medical Engineering',
        'Computer Science and Business Systems',
        'Artificial Intelligence and Data Science',
        'CSE (Cyber Security)',
        'CSE (Artificial Intelligence and Machine Learning)',
        'Electronics Engineering (VLSI Design and Technology)',
        'Business Administration (MBA)',
        'Computer Applications (MCA)',
        'Science and Humanities',
        'Civil Engineering',
        'Mechanical Engineering',
        'Electronics and Communication Engineering',
        'Electrical and Electronics Engineering'
    ];

    let users = [
        { id: 1, username: 'john_smith', email: 'john@college.edu', role: 'TUTOR', department: 'Information Technology', password: 'pass123' },
        { id: 2, username: 'priya_tutor', email: 'priya@college.edu', role: 'TUTOR', department: 'Computer Science and Engineering', password: 'pass123' },
        { id: 3, username: 'hod_cse', email: 'hod.cse@college.edu', role: 'HOD', department: 'Computer Science and Engineering', password: 'pass123' },
        { id: 4, username: 'nodal_office', email: 'nodal@college.edu', role: 'NODAL OFFICER', department: 'Science and Humanities', password: 'pass123' },
        { id: 5, username: 'os_ml', email: 'os.ml@college.edu', role: 'OS', department: 'CSE (Artificial Intelligence and Machine Learning)', password: 'pass123' },
        { id: 6, username: 'warden_hostel', email: 'warden@college.edu', role: 'WARDEN', department: 'Mechanical Engineering', password: 'pass123' },
        { id: 7, username: 'drss_admin', email: 'drss@college.edu', role: 'DRSS', department: 'Electronics and Communication Engineering', password: 'pass123' },
        { id: 8, username: 'hod_it', email: 'hod.it@college.edu', role: 'HOD', department: 'Information Technology', password: 'pass123' }
    ];

    let nextId = 9;
    let deleteTargetId = null;

    const usersTableBody = document.getElementById('usersTableBody');
    const emptyState = document.getElementById('emptyState');
    const totalUsersCount = document.getElementById('totalUsersCount');
    const activeUsersCount = document.getElementById('activeUsersCount');
    const userCountLabel = document.getElementById('userCountLabel');
    const addUserModal = document.getElementById('addUserModal');
    const deleteModal = document.getElementById('deleteModal');
    const addUserForm = document.getElementById('addUserForm');
    const toastContainer = document.getElementById('toastContainer');
    const logoutBtn = document.getElementById('logoutBtn');

    function checkAuth() {
        if (sessionStorage.getItem('adminAuthenticated') !== 'true') {
            window.location.href = 'admin-login.html';
        }
    }

    function renderTable() {
        if (!usersTableBody) return;

        if (users.length === 0) {
            usersTableBody.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            updateStats();
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        usersTableBody.innerHTML = users.map((user, index) => {
            return `
                <tr data-id="${user.id}">
                    <td class="col-no">${index + 1}</td>
                    <td class="col-username">${escapeHtml(user.username)}</td>
                    <td class="col-email">${escapeHtml(user.email)}</td>
                    <td class="col-role">
                        <select class="role-select" data-id="${user.id}" data-field="role">
                            ${ROLES.map(r => `<option value="${r}" ${user.role === r ? 'selected' : ''}>${r}</option>`).join('')}
                        </select>
                    </td>
                    <td class="col-dept">
                        <select class="dept-select" data-id="${user.id}" data-field="department">
                            ${DEPARTMENTS.map(d => `<option value="${d}" ${user.department === d ? 'selected' : ''}>${d}</option>`).join('')}
                        </select>
                    </td>
                    <td class="col-action">
                        <button class="btn-delete" data-id="${user.id}" aria-label="Delete user ${escapeHtml(user.username)}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                            DELETE
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        updateStats();
        bindTableEvents();
    }

    function bindTableEvents() {
        document.querySelectorAll('.role-select, .dept-select').forEach(select => {
            select.addEventListener('change', function() {
                const id = parseInt(this.dataset.id);
                const field = this.dataset.field;
                const value = this.value;
                const user = users.find(u => u.id === id);
                if (user) {
                    user[field] = value;
                    showToast(`${user.username}'s ${field} updated to "${value}"`, 'success');
                }
            });
        });

        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                deleteTargetId = parseInt(this.dataset.id);
                const user = users.find(u => u.id === deleteTargetId);
                if (user) {
                    document.getElementById('deleteMessage').textContent =
                        `Are you sure you want to delete "${user.username}"? This action cannot be undone.`;
                }
                deleteModal.classList.add('active');
            });
        });
    }

    function updateStats() {
        const count = users.length;
        if (totalUsersCount) totalUsersCount.textContent = count;
        if (activeUsersCount) activeUsersCount.textContent = count;
        if (userCountLabel) userCountLabel.textContent = `(${count} total)`;
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showToast(message, type = 'success') {
        if (!toastContainer) return;

        const icon = type === 'success'
            ? '<svg class="toast-icon success" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
            : '<svg class="toast-icon error" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            ${icon}
            <span class="toast-message">${escapeHtml(message)}</span>
            <button class="toast-close" aria-label="Dismiss notification">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
            </button>
        `;

        toastContainer.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add('active');
        });

        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.classList.remove('active');
            setTimeout(() => toast.remove(), 400);
        });

        setTimeout(() => {
            if (toast.parentNode) {
                toast.classList.remove('active');
                setTimeout(() => toast.remove(), 400);
            }
        }, 4000);
    }

    function openAddUserModal() {
        addUserForm.reset();
        document.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));
        addUserModal.classList.add('active');
        document.getElementById('formUsername').focus();
    }

    function closeAddUserModal() {
        addUserModal.classList.remove('active');
    }

    function closeDeleteModal() {
        deleteModal.classList.remove('active');
        deleteTargetId = null;
    }

    function handleAddUser(e) {
        e.preventDefault();

        let isValid = true;

        document.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));

        const username = document.getElementById('formUsername').value.trim();
        const email = document.getElementById('formEmail').value.trim();
        const role = document.getElementById('formRole').value;
        const department = document.getElementById('formDepartment').value;
        const password = document.getElementById('formPassword').value;
        const confirmPassword = document.getElementById('formConfirmPassword').value;

        if (!username) {
            showFieldError('formUsername', 'Username is required.');
            isValid = false;
        }

        if (!email) {
            showFieldError('formEmail', 'Email is required.');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showFieldError('formEmail', 'Please enter a valid email address.');
            isValid = false;
        }

        if (!role) {
            showFieldError('formRole', 'Please select a role.');
            isValid = false;
        }

        if (!department) {
            showFieldError('formDepartment', 'Please select a department.');
            isValid = false;
        }

        if (!password) {
            showFieldError('formPassword', 'Password is required.');
            isValid = false;
        }

        if (!confirmPassword) {
            showFieldError('formConfirmPassword', 'Please confirm the password.');
            isValid = false;
        } else if (password !== confirmPassword) {
            showFieldError('formConfirmPassword', 'Passwords do not match.');
            isValid = false;
        }

        if (!isValid) return;

        const newUser = {
            id: nextId++,
            username,
            email,
            role,
            department,
            password
        };

        users.push(newUser);
        renderTable();
        closeAddUserModal();
        showToast(`User "${username}" has been added successfully.`, 'success');
    }

    function showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (field) {
            const group = field.closest('.form-group');
            if (group) group.classList.add('has-error');
            const errorDiv = document.getElementById(fieldId + 'Error');
            if (errorDiv) errorDiv.textContent = message;
        }
    }

    function handleDeleteConfirm() {
        if (deleteTargetId === null) return;

        const index = users.findIndex(u => u.id === deleteTargetId);
        if (index !== -1) {
            const deleted = users[index];
            users.splice(index, 1);
            renderTable();
            showToast(`User "${deleted.username}" has been deleted.`, 'success');
        }
        closeDeleteModal();
    }

    function handleLogout() {
        sessionStorage.removeItem('adminAuthenticated');
        window.location.href = 'admin-login.html';
    }

    function init() {
        checkAuth();

        renderTable();

        document.getElementById('addUserBtn').addEventListener('click', openAddUserModal);
        document.getElementById('addUserBtn2').addEventListener('click', openAddUserModal);
        document.getElementById('modalClose').addEventListener('click', closeAddUserModal);
        document.getElementById('formCancel').addEventListener('click', closeAddUserModal);
        addUserModal.addEventListener('click', function(e) {
            if (e.target === this) closeAddUserModal();
        });

        document.getElementById('deleteCancel').addEventListener('click', closeDeleteModal);
        document.getElementById('deleteConfirm').addEventListener('click', handleDeleteConfirm);
        deleteModal.addEventListener('click', function(e) {
            if (e.target === this) closeDeleteModal();
        });

        addUserForm.addEventListener('submit', handleAddUser);

        document.querySelectorAll('.form-input, .form-select').forEach(input => {
            input.addEventListener('input', function() {
                const group = this.closest('.form-group');
                if (group) group.classList.remove('has-error');
            });
            input.addEventListener('change', function() {
                const group = this.closest('.form-group');
                if (group) group.classList.remove('has-error');
            });
        });

        if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (addUserModal.classList.contains('active')) closeAddUserModal();
                if (deleteModal.classList.contains('active')) closeDeleteModal();
            }
        });
    }

    return { init };

})();

document.addEventListener('DOMContentLoaded', () => {
    AdminDashboard.init();
});
