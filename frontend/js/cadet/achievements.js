// =============================================
// Cadet Achievements View
// =============================================

/**
 * Load and display cadet's achievements with approval status
 */
async function loadCadetAchievements(container) {
  container.innerHTML = '<div class="text-center p-8" style="color:var(--text-blue-200)">Loading achievements...</div>';

  try {
    const cadet = JSON.parse(localStorage.getItem('ncc_cadet') || '{}');
    const data = await api.get(`/achievements/cadet/${cadet.id}`);
    const achievements = Array.isArray(data) ? data : (data.achievements || []);

    // Get approval status counts for stats
    const approved = achievements.filter(a => a.isApproved).length;
    const pending = achievements.filter(a => !a.isApproved && !a.isSpecial).length;
    const special = achievements.filter(a => a.isSpecial).length;

    container.innerHTML = `
      <div class="fade-in">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
          <h3 class="font-bold text-lg">My Achievements</h3>
          <button class="btn btn-primary" onclick="showSubmitAchievementModal()">+ Submit Achievement</button>
        </div>

        <div class="stats-grid mb-6">
          <div class="stat-card">
            <div class="stat-card-value" style="color:var(--text-yellow-400)">${achievements.length}</div>
            <div class="stat-card-label">Total Submissions</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-value" style="color:var(--text-green-400)">${approved}</div>
            <div class="stat-card-label">Approved</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-value" style="color:var(--text-yellow-500)">${pending}</div>
            <div class="stat-card-label">Pending</div>
          </div>
          <div class="stat-card">
            <div class="stat-card-value" style="color:var(--text-purple-400)">${special}</div>
            <div class="stat-card-label">Special</div>
          </div>
        </div>

        <div id="achievements-list">
          ${achievements.length ? achievements.map(a => `
            <div class="card" style="padding:1.5rem;margin-bottom:1rem;border-left:4px solid ${
              a.isSpecial ? '#8b5cf6' : (a.isApproved ? '#10b981' : '#f59e0b')
            }">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem">
                <div>
                  <div class="font-bold text-lg">${a.title || 'N/A'}</div>
                  <div style="color:var(--text-blue-300);font-size:0.875rem">${a.name || 'Unnamed Achievement'}</div>
                </div>
                <div style="display:flex;gap:0.5rem;flex-wrap:wrap;justify-content:flex-end">
                  ${a.isSpecial ? `<span class="badge" style="background-color:#8b5cf6;color:#fff">Special</span>` : ''}
                  ${a.isApproved ? 
                    `<span class="badge" style="background-color:#10b981;color:#fff">Approved</span>` : 
                    `<span class="badge" style="background-color:#f59e0b;color:#000">Pending</span>`
                  }
                </div>
              </div>

              <div style="margin-bottom:1rem;border-top:1px solid var(--border-color);padding-top:1rem">
                <div style="font-size:0.875rem;color:var(--text-blue-300);margin-bottom:0.5rem">
                  <strong>Category:</strong> ${a.category || 'N/A'}
                </div>
                <div style="font-size:0.875rem;color:var(--text-blue-300);margin-bottom:0.5rem">
                  <strong>Level:</strong> ${a.level || 'N/A'} ${a.rank ? ` • Rank: ${a.rank}` : ''}
                </div>
                <div style="font-size:0.875rem;color:var(--text-blue-300);margin-bottom:0.5rem">
                  <strong>Date Awarded:</strong> ${formatDate(a.dateAwarded) || 'N/A'}
                </div>
                <div style="font-size:0.875rem;color:var(--text-blue-300);margin-bottom:0.5rem">
                  <strong>Camp:</strong> ${a.campName || 'N/A'} | <strong>College:</strong> ${a.collegeName || 'N/A'}
                </div>
                ${a.description ? `
                  <div style="font-size:0.875rem;color:var(--text-blue-200);margin-top:0.75rem">
                    <strong>Description:</strong> ${a.description}
                  </div>
                ` : ''}
              </div>

              ${a.certificate ? `
                <div style="margin-bottom:1rem">
                  <a href="${a.certificate}" target="_blank" class="text-blue-400 text-sm underline">
                    📄 View Certificate
                  </a>
                </div>
              ` : ''}

              ${a.campPhotos && a.campPhotos.length > 0 ? `
                <div style="margin-bottom:1rem">
                  <div style="font-size:0.875rem;color:var(--text-blue-300);margin-bottom:0.5rem">
                    <strong>Camp Photos (${a.campPhotos.length}):</strong>
                  </div>
                  <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
                    ${a.campPhotos.map((photo, idx) => `
                      <a href="${photo}" target="_blank" class="text-blue-400 text-sm underline">
                        Photo ${idx + 1}
                      </a>
                    `).join('')}
                  </div>
                </div>
              ` : ''}

              <div style="padding-top:1rem;border-top:1px solid var(--border-color);font-size:0.75rem;color:var(--text-blue-400)">
                Submitted: ${formatDate(a.createdAt) || 'N/A'}
              </div>
            </div>
          `).join('') : `
            <div class="empty-state">
              <div class="empty-state-icon">🏅</div>
              <h3>No achievements yet</h3>
              <p>Start submitting your achievements to build your profile!</p>
              <button class="btn btn-primary" onclick="showSubmitAchievementModal()" style="margin-top:1rem">
                Submit Your First Achievement
              </button>
            </div>
          `}
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="card text-center p-8"><p style="color:var(--text-red-400)">Error: ${err.message}</p></div>`;
  }
}

/**
 * Show modal to submit new achievement
 */
async function showSubmitAchievementModal() {
  openModal(`
    <div class="modal-header">
      <h2 class="modal-title">Submit Achievement</h2>
      <button class="modal-close" onclick="closeModal()">✕</button>
    </div>
    <form onsubmit="submitAchievement(event)" id="achievement-form" style="max-height:70vh;overflow-y:auto">
      <div class="form-group">
        <label class="form-label">Achievement Title *</label>
        <input 
          type="text" 
          name="title" 
          class="form-control" 
          placeholder="e.g., Best Marksmanship Award"
          required
        >
      </div>

      <div class="form-group">
        <label class="form-label">Description *</label>
        <textarea 
          name="description" 
          class="form-control" 
          placeholder="Describe your achievement and what you did to earn it"
          rows="3"
          required
        ></textarea>
      </div>

      <div class="grid grid-2">
        <div class="form-group">
          <label class="form-label">Date Awarded *</label>
          <input 
            type="date" 
            name="dateAwarded" 
            class="form-control"
            required
          >
        </div>
        <div class="form-group">
          <label class="form-label">Category *</label>
          <select name="category" class="form-control" required>
            <option value="">Select Category</option>
            <option value="Best Cadet">Best Cadet</option>
            <option value="Firing">Firing</option>
            <option value="Drill">Drill</option>
            <option value="Sports">Sports</option>
            <option value="Social Service">Social Service</option>
            <option value="Camp">Camp</option>
            <option value="Academic">Academic</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div class="grid grid-2">
        <div class="form-group">
          <label class="form-label">Level *</label>
          <select name="level" class="form-control" required>
            <option value="">Select Level</option>
            <option value="Unit">Unit Level</option>
            <option value="Group">Group Level</option>
            <option value="Directorate">Directorate Level</option>
            <option value="National">National Level</option>
            <option value="International">International Level</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Rank/Position *</label>
          <select name="rank" class="form-control" required>
            <option value="">Select Rank</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Bronze">Bronze</option>
            <option value="First">First</option>
            <option value="Second">Second</option>
            <option value="Third">Third</option>
            <option value="Winner">Winner</option>
            <option value="Finalist">Finalist</option>
            <option value="Participant">Participant</option>
          </select>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Your Name *</label>
        <input 
          type="text" 
          name="name" 
          class="form-control" 
          placeholder="Your full name"
          required
        >
      </div>

      <div class="grid grid-2">
        <div class="form-group">
          <label class="form-label">Camp Name *</label>
          <input 
            type="text" 
            name="campName" 
            class="form-control" 
            placeholder="e.g., Summer Leadership Camp 2025"
            required
          >
        </div>
        <div class="form-group">
          <label class="form-label">College Name *</label>
          <input 
            type="text" 
            name="collegeName" 
            class="form-control" 
            placeholder="e.g., MIT Pune"
            required
          >
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Certificate (PDF/Image) *</label>
        <input 
          type="file" 
          name="certificate" 
          class="form-control" 
          accept=".pdf,.jpg,.jpeg,.png"
          required
        >
        <small style="color:var(--text-blue-300)">PDF, JPG, or PNG (max 4MB)</small>
      </div>

      <div class="form-group">
        <label class="form-label">Camp Photos (Optional)</label>
        <input 
          type="file" 
          name="campPhotos" 
          class="form-control" 
          accept=".jpg,.jpeg,.png"
          multiple
        >
        <small style="color:var(--text-blue-300)">JPG or PNG (multiple files allowed, max 4MB each)</small>
      </div>

      <div style="display:flex;gap:1rem;margin-top:2rem">
        <button type="submit" class="btn btn-primary" style="flex:1">Submit Achievement</button>
        <button type="button" class="btn btn-secondary" style="flex:1" onclick="closeModal()">Cancel</button>
      </div>
    </form>
  `);
}

/**
 * Submit new achievement with file uploads using FormData
 */
async function submitAchievement(event) {
  event.preventDefault();
  
  const form = document.getElementById('achievement-form');
  const formData = new FormData(form);

  try {
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';

    // Submit using postFormData for multipart support
    const response = await api.postFormData('/achievements', formData);
    
    showToast('Achievement submitted successfully! Awaiting approval.', 'success');
    closeModal();
    
    // Refresh the achievements list
    const cadetContent = document.getElementById('cadet-content');
    if (cadetContent) loadCadetAchievements(cadetContent);

  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
  } finally {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText || 'Submit Achievement';
    }
  }
}

// Export functions globally for HTML onclick handlers
window.loadCadetAchievements = loadCadetAchievements;
window.showSubmitAchievementModal = showSubmitAchievementModal;
window.submitAchievement = submitAchievement;

