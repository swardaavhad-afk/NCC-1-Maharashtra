// =============================================
// Admin Dashboard Overview
// =============================================
async function loadAdminDashboard(container) {
  container.innerHTML = '<div class="text-center p-8" style="color:var(--text-blue-200)">Loading dashboard...</div>';

  try {
    const data = await api.get('/dashboard/admin');
    const { stats, recentAttendance, upcomingCampsList, recentAchievements } = data;

    container.innerHTML = `
      <div class="fade-in">
        <!-- Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-card-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
            <div class="stat-card-value">${stats.totalCadets}</div>
            <div class="stat-card-label">Active Cadets</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18l9-6 9 6"/><path d="M3 12l9-6 9 6"/></svg></div>
            <div class="stat-card-value">${stats.totalCamps}</div>
            <div class="stat-card-label">Total Camps</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon yellow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg></div>
            <div class="stat-card-value">${stats.pendingAttendance}</div>
            <div class="stat-card-label">Pending Reviews</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7"/><path d="M4 22h16"/><path d="M10 22V8h4v14"/></svg></div>
            <div class="stat-card-value">${stats.totalAchievements}</div>
            <div class="stat-card-label">Achievements</div>
          </div>
        </div>

        <div class="grid grid-2">
          <!-- Recent Activities -->
          <div class="card">
            <div class="card-header"><h3 class="card-title" style="color:var(--text-yellow-400)">Recent Attendance</h3></div>
            ${recentAttendance.length ? recentAttendance.map(a => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid var(--border-color)">
                <div>
                  <div class="font-semibold text-sm">${a.cadetId?.cadetName || 'Unknown'}</div>
                  <div class="text-xs" style="color:var(--text-blue-200)">${formatDate(a.date)}</div>
                </div>
                <span class="badge badge-${a.status === 'present' ? 'green' : a.status === 'pending' ? 'yellow' : 'red'}">${a.status}</span>
              </div>
            `).join('') : '<div class="empty-state"><p>No recent records</p></div>'}
          </div>

          <!-- Upcoming Camps -->
          <div class="card">
            <div class="card-header"><h3 class="card-title" style="color:var(--text-yellow-400)">Upcoming Camps</h3></div>
            ${upcomingCampsList.length ? upcomingCampsList.map(c => `
              <div style="padding:0.75rem 0;border-bottom:1px solid var(--border-color)">
                <div class="font-semibold text-sm">${c.name}</div>
                <div class="text-xs" style="color:var(--text-blue-200)">${formatDate(c.startDate)} - ${formatDate(c.endDate)}</div>
                <div class="text-xs" style="color:var(--text-blue-300)">${c.location}</div>
              </div>
            `).join('') : '<div class="empty-state"><p>No upcoming camps</p></div>'}
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="card text-center p-8"><p style="color:var(--text-red-400)">Error loading dashboard: ${err.message}</p><button class="btn btn-outline mt-4" onclick="switchAdminView('dashboard')">Retry</button></div>`;
  }
}
