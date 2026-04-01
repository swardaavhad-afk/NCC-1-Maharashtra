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

// Fetch Public Gallery Achievements
async function loadPublicGallery() {
  const galleryGrid = document.getElementById('gallery-grid');
  if (!galleryGrid) return;
  try {
    const rd = await api.get('/achievements/gallery'); const data = rd.achievements;
    
    if (!data || data.length === 0) {
      galleryGrid.innerHTML = '<p style="grid-column: 1/-1; text-align:center; color:#666;">No achievements to display yet.</p>';
      return;
    }
    
    galleryGrid.innerHTML = data.map(ach => `
      <div class="achievement-card" style="border: 1px solid #ccc; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); background: #fff;">
        ${ach.camp_photos && ach.camp_photos.length > 0
          ? `<img src="${ach.camp_photos[0]}" style="width: 100%; height: 200px; object-fit: cover;" alt="Achievement">`
          : `<div style="width:100%; height:200px; background:#f0f0f0; display:flex; align-items:center; justify-content:center; font-weight:bold; color:#555;">No Photo</div>`
        }
        <div style="padding: 15px;">
          ${ach.is_special ? `<span style="background: gold; padding: 3px 8px; font-size: 0.8rem; border-radius: 12px; font-weight:bold; color: #000;">🏆 Special</span>` : ''}
          <h3 style="margin-top: 10px; color: #003366;">${ach.title}</h3>
          ${ach.name ? `<p style="margin: 5px 0;"><strong>Cadet:</strong> ${ach.rank ? ach.rank + ' ' : ''}${ach.name}</p>` : ''}
          ${ach.camp_name ? `<p style="margin: 5px 0;"><strong>Camp:</strong> ${ach.camp_name}</p>` : ''}
          ${ach.description ? `<p style="font-size: 0.9em; margin-top: 10px; color: #555;">${ach.description}</p>` : ''}
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Gallery loading failed', err);
    galleryGrid.innerHTML = '<p>Could not load gallery at this time.</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(loadPublicGallery, 500);
});
