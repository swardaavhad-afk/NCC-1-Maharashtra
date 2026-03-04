// =============================================
// Cadet Dashboard Overview
// =============================================
async function loadCadetDashboard(container) {
  container.innerHTML = '<div class="text-center p-8" style="color:var(--text-blue-200)">Loading dashboard...</div>';

  try {
    const data = await api.get('/dashboard/cadet');
    const { cadetInfo, attendanceStats, upcomingCamps, achievements } = data;

    container.innerHTML = `
      <div class="fade-in">
        <!-- Welcome -->
        <div class="card mb-6" style="background:linear-gradient(135deg, rgba(30,58,138,0.5), rgba(30,64,175,0.3))">
          <h2 class="text-xl font-bold mb-2" style="color:var(--text-yellow-400)">Welcome, ${cadetInfo.cadetName}!</h2>
          <p style="color:var(--text-blue-200)">Enrollment: ${cadetInfo.enrollmentNumber} • ${cadetInfo.sdSw} • ${cadetInfo.year}</p>
          <p class="text-sm mt-1" style="color:var(--text-blue-300)">${cadetInfo.collegeName}</p>
        </div>

        <!-- Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-card-icon green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
            <div class="stat-card-value">${attendanceStats.present || 0}</div>
            <div class="stat-card-label">Days Present</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon yellow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
            <div class="stat-card-value">${attendanceStats.percentage || 0}%</div>
            <div class="stat-card-label">Attendance Rate</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon blue"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 18l9-6 9 6"/><path d="M3 12l9-6 9 6"/></svg></div>
            <div class="stat-card-value">${upcomingCamps.length}</div>
            <div class="stat-card-label">Upcoming Camps</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-icon red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 7 7 7 7"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 17 7 17 7"/><path d="M4 22h16"/><path d="M10 22V8h4v14"/></svg></div>
            <div class="stat-card-value">${achievements.length}</div>
            <div class="stat-card-label">Achievements</div>
          </div>
        </div>

        <div class="grid grid-2">
          <!-- Upcoming Camps -->
          <div class="card">
            <div class="card-header"><h3 class="card-title" style="color:var(--text-yellow-400)">Upcoming Camps</h3></div>
            ${upcomingCamps.length ? upcomingCamps.map(c => `
              <div style="padding:0.75rem 0;border-bottom:1px solid var(--border-color)">
                <div class="font-semibold text-sm">${c.name}</div>
                <div class="text-xs" style="color:var(--text-blue-200)">${formatDate(c.startDate)} - ${formatDate(c.endDate)}</div>
                <div class="text-xs" style="color:var(--text-blue-300)">${c.location}</div>
              </div>
            `).join('') : '<div class="empty-state"><p>No upcoming camps</p></div>'}
          </div>

          <!-- Recent Achievements -->
          <div class="card">
            <div class="card-header"><h3 class="card-title" style="color:var(--text-yellow-400)">My Achievements</h3></div>
            ${achievements.length ? achievements.slice(0, 5).map(a => `
              <div style="padding:0.5rem 0;border-bottom:1px solid var(--border-color)">
                <div class="font-semibold text-sm">${a.title}</div>
                <div class="text-xs" style="color:var(--text-blue-200)">${a.category} • ${formatDate(a.dateAwarded)}</div>
              </div>
            `).join('') : '<div class="empty-state"><p>No achievements yet</p></div>'}
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="card text-center p-8"><p style="color:var(--text-red-400)">Error: ${err.message}</p></div>`;
  }
}
