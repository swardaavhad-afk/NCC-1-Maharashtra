// =============================================
// NCC Cadet Management System - App Bootstrap
// =============================================
(function () {
  'use strict';

  // On page load – check for existing session
  document.addEventListener('DOMContentLoaded', () => {
    initApp();
  });

  function initApp() {
    const token = localStorage.getItem('ncc_token');
    const user = JSON.parse(localStorage.getItem('ncc_user') || 'null');

    if (token && user) {
      // Restore global state
      api.setToken(token);
      currentUser = user;
      currentCadet = JSON.parse(localStorage.getItem('ncc_cadet') || 'null');

      // Verify token is still valid
      api.get('/auth/me')
        .then((data) => {
          currentUser = data.user || user;
          if (data.cadet) currentCadet = data.cadet;
          localStorage.setItem('ncc_user', JSON.stringify(currentUser));
          if (currentCadet) localStorage.setItem('ncc_cadet', JSON.stringify(currentCadet));
          if (currentUser.role === 'admin') {
            showAdminDashboard();
          } else {
            showCadetDashboard();
          }
        })
        .catch(() => {
          // Token expired
          localStorage.removeItem('ncc_token');
          localStorage.removeItem('ncc_user');
          localStorage.removeItem('ncc_cadet');
          currentUser = null;
          currentCadet = null;
          showLanding();
        });
    } else {
      showLanding();
    }
  }

  // Expose to window
  window.initApp = initApp;
})();
