// =============================================
// Admin Achievements Management
// =============================================
async function loadAdminAchievements(container) {
  container.innerHTML = '<div class="text-center p-8" style="color:var(--text-blue-200)">Loading achievements...</div>';

  try {
    const [achData, statsData] = await Promise.all([
      api.get('/achievements'),
      api.get('/achievements/stats')
    ]);
    const { achievements } = achData;
    const { total, byCategory } = statsData;

    const categoryColors = {
      'Best Cadet': 'yellow', 'Firing': 'red', 'Drill': 'blue',
      'Sports': 'green', 'Social Service': 'purple', 'Camp': 'blue',
      'Academic': 'yellow', 'Other': 'blue'
    };

    container.innerHTML = `
      <div class="fade-in">
        <div class="stats-grid" style="margin-bottom:1.5rem">
          <div class="stat-card">
            <div class="stat-card-value">${total}</div>
            <div class="stat-card-label">Total Achievements</div>
          </div>
          ${byCategory.slice(0, 3).map(c => `
            <div class="stat-card">
              <div class="stat-card-value">${c.count}</div>
              <div class="stat-card-label">${c._id}</div>
            </div>
          `).join('')}
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
          <h3 class="font-bold text-lg">All Achievements</h3>
          <button class="btn btn-primary" onclick="showAddAchievementModal()">+ Add Achievement</button>
        </div>

        <div id="achievements-list">
          ${achievements.map(a => `
            <div class="achievement-item">
              <div style="display:flex;justify-content:space-between;align-items:flex-start">
                <div>
                  <div class="achievement-category" style="color:var(--text-${categoryColors[a.category] || 'blue'}-400)">${a.category}</div>
                  <div class="font-bold text-lg mb-2">${a.title}</div>
                  <div class="text-sm" style="color:var(--text-blue-200)">${a.description || ''}</div>
                  <div class="text-xs mt-2" style="color:var(--text-blue-300)">
                    ${a.cadetId?.cadetName || 'Unknown'} • ${formatDate(a.dateAwarded)} • <span class="badge badge-blue">${a.level}</span>
                  </div>
                </div>
                <button class="btn btn-danger btn-sm" onclick="deleteAchievement('${a._id}')">Delete</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="card text-center p-8"><p style="color:var(--text-red-400)">Error: ${err.message}</p></div>`;
  }
}

async function showAddAchievementModal() {
  let cadets = [];
  try {
    const data = await api.get('/cadets');
    cadets = data.cadets;
  } catch (e) {}

  openModal(`
    <div class="modal-header">
      <h2 class="modal-title">Add Achievement</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <form onsubmit="createAchievement(event)">
      <div class="form-group">
        <label class="form-label">Cadet *</label>
        <select name="cadetId" class="form-control" required>
          <option value="">Select Cadet</option>
          ${cadets.map(c => `<option value="${c._id}">${c.cadetName} (${c.enrollmentNumber})</option>`).join('')}
        </select>
      </div>
      <div class="form-group"><label class="form-label">Title *</label><input type="text" name="title" class="form-control" required></div>
      <div class="grid grid-2">
        <div class="form-group">
          <label class="form-label">Category *</label>
          <select name="category" class="form-control" required>
            <option value="Academic">Academic</option><option value="Sports">Sports</option>
            <option value="Camp">Camp</option><option value="Social Service">Social Service</option>
            <option value="Best Cadet">Best Cadet</option><option value="Firing">Firing</option>
            <option value="Drill">Drill</option><option value="Other">Other</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Level</label>
          <select name="level" class="form-control">
            <option value="Unit">Unit</option><option value="Group">Group</option>
            <option value="Directorate">Directorate</option><option value="National">National</option>
            <option value="International">International</option>
          </select>
        </div>
      </div>
      <div class="form-group"><label class="form-label">Date Awarded *</label><input type="date" name="dateAwarded" class="form-control" required></div>
      <div class="form-group"><label class="form-label">Awarded By</label><input type="text" name="awardedBy" class="form-control"></div>
      <div class="form-group"><label class="form-label">Description</label><textarea name="description" class="form-control"></textarea></div>
      <button type="submit" class="btn btn-primary btn-block">Add Achievement</button>
    </form>
  `);
}

async function createAchievement(e) {
  e.preventDefault();
  try {
    await api.post('/achievements', getFormData(e.target));
    closeModal();
    showToast('Achievement added!', 'success');
    loadAdminAchievements(document.getElementById('admin-content'));
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteAchievement(id) {
  if (!confirm('Delete this achievement?')) return;
  try {
    await api.delete(`/achievements/${id}`);
    showToast('Achievement deleted', 'success');
    loadAdminAchievements(document.getElementById('admin-content'));
  } catch (err) {
    showToast(err.message, 'error');
  }
}
