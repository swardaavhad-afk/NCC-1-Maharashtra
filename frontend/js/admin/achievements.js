// =============================================
// Admin Achievements Management
// =============================================

async function loadAdminAchievements(container) {
  container.innerHTML = '<div class=\"text-center p-8\" style=\"color:var(--text-blue-200)\">Loading achievements...</div>';
  try {
    const response = await api.get('/achievements/admin/all');
    const achievements = response.achievements || [];

    container.innerHTML = `
      <div class=\"fade-in\">
        <div style=\"display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem\">
          <h3 class=\"font-bold text-lg\">Achievement Requests</h3>
          <button class=\"btn btn-primary\" onclick=\"showAddAchievementModal()\">+ Add Achievement</button>
        </div>
        <div style=\"display:grid;grid-template-columns:repeat(auto-fill,minmax(350px,1fr));gap:1.5rem\">
          ${achievements.length === 0 ?
            '<div class=\"text-center p-8\" style=\"color:var(--text-blue-300);grid-column:1/-1\">No achievements yet</div>'
            : achievements.map(a => `
            <div class=\"card\" style=\"padding:1.5rem;border-left:4px solid ${a.is_approved ? '#10b981' : '#f59e0b'}\">
              <div style=\"display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem\">  
                <div>
                  <div class=\"font-bold text-lg\">${a.rank || ''} ${a.name || 'Anonymous'}</div>
                  <div style=\"color:var(--text-blue-200);font-size:0.875rem\">${a.title || 'Untitled'}</div>
                </div>
                ${!a.is_approved ? '<span class=\"badge\" style=\"background-color:#f59e0b;color:#000\">Pending</span>' : '<span class=\"badge\" style=\"background-color:#10b981;color:#fff\">Approved</span>'}
              </div>
              <div style=\"margin-bottom:1rem;border-top:1px solid var(--border-color);padding-top:1rem\">
                <div style=\"font-size:0.875rem;color:var(--text-blue-300);margin-bottom:0.5rem\">
                  <strong>Camp:</strong> ${a.camp_name || 'N/A'}
                </div>
                <div style=\"font-size:0.875rem;color:var(--text-blue-300);margin-bottom:0.5rem\">
                  <strong>College:</strong> ${a.college_name || 'N/A'}
                </div>
                <div style=\"font-size:0.875rem;color:var(--text-blue-300)\">
                  ${a.is_special ? '<span class=\"badge\" style=\"background-color:#8b5cf6;color:#fff;margin-right:0.5rem\">Special</span>' : ''}
                  Created: ${formatDate(a.created_at)}
                </div>
              </div>
              <div style=\"display:flex;gap:0.5rem;justify-content:flex-end\">
                ${!a.is_approved ? `<button class=\"btn btn-primary btn-sm\" onclick=\"approveAchievement(''${a.id}'')\">Approve</button>` : ''}
                <button class=\"btn btn-sm\" style=\"background:var(--card-bg)\" onclick=\"deleteAchievement(''${a.id}'')\">Delete</button>
              </div>
            </div>
            `).join('')}
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class=\"text-error p-4\">Error loading achievements: ${err.message}</div>`;
  }
}

function showAddAchievementModal() {
  openModal(`
    <h3 class=\"text-xl font-bold mb-4\">Add Achievement</h3>
    <form id=\"add-achievement-form\" onsubmit=\"createAchievement(event)\">
      <div style=\"display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-bottom:1rem\">
        <input type=\"text\" name=\"title\" class=\"input\" placeholder=\"Title*\" required>
        <input type=\"text\" name=\"name\" class=\"input\" placeholder=\"Cadet Name*\" required>
        <input type=\"text\" name=\"rank\" class=\"input\" placeholder=\"Rank*\" required>
        <input type=\"text\" name=\"collegeName\" class=\"input\" placeholder=\"College Name*\" required>
        <input type=\"text\" name=\"campName\" class=\"input\" placeholder=\"Camp Name\">
        <input type=\"date\" name=\"date\" class=\"input\" title=\"Achievement Date\">
      </div>
      <textarea name=\"description\" class=\"input\" placeholder=\"Description\" style=\"width:100%;margin-bottom:1rem;min-height:80px\"></textarea>
      
      <div style=\"margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem;\">
        <input type=\"checkbox\" name=\"isSpecial\" id=\"isSpecial\" value=\"true\">
        <label for=\"isSpecial\" style=\"color:var(--text-blue-100)\">Flag as Special Achievement (Gallery)</label>
      </div>

      <div style=\"margin-bottom: 1.5rem;\">
        <label style=\"display:block;margin-bottom:0.5rem;color:var(--text-blue-100)\">Camp/Achievement Photos</label>
        <input type=\"file\" name=\"campPhotos\" class=\"input\" accept=\"image/*\" multiple>
      </div>

      <div style=\"display:flex;justify-content:flex-end;gap:1rem\">
        <button type=\"button\" class=\"btn\" style=\"background:var(--card-bg)\" onclick=\"closeModal()\">Cancel</button>
        <button type=\"submit\" class=\"btn btn-primary\">Save Achievement</button>
      </div>
    </form>
  `);
}

async function createAchievement(e) {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  
  if (formData.get('isSpecial') === 'true') {
    formData.set('isSpecial', 'true');
  } else {
    formData.set('isSpecial', 'false');
  }

  const submitBtn = form.querySelector('button[type=\"submit\"]');
  const ogText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';

  try {
    await api.postFormData('/achievements', formData);
    showToast('Achievement added and approved', 'success');
    closeModal();
    loadAdminAchievements(document.getElementById('admin-content'));
  } catch (err) {
    showToast(err.message, 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = ogText;
  }
}

async function approveAchievement(id) {
  if(!confirm('Approve this achievement for gallery?')) return;
  try {
    await api.request('PATCH', '/achievements/' + id + '/approve');
    showToast('Achievement approved', 'success');
    loadAdminAchievements(document.getElementById('admin-content'));
  } catch(err) {
    try {
        await api.put('/achievements/' + id, { isApproved: true });
        showToast('Achievement approved via PUT', 'success');
        loadAdminAchievements(document.getElementById('admin-content'));
    } catch(err2) {
        showToast(err.message, 'error');
    }
  }
}

async function deleteAchievement(id) {
  if(!confirm('Delete this achievement forever?')) return;
  try {
    await api.delete('/achievements/' + id);
    showToast('Deleted achievement', 'info');
    loadAdminAchievements(document.getElementById('admin-content'));
  } catch (err) {
    showToast(err.message, 'error');
  }
}

window.loadAdminAchievements = loadAdminAchievements;
window.showAddAchievementModal = showAddAchievementModal;
window.createAchievement = createAchievement;
window.approveAchievement = approveAchievement;
window.deleteAchievement = deleteAchievement;

