// =============================================
// Admin Study Materials Management
// =============================================
async function loadAdminStudyMaterials(container) {
  container.innerHTML = '<div class="text-center p-8" style="color:var(--text-blue-200)">Loading materials...</div>';

  try {
    const data = await api.get('/study-materials');
    const { materials } = data;

    container.innerHTML = `
      <div class="fade-in">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem">
          <div class="tab-bar">
            <button class="tab-btn active" onclick="filterMaterials('all', this)">All</button>
            <button class="tab-btn" onclick="filterMaterials('1st Year', this)">1st Year</button>
            <button class="tab-btn" onclick="filterMaterials('2nd Year', this)">2nd Year</button>
            <button class="tab-btn" onclick="filterMaterials('3rd Year', this)">3rd Year</button>
            <button class="tab-btn" onclick="filterMaterials('All Years', this)">All Years</button>
          </div>
          <button class="btn btn-primary" onclick="showAddMaterialModal()">+ Upload Material</button>
        </div>

        <div class="table-container">
          <div style="overflow-x:auto">
            <table>
              <thead>
                <tr><th>Title</th><th>Category</th><th>Year</th><th>Downloads</th><th>Actions</th></tr>
              </thead>
              <tbody id="materials-table-body">
                ${materials.map(m => `
                  <tr data-year="${m.year}">
                    <td>
                      <div class="font-semibold">${m.title}</div>
                      <div class="text-xs" style="color:var(--text-blue-200)">${m.description || ''}</div>
                    </td>
                    <td><span class="badge badge-blue">${m.category}</span></td>
                    <td>${m.year}</td>
                    <td>${m.downloadCount}</td>
                    <td>
                      <button class="btn btn-outline btn-sm" onclick="deleteMaterial('${m._id}')">Delete</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="card text-center p-8"><p style="color:var(--text-red-400)">Error: ${err.message}</p></div>`;
  }
}

function filterMaterials(year, btn) {
  document.querySelectorAll('.tab-bar .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#materials-table-body tr').forEach(row => {
    row.style.display = (year === 'all' || row.dataset.year === year) ? '' : 'none';
  });
}

function showAddMaterialModal() {
  openModal(`
    <div class="modal-header">
      <h2 class="modal-title">Upload Study Material</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <form onsubmit="createMaterial(event)">
      <div class="form-group"><label class="form-label">Title *</label><input type="text" name="title" class="form-control" required></div>
      <div class="form-group"><label class="form-label">Description</label><textarea name="description" class="form-control"></textarea></div>
      <div class="grid grid-2">
        <div class="form-group">
          <label class="form-label">Category *</label>
          <select name="category" class="form-control" required>
            <option value="Drill">Drill</option><option value="Weapon Training">Weapon Training</option>
            <option value="Map Reading">Map Reading</option><option value="Field Craft">Field Craft</option>
            <option value="Administration">Administration</option><option value="National Integration">National Integration</option>
            <option value="Social Service">Social Service</option><option value="Health & Hygiene">Health & Hygiene</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Year *</label>
          <select name="year" class="form-control" required>
            <option value="1st Year">1st Year</option><option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option><option value="All Years">All Years</option>
          </select>
        </div>
      </div>
      <div class="form-group"><label class="form-label">File URL *</label><input type="url" name="fileUrl" class="form-control" placeholder="https://..." required></div>
      <div class="form-group"><label class="form-label">File Name *</label><input type="text" name="fileName" class="form-control" placeholder="document.pdf" required></div>
      <button type="submit" class="btn btn-primary btn-block">Upload Material</button>
    </form>
  `);
}

async function createMaterial(e) {
  e.preventDefault();
  try {
    await api.post('/study-materials', getFormData(e.target));
    closeModal();
    showToast('Material uploaded!', 'success');
    loadAdminStudyMaterials(document.getElementById('admin-content'));
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteMaterial(id) {
  if (!confirm('Delete this material?')) return;
  try {
    await api.delete(`/study-materials/${id}`);
    showToast('Material deleted', 'success');
    loadAdminStudyMaterials(document.getElementById('admin-content'));
  } catch (err) {
    showToast(err.message, 'error');
  }
}
