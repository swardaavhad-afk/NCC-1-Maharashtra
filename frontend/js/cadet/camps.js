// =============================================
// Cadet Camps View
// =============================================
async function loadCadetCamps(container) {
  container.innerHTML = '<div class="text-center p-8" style="color:var(--text-blue-200)">Loading camps...</div>';

  try {
    const data = await api.get('/camps');
    const { camps } = data;
    const statusColors = { upcoming: 'blue', ongoing: 'green', completed: 'yellow', cancelled: 'red' };

    container.innerHTML = `
      <div class="fade-in">
        <div class="tab-bar mb-6">
          <button class="tab-btn active" onclick="filterCadetCamps('all', this)">All Camps</button>
          <button class="tab-btn" onclick="filterCadetCamps('upcoming', this)">Upcoming</button>
          <button class="tab-btn" onclick="filterCadetCamps('ongoing', this)">Ongoing</button>
          <button class="tab-btn" onclick="filterCadetCamps('completed', this)">Completed</button>
        </div>

        <div class="grid grid-2" id="cadet-camps-grid">
          ${camps.map(c => {
            const user = JSON.parse(localStorage.getItem('ncc_user') || '{}');
            const isRegistered = (c.registeredCadets || []).some(r => r.cadet === user.cadetId || r === user.cadetId);
            return `
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
                  <span class="text-xs" style="color:var(--text-blue-200)">${(c.registeredCadets || []).length}/${c.maxCadets}</span>
                </div>
                ${c.status === 'upcoming' && !isRegistered ? `
                  <button class="btn btn-primary btn-sm btn-block mt-4" onclick="registerForCamp('${c._id}')">Register</button>
                ` : isRegistered ? `
                  <div class="badge badge-green mt-4" style="width:100%;text-align:center;padding:0.5rem">Registered</div>
                ` : ''}
                ${c.description ? `<p class="text-xs mt-2" style="color:var(--text-blue-300)">${c.description}</p>` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="card text-center p-8"><p style="color:var(--text-red-400)">Error: ${err.message}</p></div>`;
  }
}

function filterCadetCamps(status, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#cadet-camps-grid .camp-card').forEach(card => {
    card.style.display = (status === 'all' || card.dataset.status === status) ? '' : 'none';
  });
}

async function registerForCamp(campId) {
  try {
    await api.post(`/camps/${campId}/register`);
    showToast('Registered for camp!', 'success');
    loadCadetCamps(document.getElementById('cadet-content'));
  } catch (err) {
    showToast(err.message, 'error');
  }
}
