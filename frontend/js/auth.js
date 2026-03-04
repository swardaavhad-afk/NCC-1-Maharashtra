// =============================================
// Authentication Module
// =============================================
let currentUser = null;
let currentCadet = null;
let currentLoginType = null;

// ── Show Landing Page ──
function showLanding() {
  hideAllPages();
  document.getElementById('page-landing').classList.remove('hidden');
  currentLoginType = null;
}

// ── Show Login Form ──
function showLoginForm(type) {
  currentLoginType = type;
  hideAllPages();
  document.getElementById('page-login').classList.remove('hidden');

  const title = document.getElementById('login-form-title');
  const subtitle = document.getElementById('login-form-subtitle');
  const adminForm = document.getElementById('admin-login-form');
  const cadetForm = document.getElementById('cadet-login-form');

  if (type === 'admin') {
    title.textContent = 'ADMIN PORTAL';
    subtitle.textContent = 'Administrative Officer Login';
    adminForm.classList.remove('hidden');
    cadetForm.classList.add('hidden');
  } else {
    title.textContent = 'CADET PORTAL';
    subtitle.textContent = 'Cadet Management System';
    adminForm.classList.add('hidden');
    cadetForm.classList.remove('hidden');
  }
}

// ── Go to Registration ──
function goToRegistration(e) {
  e.preventDefault();
  hideAllPages();
  if (currentLoginType === 'admin') {
    document.getElementById('page-admin-register').classList.remove('hidden');
  } else {
    document.getElementById('page-cadet-register').classList.remove('hidden');
  }
}

// ── Handle Login ──
async function handleLogin(e, type) {
  e.preventDefault();
  const form = e.target;
  const data = getFormData(form);

  try {
    let result;
    if (type === 'admin') {
      result = await api.post('/auth/login', { email: data.email, password: data.password });
    } else {
      result = await api.post('/auth/login/enrollment', {
        enrollmentNumber: data.enrollmentNumber,
        password: data.password
      });
    }

    api.setToken(result.token);
    currentUser = result.user;
    currentCadet = result.cadet || null;
    if (currentCadet) {
      currentUser.cadetId = currentCadet._id;
    }
    localStorage.setItem('ncc_user', JSON.stringify(currentUser));
    if (currentCadet) localStorage.setItem('ncc_cadet', JSON.stringify(currentCadet));

    showToast(`Welcome, ${currentUser.fullName}!`, 'success');
    form.reset();

    if (currentUser.role === 'admin') {
      showAdminDashboard();
    } else {
      showCadetDashboard();
    }
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ── Handle Admin Registration ──
async function handleAdminRegister(e) {
  e.preventDefault();
  const data = getFormData(e.target);

  if (data.password !== data.confirmPassword) {
    showToast('Passwords do not match', 'error');
    return;
  }

  try {
    const result = await api.post('/auth/register/admin', data);
    api.setToken(result.token);
    currentUser = result.user;
    localStorage.setItem('ncc_user', JSON.stringify(currentUser));
    showToast('Registration successful!', 'success');
    e.target.reset();
    showAdminDashboard();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ── Handle Cadet Registration ──
async function handleCadetRegister(e) {
  e.preventDefault();
  const data = getFormData(e.target);

  try {
    const result = await api.post('/auth/register/cadet', data);
    api.setToken(result.token);
    currentUser = result.user;
    currentCadet = result.cadet;
    localStorage.setItem('ncc_user', JSON.stringify(currentUser));
    localStorage.setItem('ncc_cadet', JSON.stringify(currentCadet));
    showToast('Registration successful!', 'success');
    e.target.reset();
    showCadetDashboard();
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// ── Show Admin Dashboard ──
function showAdminDashboard() {
  hideAllPages();
  document.getElementById('page-admin-dashboard').classList.remove('hidden');
  document.getElementById('admin-user-name').textContent = currentUser.fullName;
  switchAdminView('dashboard');
}

// ── Show Cadet Dashboard ──
function showCadetDashboard() {
  hideAllPages();
  document.getElementById('page-cadet-dashboard').classList.remove('hidden');
  document.getElementById('cadet-user-name').textContent = currentUser.fullName;
  document.getElementById('cadet-enrollment').textContent = currentCadet ? `ENROLL: ${currentCadet.enrollmentNumber}` : '';
  switchCadetView('dashboard');
}

// ── Handle Logout ──
function handleLogout() {
  api.setToken(null);
  currentUser = null;
  currentCadet = null;
  localStorage.removeItem('ncc_user');
  localStorage.removeItem('ncc_cadet');
  showToast('Logged out successfully', 'info');
  showLanding();
}

// ── Toggle Sidebar ──
function toggleSidebar(type) {
  const sidebar = document.getElementById(`${type}-sidebar`);
  sidebar.classList.toggle('collapsed');
}

// ── Helper: Hide All Pages ──
function hideAllPages() {
  document.querySelectorAll('[id^="page-"]').forEach(p => p.classList.add('hidden'));
}

// ── Switch Admin View ──
function switchAdminView(view) {
  const titles = {
    dashboard: 'DASHBOARD', camps: 'CAMPS', attendance: 'ATTENDANCE',
    cadets: 'CADETS', achievements: 'ACHIEVEMENTS', materials: 'STUDY MATERIALS', reports: 'REPORTS'
  };
  document.getElementById('admin-page-title').textContent = titles[view] || 'DASHBOARD';

  // Update sidebar active state
  document.querySelectorAll('#admin-sidebar .sidebar-link').forEach(link => {
    link.classList.toggle('active', link.dataset.view === view);
  });

  // Load content
  const content = document.getElementById('admin-content');
  switch (view) {
    case 'dashboard': loadAdminDashboard(content); break;
    case 'camps': loadAdminCamps(content); break;
    case 'attendance': loadAdminAttendance(content); break;
    case 'cadets': loadAdminCadets(content); break;
    case 'achievements': loadAdminAchievements(content); break;
    case 'materials': loadAdminStudyMaterials(content); break;
    case 'reports': loadAdminReports(content); break;
  }
}

// ── Switch Cadet View ──
function switchCadetView(view) {
  const titles = {
    dashboard: 'DASHBOARD', camps: 'MY CAMPS', attendance: 'ATTENDANCE',
    achievements: 'ACHIEVEMENTS', materials: 'STUDY MATERIAL', profile: 'MY PROFILE'
  };
  document.getElementById('cadet-page-title').textContent = titles[view] || 'DASHBOARD';

  // Update sidebar active state
  document.querySelectorAll('#cadet-sidebar .sidebar-link').forEach(link => {
    link.classList.remove('active', 'cadet-active');
    if (link.dataset.view === view) {
      link.classList.add('active', 'cadet-active');
    }
  });

  const content = document.getElementById('cadet-content');
  switch (view) {
    case 'dashboard': loadCadetDashboard(content); break;
    case 'camps': loadCadetCamps(content); break;
    case 'attendance': loadCadetAttendance(content); break;
    case 'achievements': loadCadetAchievements(content); break;
    case 'materials': loadCadetStudyMaterials(content); break;
    case 'profile': loadCadetProfile(content); break;
  }
}
