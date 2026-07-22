'use strict';

const ROLES = ['TUTOR', 'HOD', 'NODAL OFFICER', 'OS', 'DRS', 'HOSTEL_MANAGER'];

const ROLE_LABELS = {
    TUTOR: 'Tutor', HOD: 'HOD', 'NODAL OFFICER': 'Nodal Officer',
    OS: 'Office Staff', DRS: 'DRS', HOSTEL_MANAGER: 'Hostel Manager'
};

const DEPARTMENTS = [
    'Civil Engineering', 'Mechanical Engineering',
    'Electronics and Communication Engineering',
    'Electrical and Electronics Engineering',
    'Computer Science and Engineering', 'Information Technology',
    'Bio Medical Engineering', 'Computer Science and Business Systems',
    'Artificial Intelligence and Data Science',
    'CSE (Cyber Security)', 'CSE (Artificial Intelligence and Machine Learning)',
    'Electronics Engineering (VLSI Design and Technology)',
    'Business Administration (MBA)', 'Computer Applications (MCA)',
    'Science and Humanities'
];

const HOSTELS = ['Boys Hostel', 'Girls Hostel', 'PG Boys Hostel', 'PG Girls Hostel'];

const SEED_USERS = [
    { empId:'EMP-1001', username:'arun_t', fullName:'Arun Kumar', email:'arun.t@psnacet.edu.in', role:'TUTOR', department:'Computer Science and Engineering', hostel:'', password:'Pass@123', status:'active', dateCreated:'2026-06-01T05:30:00Z', lastLogin:'2026-07-21T09:15:00Z' },
    { empId:'EMP-1002', username:'selvi_t', fullName:'Selvi M', email:'selvi.t@psnacet.edu.in', role:'TUTOR', department:'Information Technology', hostel:'', password:'Pass@123', status:'active', dateCreated:'2026-06-01T05:30:00Z', lastLogin:'2026-07-20T14:30:00Z' },
    { empId:'EMP-1003', username:'ravi_t', fullName:'Ravi Prasad', email:'ravi.t@psnacet.edu.in', role:'TUTOR', department:'Electronics and Communication Engineering', hostel:'', password:'Pass@123', status:'active', dateCreated:'2026-06-05T05:30:00Z', lastLogin:null },
    { empId:'EMP-1004', username:'hod_cse', fullName:'Dr. Padmavathi K', email:'hod.cse@psnacet.edu.in', role:'HOD', department:'Computer Science and Engineering', hostel:'', password:'Pass@123', status:'active', dateCreated:'2026-05-15T05:30:00Z', lastLogin:'2026-07-22T08:45:00Z' },
    { empId:'EMP-1005', username:'hod_it', fullName:'Dr. Ganesan R', email:'hod.it@psnacet.edu.in', role:'HOD', department:'Information Technology', hostel:'', password:'Pass@123', status:'active', dateCreated:'2026-05-15T05:30:00Z', lastLogin:'2026-07-19T11:00:00Z' },
    { empId:'EMP-1006', username:'nodal_office', fullName:'Sundarapandian T', email:'nodal@psnacet.edu.in', role:'NODAL OFFICER', department:'', hostel:'', password:'Pass@123', status:'active', dateCreated:'2026-04-10T05:30:00Z', lastLogin:'2026-07-18T10:20:00Z' },
    { empId:'EMP-1007', username:'os_office', fullName:'Karthik R', email:'os.office@psnacet.edu.in', role:'OS', department:'', hostel:'', password:'Pass@123', status:'active', dateCreated:'2026-06-20T05:30:00Z', lastLogin:'2026-07-22T07:30:00Z' },
    { empId:'EMP-1008', username:'os_office2', fullName:'Muthu K', email:'os.office2@psnacet.edu.in', role:'OS', department:'', hostel:'', password:'Pass@123', status:'disabled', dateCreated:'2026-06-20T05:30:00Z', lastLogin:null },
    { empId:'EMP-1009', username:'drs_admin', fullName:'Prof. Jayaraman N', email:'drs@psnacet.edu.in', role:'DRS', department:'', hostel:'', password:'Pass@123', status:'active', dateCreated:'2026-03-01T05:30:00Z', lastLogin:'2026-07-21T16:45:00Z' },
    { empId:'EMP-1010', username:'hm_bh', fullName:'Rajesh Kannan', email:'hm@psnacet.edu.in', role:'HOSTEL_MANAGER', department:'', hostel:'Boys Hostel', password:'Pass@123', status:'active', dateCreated:'2026-05-01T05:30:00Z', lastLogin:'2026-07-20T20:00:00Z' },
    { empId:'EMP-1011', username:'hm_gh', fullName:'Anitha S', email:'hm.gh@psnacet.edu.in', role:'HOSTEL_MANAGER', department:'', hostel:'Girls Hostel', password:'Pass@123', status:'active', dateCreated:'2026-05-01T05:30:00Z', lastLogin:'2026-07-19T18:30:00Z' }
];

const AdminDashboard = (() => {

    let users = [];
    let currentRole = 'TUTOR';
    let currentFilter = '';
    let searchQuery = '';
    let nextEmpNum = 1001;
    let selectedUserId = null;
    let editingUserId = null;

    const storeKey = 'adminUsers';

    function loadUsers() {
        const stored = localStorage.getItem(storeKey);
        if (stored) {
            users = JSON.parse(stored);
        } else {
            users = JSON.parse(JSON.stringify(SEED_USERS));
            localStorage.setItem(storeKey, JSON.stringify(users));
        }
        users.forEach(u => {
            if (u.empId && u.empId.startsWith('EMP-')) {
                const num = parseInt(u.empId.replace('EMP-', ''), 10);
                if (num >= nextEmpNum) nextEmpNum = num + 1;
            }
        });
    }

    function saveUsers() {
        localStorage.setItem(storeKey, JSON.stringify(users));
    }

    function formatDate(iso) {
        if (!iso) return '—';
        const d = new Date(iso);
        if (isNaN(d.getTime())) return '—';
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `${dd}-${mm}-${yyyy}`;
    }

    function escapeHtml(str) {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    function openDeleteModal(id) {
        selectedUserId = id;
        const user = users.find(u => u.empId === id);
        document.getElementById('deleteMessage').textContent = user
            ? `Are you sure you want to delete "${user.fullName}" (${user.empId})? This action cannot be undone.`
            : 'Are you sure you want to delete this user?';
        document.getElementById('deleteModal').classList.add('active');
    }

    function closeDeleteModal() {
        document.getElementById('deleteModal').classList.remove('active');
        selectedUserId = null;
    }

    function showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const icon = type === 'success'
            ? '<svg class="toast-icon success" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
            : '<svg class="toast-icon error" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `${icon}<span class="toast-message">${escapeHtml(message)}</span><button class="toast-close" aria-label="Dismiss">${'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'}</button>`;
        container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('active'));
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

    function updateStats() {
        const counts = {};
        ROLES.forEach(r => counts[r] = 0);
        users.forEach(u => { if (counts[u.role] !== undefined) counts[u.role]++; });
        ROLES.forEach(r => {
            const el = document.getElementById('stat' + r.replace(/ /g, '_') + 'Count');
            if (el) el.textContent = counts[r];
        });
    }

    function getFilteredUsers() {
        const roleUsers = users.filter(u => u.role === currentRole);
        return roleUsers.filter(u => {
            if (currentRole === 'HOSTEL_MANAGER' && currentFilter && u.hostel !== currentFilter) return false;
            if ((currentRole === 'TUTOR' || currentRole === 'HOD') && currentFilter && u.department !== currentFilter) return false;
            if (searchQuery) {
                const q = searchQuery.toLowerCase();
                const match = (u.empId.toLowerCase().includes(q) ||
                    u.username.toLowerCase().includes(q) ||
                    u.fullName.toLowerCase().includes(q) ||
                    u.email.toLowerCase().includes(q));
                if (!match) return false;
            }
            return true;
        });
    }

    function renderTable() {
        const tbody = document.getElementById('usersTableBody');
        const empty = document.getElementById('emptyState');
        const deptHeader = document.getElementById('deptHeader');
        if (!tbody) return;

        if (deptHeader) {
            if (currentRole === 'HOSTEL_MANAGER') deptHeader.textContent = 'Hostel';
            else if (currentRole === 'TUTOR' || currentRole === 'HOD') deptHeader.textContent = 'Department';
            else deptHeader.textContent = '—';
        }

        const filtered = getFilteredUsers();
        if (filtered.length === 0) {
            tbody.innerHTML = '';
            if (empty) empty.style.display = 'block';
            return;
        }
        if (empty) empty.style.display = 'none';

        const roleLabel = ROLE_LABELS[currentRole] || currentRole;

        tbody.innerHTML = filtered.map(u => {
            const roleBadgeClass = u.role === 'TUTOR' ? 'tutor' : u.role === 'HOD' ? 'hod' : u.role === 'NODAL OFFICER' ? 'nodal' : u.role === 'OS' ? 'os' : u.role === 'DRS' ? 'drss' : 'hostel-manager';
            const deptOrHostel = u.role === 'HOSTEL_MANAGER' ? u.hostel : (u.role === 'TUTOR' || u.role === 'HOD') ? u.department : '—';
            const statusClass = u.status === 'active' ? 'status-active' : 'status-disabled';
            const statusLabel = u.status === 'active' ? 'Active' : 'Disabled';
            const toggleIcon = u.status === 'active'
                ? '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="5" width="22" height="14" rx="7" ry="7"/><circle cx="8" cy="12" r="3.5" fill="currentColor"/></svg>'
                : '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="5" width="22" height="14" rx="7" ry="7"/><circle cx="16" cy="12" r="3.5" fill="currentColor"/></svg>';
            const toggleTitle = u.status === 'active' ? 'Disable' : 'Enable';

            return `<tr data-emp="${u.empId}">
                <td class="col-emp-id">${escapeHtml(u.empId)}</td>
                <td class="col-username">${escapeHtml(u.username)}</td>
                <td class="col-name">${escapeHtml(u.fullName)}</td>
                <td class="col-email">${escapeHtml(u.email)}</td>
                <td class="col-dept">${escapeHtml(deptOrHostel || '—')}</td>
                <td><span class="role-badge ${roleBadgeClass}">${escapeHtml(roleLabel)}</span></td>
                <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
                <td class="col-date">${formatDate(u.dateCreated)}</td>
                <td class="col-date">${formatDate(u.lastLogin)}</td>
                <td class="col-action">
                    <div class="action-group">
                        <button class="btn-icon view" title="View Profile" data-action="view" data-emp="${u.empId}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                        <button class="btn-icon edit" title="Edit User" data-action="edit" data-emp="${u.empId}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        </button>
                        <button class="btn-icon reset" title="Reset Password" data-action="reset" data-emp="${u.empId}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        </button>
                        <button class="btn-icon toggle" title="${toggleTitle}" data-action="toggle" data-emp="${u.empId}">
                            ${toggleIcon}
                        </button>
                        <button class="btn-icon danger" title="Delete User" data-action="delete" data-emp="${u.empId}">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </td>
            </tr>`;
        }).join('');

        updateStats();
        bindActionEvents();
    }

    function bindActionEvents() {
        document.querySelectorAll('.action-group .btn-icon').forEach(btn => {
            btn.addEventListener('click', function() {
                const action = this.dataset.action;
                const empId = this.dataset.emp;
                if (!empId) return;
                switch (action) {
                    case 'view': viewProfile(empId); break;
                    case 'edit': editUser(empId); break;
                    case 'reset': resetPassword(empId); break;
                    case 'toggle': toggleUserStatus(empId); break;
                    case 'delete': openDeleteModal(empId); break;
                }
            });
        });
    }

    function getDefaultPassword() {
        return 'Pass@123';
    }

    function viewProfile(empId) {
        const u = users.find(x => x.empId === empId);
        if (!u) return showToast('User not found', 'error');
        const deptOrHostel = u.role === 'HOSTEL_MANAGER' ? 'Hostel: ' + u.hostel : (u.role === 'TUTOR' || u.role === 'HOD') ? 'Department: ' + (u.department || '—') : '—';
        const roleLabel = ROLE_LABELS[u.role] || u.role;
        const statusLabel = u.status === 'active' ? 'Active' : 'Disabled';
        showToast(`${u.fullName} — ${roleLabel} | ${deptOrHostel} | Status: ${statusLabel}`, 'success');
    }

    function editUser(empId) {
        const u = users.find(x => x.empId === empId);
        if (!u) return showToast('User not found', 'error');
        editingUserId = empId;
        openAddModal(u.role, u);
    }

    function resetPassword(empId) {
        const u = users.find(x => x.empId === empId);
        if (!u) return showToast('User not found', 'error');
        const newPwd = getDefaultPassword();
        u.password = newPwd;
        saveUsers();
        showToast(`Password reset to "${newPwd}" for ${u.fullName}`, 'success');
    }

    function toggleUserStatus(empId) {
        const u = users.find(x => x.empId === empId);
        if (!u) return showToast('User not found', 'error');
        u.status = u.status === 'active' ? 'disabled' : 'active';
        saveUsers();
        renderTable();
        showToast(`${u.fullName} account ${u.status === 'active' ? 'enabled' : 'disabled'}`, 'success');
    }

    function switchTab(role) {
        currentRole = role;
        currentFilter = '';
        searchQuery = '';
        document.getElementById('searchInput').value = '';
        document.querySelectorAll('.tab-btn').forEach(t => {
            t.classList.toggle('active', t.dataset.role === role);
        });
        const fw = document.getElementById('filterWrapper');
        if (fw) {
            if (role === 'HOSTEL_MANAGER') {
                fw.innerHTML = `<select id="filterSelect" class="filter-select"><option value="">All Hostels</option>${HOSTELS.map(h => `<option value="${h}">${h}</option>`).join('')}</select>`;
            } else if (role === 'TUTOR' || role === 'HOD') {
                fw.innerHTML = `<select id="filterSelect" class="filter-select"><option value="">All Departments</option>${DEPARTMENTS.map(d => `<option value="${d}">${d}</option>`).join('')}</select>`;
            } else {
                fw.innerHTML = '';
            }
            const fs = document.getElementById('filterSelect');
            if (fs) fs.addEventListener('change', function() {
                currentFilter = this.value;
                renderTable();
            });
        }
        renderTable();
    }

    function openAddModal(role, editData = null) {
        const modal = document.getElementById('addUserModal');
        const form = document.getElementById('addUserForm');
        form.reset();
        document.querySelectorAll('.form-group').forEach(g => g.classList.remove('has-error'));

        const isEdit = editData !== null;
        const title = document.querySelector('#addUserModal .modal-card-header h3');
        const subtitle = document.querySelector('#addUserModal .modal-card-header span');
        if (title) title.textContent = isEdit ? 'Edit User' : 'Add ' + (ROLE_LABELS[role] || role);
        if (subtitle) subtitle.textContent = isEdit ? 'Update user details' : 'Fill in the details to create a new ' + (ROLE_LABELS[role] || role).toLowerCase() + ' user';

        const submitBtn = document.getElementById('formSubmit');
        if (submitBtn) submitBtn.innerHTML = isEdit
            ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"/><polygon points="18 2 22 6 12 16 8 16 8 12 18 2"/></svg> Update User`
            : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Add User`;

        const empIdField = document.getElementById('formEmpId');
        const deptGroup = document.getElementById('formDeptGroup');
        const hostelGroup = document.getElementById('formHostelGroup');
        const deptSelect = document.getElementById('formDepartment');
        const hostelSelect = document.getElementById('formHostel');

        if (role === 'HOSTEL_MANAGER') {
            if (deptGroup) deptGroup.style.display = 'none';
            if (hostelGroup) hostelGroup.style.display = 'flex';
        } else if (role === 'TUTOR' || role === 'HOD') {
            if (deptGroup) deptGroup.style.display = 'flex';
            if (hostelGroup) hostelGroup.style.display = 'none';
        } else {
            if (deptGroup) deptGroup.style.display = 'none';
            if (hostelGroup) hostelGroup.style.display = 'none';
        }

        if (isEdit) {
            if (empIdField) { empIdField.value = editData.empId; empIdField.readOnly = true; }
            document.getElementById('formUsername').value = editData.username;
            document.getElementById('formFullName').value = editData.fullName;
            document.getElementById('formEmail').value = editData.email;
            if (role === 'HOSTEL_MANAGER') {
                if (hostelSelect) { hostelSelect.value = editData.hostel || ''; }
            } else if (role === 'TUTOR' || role === 'HOD') {
                if (deptSelect) { deptSelect.value = editData.department || ''; }
            }
            document.getElementById('formPassword').value = '';
            document.getElementById('formConfirmPassword').value = '';
            document.getElementById('formPassword').required = false;
            document.getElementById('formConfirmPassword').required = false;
            document.querySelectorAll('.pwd-optional').forEach(el => el.style.display = 'inline');
        } else {
            if (empIdField) {
                const padded = String(nextEmpNum).padStart(4, '0');
                empIdField.value = 'EMP-' + padded;
                empIdField.readOnly = false;
            }
            document.getElementById('formPassword').required = true;
            document.getElementById('formConfirmPassword').required = true;
            document.querySelectorAll('.pwd-optional').forEach(el => el.style.display = 'none');
        }

        modal.dataset.editRole = role;
        modal.dataset.editId = isEdit ? editData.empId : '';
        modal.classList.add('active');
        document.getElementById('formUsername').focus();
    }

    function closeAddModal() {
        document.getElementById('addUserModal').classList.remove('active');
        editingUserId = null;
    }

    function handleAddUser(e) {
        e.preventDefault();
        const modal = document.getElementById('addUserModal');
        const role = modal.dataset.editRole || 'TUTOR';
        const editId = modal.dataset.editId || '';
        const isEdit = !!editId;

        let isValid = true;
        document.querySelectorAll('#addUserForm .form-group').forEach(g => g.classList.remove('has-error'));

        const username = document.getElementById('formUsername').value.trim();
        const fullName = document.getElementById('formFullName').value.trim();
        const email = document.getElementById('formEmail').value.trim();
        const empId = document.getElementById('formEmpId').value.trim();
        const password = document.getElementById('formPassword').value;
        const confirmPassword = document.getElementById('formConfirmPassword').value;

        if (!username) { showFieldError('formUsername', 'Username is required.'); isValid = false; }
        if (!fullName) { showFieldError('formFullName', 'Full name is required.'); isValid = false; }
        if (!email) { showFieldError('formEmail', 'Email is required.'); isValid = false; }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showFieldError('formEmail', 'Valid email required.'); isValid = false; }

        if (!empId) { showFieldError('formEmpId', 'Employee ID is required.'); isValid = false; }
        else if (!/^EMP-\d+$/.test(empId)) { showFieldError('formEmpId', 'Format: EMP-XXXX.'); isValid = false; }
        else {
            const dup = users.find(u => u.empId === empId && (!isEdit || u.empId !== editId));
            if (dup) { showFieldError('formEmpId', 'Employee ID already exists.'); isValid = false; }
        }

        let department = '';
        let hostel = '';
        if (role === 'HOSTEL_MANAGER') {
            hostel = document.getElementById('formHostel').value;
            if (!hostel) { showFieldError('formHostel', 'Please select a hostel.'); isValid = false; }
        } else if (role === 'TUTOR' || role === 'HOD') {
            department = document.getElementById('formDepartment').value;
            if (!department) { showFieldError('formDepartment', 'Please select a department.'); isValid = false; }
        }

        if (!isEdit) {
            if (!password) { showFieldError('formPassword', 'Password is required.'); isValid = false; }
            if (!confirmPassword) { showFieldError('formConfirmPassword', 'Please confirm password.'); isValid = false; }
            else if (password !== confirmPassword) { showFieldError('formConfirmPassword', 'Passwords do not match.'); isValid = false; }
        } else {
            if (password && password !== confirmPassword) { showFieldError('formConfirmPassword', 'Passwords do not match.'); isValid = false; }
        }

        if (!isValid) return;

        if (isEdit) {
            const idx = users.findIndex(u => u.empId === editId);
            if (idx === -1) return showToast('User not found', 'error');
            users[idx].username = username;
            users[idx].fullName = fullName;
            users[idx].email = email;
            users[idx].empId = empId;
            if (role === 'HOSTEL_MANAGER') users[idx].hostel = hostel;
            else if (role === 'TUTOR' || role === 'HOD') users[idx].department = department;
            if (password) users[idx].password = password;
            saveUsers();
            renderTable();
            closeAddModal();
            showToast(`User "${fullName}" updated successfully`, 'success');
        } else {
            const newUser = {
                empId,
                username,
                fullName,
                email,
                role,
                department,
                hostel,
                password: password || getDefaultPassword(),
                status: 'active',
                dateCreated: new Date().toISOString(),
                lastLogin: null
            };
            users.push(newUser);
            const num = parseInt(empId.replace('EMP-', ''), 10);
            if (num >= nextEmpNum) nextEmpNum = num + 1;
            saveUsers();
            renderTable();
            closeAddModal();
            showToast(`User "${fullName}" (${empId}) created successfully`, 'success');
        }
    }

    function showFieldError(fieldId, msg) {
        const field = document.getElementById(fieldId);
        if (!field) return;
        const group = field.closest('.form-group');
        if (group) group.classList.add('has-error');
        const errorDiv = document.getElementById(fieldId + 'Error');
        if (errorDiv) errorDiv.textContent = msg;
    }

    function handleLogout() {
        sessionStorage.removeItem('adminAuthenticated');
        window.location.href = 'admin-login.html';
    }

    function init() {
        if (sessionStorage.getItem('adminAuthenticated') !== 'true') {
            window.location.href = 'admin-login.html';
            return;
        }

        loadUsers();

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

        document.querySelectorAll('.stat-card-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                editingUserId = null;
                openAddModal(this.dataset.role);
            });
        });

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                switchTab(this.dataset.role);
            });
        });

        document.getElementById('modalClose').addEventListener('click', closeAddModal);
        document.getElementById('formCancel').addEventListener('click', closeAddModal);
        document.getElementById('addUserModal').addEventListener('click', function(e) {
            if (e.target === this) closeAddModal();
        });

        document.getElementById('formSubmit').addEventListener('click', handleAddUser);

        document.getElementById('addUserForm').addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('formSubmit').click();
        });

        document.getElementById('deleteCancel').addEventListener('click', closeDeleteModal);
        document.getElementById('deleteConfirm').addEventListener('click', function() {
            if (!selectedUserId) return;
            const idx = users.findIndex(u => u.empId === selectedUserId);
            if (idx !== -1) {
                const deleted = users[idx];
                users.splice(idx, 1);
                saveUsers();
                renderTable();
                showToast(`User "${deleted.fullName}" deleted`, 'success');
            }
            closeDeleteModal();
        });
        document.getElementById('deleteModal').addEventListener('click', function(e) {
            if (e.target === this) closeDeleteModal();
        });

        document.getElementById('searchInput').addEventListener('input', function() {
            searchQuery = this.value;
            renderTable();
        });

        document.querySelectorAll('#addUserForm .form-input, #addUserForm .form-select').forEach(input => {
            ['input', 'change'].forEach(evt => {
                input.addEventListener(evt, function() {
                    const group = this.closest('.form-group');
                    if (group) group.classList.remove('has-error');
                });
            });
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                if (document.getElementById('addUserModal').classList.contains('active')) closeAddModal();
                if (document.getElementById('deleteModal').classList.contains('active')) closeDeleteModal();
            }
        });

        switchTab('TUTOR');
    }

    return { init };

})();

document.addEventListener('DOMContentLoaded', () => {
    AdminDashboard.init();
});
