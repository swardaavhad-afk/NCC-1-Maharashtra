// =============================================
// Cadet Study Material Access
// =============================================
async function loadCadetStudyMaterials(container) {
  container.innerHTML = '<div class="text-center p-8" style="color:var(--text-blue-200)">Loading study materials...</div>';

  try {
    const data = await api.get('/study-materials');
    const { materials } = data;

    const categoryIcons = {
      'Drill': '🎯', 'Weapon Training': '🔫', 'Map Reading': '🗺️',
      'Field Craft': '🏕️', 'Administration': '📋', 'National Integration': '🇮🇳',
      'Social Service': '🤝', 'Health & Hygiene': '🏥', 'Disaster Management': '🚨'
    };

    container.innerHTML = `
      <div class="fade-in">
        <div class="tab-bar mb-6">
          <button class="tab-btn active" onclick="filterCadetMaterials('all', this)">All</button>
          <button class="tab-btn" onclick="filterCadetMaterials('Drill', this)">Drill</button>
          <button class="tab-btn" onclick="filterCadetMaterials('Weapon Training', this)">Weapon</button>
          <button class="tab-btn" onclick="filterCadetMaterials('Map Reading', this)">Map Reading</button>
          <button class="tab-btn" onclick="filterCadetMaterials('Field Craft', this)">Field Craft</button>
          <button class="tab-btn" onclick="filterCadetMaterials('Administration', this)">Admin</button>
        </div>

        <div class="grid grid-2" id="cadet-materials-grid">
          ${materials.map(m => `
            <div class="card material-card" data-category="${m.category}">
              <div style="display:flex;gap:1rem;align-items:flex-start">
                <div style="font-size:2rem">${categoryIcons[m.category] || '📄'}</div>
                <div style="flex:1">
                  <div class="font-bold">${m.title}</div>
                  <div class="text-sm" style="color:var(--text-blue-200)">${m.description || ''}</div>
                  <div style="display:flex;gap:0.5rem;margin-top:0.5rem;flex-wrap:wrap">
                    <span class="badge badge-blue">${m.category}</span>
                    <span class="badge badge-yellow">${m.year}</span>
                  </div>
                  <div class="text-xs mt-2" style="color:var(--text-blue-300)">${m.downloadCount} downloads • ${m.fileName || 'File'}</div>
                </div>
              </div>
              ${m.fileUrl ? `
                <a href="${m.fileUrl}" target="_blank" class="btn btn-primary btn-sm btn-block mt-4" onclick="trackDownload('${m._id}')">
                  📥 Download
                </a>
              ` : ''}
            </div>
          `).join('')}
        </div>

        ${!materials.length ? '<div class="empty-state"><div class="empty-state-icon">📚</div><h3>No study materials available</h3><p>Check back later for new materials.</p></div>' : ''}
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="card text-center p-8"><p style="color:var(--text-red-400)">Error: ${err.message}</p></div>`;
  }
}

function filterCadetMaterials(category, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#cadet-materials-grid .material-card').forEach(card => {
    card.style.display = (category === 'all' || card.dataset.category === category) ? '' : 'none';
  });
}

async function trackDownload(materialId) {
  try {
    await api.post(`/study-materials/${materialId}/download`);
  } catch (e) {
    // Silent fail for download tracking
  }
}
