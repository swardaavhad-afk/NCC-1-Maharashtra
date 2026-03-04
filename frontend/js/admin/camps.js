// =============================================
// Admin Camp Management
// =============================================
async function loadAdminCamps(container) {
  container.innerHTML = '<div class="text-center p-8" style="color:var(--text-blue-200)">Loading camps...</div>';

  try {
    const data = await api.get('/camps');
    const { camps } = data;

    const statusColors = { upcoming: 'blue', ongoing: 'green', completed: 'yellow', cancelled: 'red' };

    container.innerHTML = `
      <div class="fade-in">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem">
          <div class="tab-bar">
            <button class="tab-btn active" onclick="filterCamps('all', this)">All</button>
            <button class="tab-btn" onclick="filterCamps('upcoming', this)">Upcoming</button>
            <button class="tab-btn" onclick="filterCamps('ongoing', this)">Ongoing</button>
            <button class="tab-btn" onclick="filterCamps('completed', this)">Completed</button>
          </div>
          <button class="btn btn-primary" onclick="showAddCampModal()">+ Add Camp</button>
        </div>
        <div class="grid grid-2" id="camps-grid">
          ${camps.map(c => `
            <div class="camp-card" data-status="${c.status}">
              <div class="camp-card-type" style="color:var(--text-${statusColors[c.status] || 'blue'}-400)">${c.type}</div>
              <div class="camp-card-title">${c.name}</div>
              <div class="camp-card-detail">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
                ${formatDate(c.startDate)} - ${formatDate(c.endDate)}
              </div>
              <div class="camp-card-detail">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                ${c.location}
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1rem">
                <span class="badge badge-${statusColors[c.status] || 'blue'}">${c.status}</span>
                <span class="text-xs" style="color:var(--text-blue-200)">${(c.registeredCadets || []).length}/${c.maxCadets} cadets</span>
              </div>
              <div style="margin-top:1rem;display:flex;gap:0.5rem">
                <button class="btn btn-outline btn-sm" onclick="deleteCampItem('${c._id}')">Delete</button>
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

function filterCamps(status, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#camps-grid .camp-card').forEach(card => {
    card.style.display = (status === 'all' || card.dataset.status === status) ? '' : 'none';
  });
}

function showAddCampModal() {
  openModal(`
    <div class="modal-header">
      <h2 class="modal-title">Add New Camp</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <form onsubmit="createCamp(event)">
      <div class="form-group"><label class="form-label">Camp Name *</label><input type="text" name="name" class="form-control" required></div>
      <div class="form-group">
        <label class="form-label">Type *</label>
        <select name="type" class="form-control" required>
          <option value="Annual Training Camp">Annual Training Camp</option>
          <option value="Combined Annual Training Camp">CATC</option>
          <option value="National Integration Camp">NIC</option>
          <option value="Thal Sainik Camp">TSC</option>
          <option value="Republic Day Camp">RDC</option>
          <option value="Independence Day Camp">IDC</option>
          <option value="Special Camp">Special Camp</option>
        </select>
      </div>
      <div class="grid grid-2">
        <div class="form-group"><label class="form-label">Start Date *</label><input type="date" name="startDate" class="form-control" required></div>
        <div class="form-group"><label class="form-label">End Date *</label><input type="date" name="endDate" class="form-control" required></div>
      </div>
      <div class="form-group"><label class="form-label">Location *</label><input type="text" name="location" class="form-control" required></div>
      <div class="form-group"><label class="form-label">Max Cadets</label><input type="number" name="maxCadets" class="form-control" value="50"></div>
      <div class="form-group"><label class="form-label">Description</label><textarea name="description" class="form-control"></textarea></div>
      <button type="submit" class="btn btn-primary btn-block">Create Camp</button>
    </form>
  `);
}

async function createCamp(e) {
  e.preventDefault();
  try {
    const data = getFormData(e.target);
    await api.post('/camps', data);
    closeModal();
    showToast('Camp created!', 'success');
    loadAdminCamps(document.getElementById('admin-content'));
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteCampItem(campId) {
  if (!confirm('Delete this camp?')) return;
  try {
    await api.delete(`/camps/${campId}`);
    showToast('Camp deleted', 'success');
    loadAdminCamps(document.getElementById('admin-content'));
  } catch (err) {
    showToast(err.message, 'error');
  }
}
