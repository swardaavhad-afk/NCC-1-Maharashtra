// =============================================
// Cadet Achievements View
// =============================================
async function loadCadetAchievements(container) {
  container.innerHTML = '<div class="text-center p-8" style="color:var(--text-blue-200)">Loading achievements...</div>';

  try {
    const data = await api.get('/achievements/my');
    const achievements = data.achievements || data;

    const categoryColors = {
      'Best Cadet': 'yellow', 'Firing': 'red', 'Drill': 'blue',
      'Sports': 'green', 'Social Service': 'purple', 'Camp': 'blue',
      'Academic': 'yellow', 'Other': 'blue'
    };

    const levelIcons = {
      'Unit': '🏢', 'Group': '🏛️', 'Directorate': '🎖️',
      'National': '🇮🇳', 'International': '🌍'
    };

    container.innerHTML = `
      <div class="fade-in">
        <div class="stats-grid mb-6">
          <div class="stat-card">
            <div class="stat-card-value" style="color:var(--text-yellow-400)">${Array.isArray(achievements) ? achievements.length : 0}</div>
            <div class="stat-card-label">Total Achievements</div>
          </div>
        </div>

        <div id="achievements-list">
          ${(Array.isArray(achievements) ? achievements : []).length ? achievements.map(a => `
            <div class="achievement-item">
              <div style="display:flex;gap:1rem;align-items:flex-start">
                <div style="font-size:2rem">${levelIcons[a.level] || '🏅'}</div>
                <div style="flex:1">
                  <div class="achievement-category" style="color:var(--text-${categoryColors[a.category] || 'blue'}-400)">${a.category}</div>
                  <div class="font-bold text-lg">${a.title}</div>
                  <div class="text-sm mt-1" style="color:var(--text-blue-200)">${a.description || ''}</div>
                  <div class="text-xs mt-2" style="color:var(--text-blue-300)">
                    ${formatDate(a.dateAwarded)}
                    ${a.awardedBy ? ` • Awarded by: ${a.awardedBy}` : ''}
                    • <span class="badge badge-blue">${a.level}</span>
                  </div>
                </div>
              </div>
            </div>
          `).join('') : '<div class="empty-state"><div class="empty-state-icon">🏅</div><h3>No achievements yet</h3><p>Keep working hard and your achievements will appear here!</p></div>'}
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="card text-center p-8"><p style="color:var(--text-red-400)">Error: ${err.message}</p></div>`;
  }
}
