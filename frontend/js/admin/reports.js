// =============================================
// Admin Reports
// =============================================
async function loadAdminReports(container) {
  container.innerHTML = '<div class="text-center p-8" style="color:var(--text-blue-200)">Loading reports...</div>';

  try {
    const data = await api.get('/reports/overview');

    container.innerHTML = `
      <div class="fade-in">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-card-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
            <div class="stat-card-value">${data.totalCadets}</div>
            <div class="stat-card-label">Total Cadets</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
            <div class="stat-card-value">${data.activeCadets}</div>
            <div class="stat-card-label">Active Cadets</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon yellow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18l9-6 9 6"/><path d="M3 12l9-6 9 6"/></svg></div>
            <div class="stat-card-value">${data.totalCamps}</div>
            <div class="stat-card-label">Total Camps</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7"/><path d="M4 22h16"/><path d="M10 22V8h4v14"/></svg></div>
            <div class="stat-card-value">${data.totalAchievements}</div>
            <div class="stat-card-label">Achievements</div>
          </div>
        </div>

        <div class="grid grid-2">
          <!-- Cadets by Year -->
          <div class="card">
            <div class="card-header"><h3 class="card-title" style="color:var(--text-yellow-400)">Cadets by Year</h3></div>
            ${data.cadetsByYear.map(y => `
              <div style="display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid var(--border-color)">
                <span>${y._id}</span>
                <span class="font-bold">${y.count}</span>
              </div>
            `).join('')}
          </div>

          <!-- Cadets by College -->
          <div class="card">
            <div class="card-header"><h3 class="card-title" style="color:var(--text-yellow-400)">Top Colleges</h3></div>
            ${data.cadetsByCollege.map(c => `
              <div style="display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid var(--border-color)">
                <span class="text-sm">${c._id}</span>
                <span class="font-bold">${c.count}</span>
              </div>
            `).join('')}
          </div>

          <!-- Attendance Stats -->
          <div class="card">
            <div class="card-header"><h3 class="card-title" style="color:var(--text-yellow-400)">Attendance Overview</h3></div>
            ${data.attendanceStats.map(s => `
              <div style="display:flex;justify-content:space-between;padding:0.5rem 0;border-bottom:1px solid var(--border-color)">
                <span class="badge badge-${s._id === 'present' ? 'green' : s._id === 'absent' ? 'red' : s._id === 'pending' ? 'yellow' : 'purple'}">${s._id}</span>
                <span class="font-bold">${s.count}</span>
              </div>
            `).join('')}
          </div>

          <!-- Recent Achievements -->
          <div class="card">
            <div class="card-header"><h3 class="card-title" style="color:var(--text-yellow-400)">Recent Achievements</h3></div>
            ${data.recentAchievements.map(a => `
              <div style="padding:0.5rem 0;border-bottom:1px solid var(--border-color)">
                <div class="font-semibold text-sm">${a.title}</div>
                <div class="text-xs" style="color:var(--text-blue-200)">${a.cadetId?.cadetName || 'Unknown'} • ${formatDate(a.dateAwarded)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="card text-center p-8"><p style="color:var(--text-red-400)">Error: ${err.message}</p></div>`;
  }
}
