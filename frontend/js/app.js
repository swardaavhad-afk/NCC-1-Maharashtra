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
      // Verify token is still valid
      api.get('/auth/me')
        .then(() => {
          if (user.role === 'admin') {
            showAdminDashboard();
          } else {
            showCadetDashboard();
          }
        })
        .catch(() => {
          // Token expired
          localStorage.removeItem('ncc_token');
          localStorage.removeItem('ncc_user');
          showLanding();
        });
    } else {
      showLanding();
    }
  }

  // Expose to window
  window.initApp = initApp;
})();
