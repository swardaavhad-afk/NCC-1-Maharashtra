// =============================================
// Admin Cadet Management
// =============================================
async function loadAdminCadets(container) {
  container.innerHTML = '<div class="text-center p-8" style="color:var(--text-blue-200)">Loading cadets...</div>';

  try {
    const data = await api.get('/cadets');
    const { cadets, total } = data;

    container.innerHTML = `
      <div class="fade-in">
        <div class="table-container">
          <div class="table-header">
            <h3 class="font-bold text-lg">All Cadets (${total})</h3>
            <div class="search-bar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input type="text" placeholder="Search cadets..." oninput="searchCadets(this.value)">
            </div>
          </div>
          <div style="overflow-x:auto">
            <table>
              <thead>
                <tr>
                  <th>Name</th><th>Enrollment No</th><th>Year</th><th>SD/SW</th><th>College</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody id="cadets-table-body">
                ${cadets.map(c => `
                  <tr>
                    <td class="font-semibold">${c.cadetName}</td>
                    <td style="color:var(--text-blue-300)">${c.enrollmentNumber}</td>
                    <td>${c.year}</td>
                    <td><span class="badge badge-blue">${c.sdSw}</span></td>
                    <td class="text-sm">${c.collegeName}</td>
                    <td><span class="badge badge-${c.status === 'active' ? 'green' : 'red'}">${c.status}</span></td>
                    <td>
                      <button class="btn btn-outline btn-sm" onclick="viewCadetProfile('${c.id}')">View</button>
                      <button class="btn btn-danger btn-sm" onclick="deleteCadet('${c.id}')">Delete</button>
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

async function viewCadetProfile(cadetId) {
  try {
    const cadet = await api.get(`/cadets/${cadetId}`);
    openModal(`
      <div class="modal-header">
        <h2 class="modal-title">${cadet.cadetName}</h2>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="profile-section">
        <div class="profile-section-title">Personal Information</div>
        <div class="profile-field"><span class="profile-field-label">Father's Name</span><span class="profile-field-value">${cadet.fatherName}</span></div>
        <div class="profile-field"><span class="profile-field-label">Mother's Name</span><span class="profile-field-value">${cadet.motherName}</span></div>
        <div class="profile-field"><span class="profile-field-label">DOB</span><span class="profile-field-value">${formatDate(cadet.dob)}</span></div>
        <div class="profile-field"><span class="profile-field-label">Blood Group</span><span class="profile-field-value">${cadet.bloodGroup}</span></div>
        <div class="profile-field"><span class="profile-field-label">Aadhar</span><span class="profile-field-value">${cadet.aadharNumber}</span></div>
      </div>
      <div class="profile-section">
        <div class="profile-section-title">Academic Information</div>
        <div class="profile-field"><span class="profile-field-label">Enrollment No</span><span class="profile-field-value">${cadet.enrollmentNumber}</span></div>
        <div class="profile-field"><span class="profile-field-label">SD/SW</span><span class="profile-field-value">${cadet.sdSw}</span></div>
        <div class="profile-field"><span class="profile-field-label">Year</span><span class="profile-field-value">${cadet.year}</span></div>
        <div class="profile-field"><span class="profile-field-label">Course</span><span class="profile-field-value">${cadet.enrolledCourse}</span></div>
        <div class="profile-field"><span class="profile-field-label">College</span><span class="profile-field-value">${cadet.collegeName}</span></div>
        <div class="profile-field"><span class="profile-field-label">University</span><span class="profile-field-value">${cadet.university}</span></div>
      </div>
      <div class="profile-section">
        <div class="profile-section-title">Contact & Address</div>
        <div class="profile-field"><span class="profile-field-label">Mobile</span><span class="profile-field-value">${cadet.cadetMobile}</span></div>
        <div class="profile-field"><span class="profile-field-label">Address</span><span class="profile-field-value">${cadet.residentialAddress}, ${cadet.pincode}</span></div>
      </div>
    `);
  } catch (err) {
    showToast(err.message, 'error');
  }
}

async function deleteCadet(cadetId) {
  if (!confirm('Are you sure you want to delete this cadet?')) return;
  try {
    await api.delete(`/cadets/${cadetId}`);
    showToast('Cadet deleted', 'success');
    loadAdminCadets(document.getElementById('admin-content'));
  } catch (err) {
    showToast(err.message, 'error');
  }
}

function searchCadets(query) {
  const rows = document.querySelectorAll('#cadets-table-body tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(query.toLowerCase()) ? '' : 'none';
  });
}
