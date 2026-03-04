// =============================================
// NCC Cadet Management System - App Bootstrap
// =============================================
(function () {
  'use strict';

  // On page load – check for existing session
  document.addEventListener('DOMContentLoaded', () => {
    try {
      initApp();
    } catch (err) {
      console.error('App init error:', err);
      // Ensure landing page is always visible even if init fails
      showLandingSafe();
    }
  });

  // Safe fallback to show landing page even if other modules fail
  function showLandingSafe() {
    try {
      if (typeof showLanding === 'function') {
        showLanding();
      } else {
        // Fallback: manually show landing page
        document.querySelectorAll('[id^="page-"]').forEach(function(p) {
          p.classList.add('hidden');
        });
        var landing = document.getElementById('page-landing');
        if (landing) landing.classList.remove('hidden');
      }
    } catch (e) {
      console.error('Landing fallback error:', e);
      // Last resort: make page-landing visible via inline style
      var el = document.getElementById('page-landing');
      if (el) el.style.display = 'block';
    }
  }

  function initApp() {
    var token = null;
    var user = null;

    try {
      token = localStorage.getItem('ncc_token');
      user = JSON.parse(localStorage.getItem('ncc_user') || 'null');
    } catch (e) {
      console.warn('localStorage not available:', e);
    }

    if (token && user) {
      // Restore global state
      if (typeof api !== 'undefined') api.setToken(token);
      currentUser = user;

      try {
        currentCadet = JSON.parse(localStorage.getItem('ncc_cadet') || 'null');
      } catch (e) {
        currentCadet = null;
      }

      // Verify token is still valid
      if (typeof api !== 'undefined') {
        api.get('/auth/me')
          .then(function(data) {
            currentUser = data.user || user;
            if (data.cadet) currentCadet = data.cadet;
            try {
              localStorage.setItem('ncc_user', JSON.stringify(currentUser));
              if (currentCadet) localStorage.setItem('ncc_cadet', JSON.stringify(currentCadet));
            } catch (e) { /* localStorage not available */ }
            if (currentUser.role === 'admin') {
              showAdminDashboard();
            } else {
              showCadetDashboard();
            }
          })
          .catch(function() {
            // Token expired
            try {
              localStorage.removeItem('ncc_token');
              localStorage.removeItem('ncc_user');
              localStorage.removeItem('ncc_cadet');
            } catch (e) { /* ignore */ }
            currentUser = null;
            currentCadet = null;
            showLandingSafe();
          });
      } else {
        showLandingSafe();
      }
    } else {
      showLandingSafe();
    }
  }

  // Expose to window
  window.initApp = initApp;
})();
