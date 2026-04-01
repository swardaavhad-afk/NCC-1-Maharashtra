// =============================================
// Admin Attendance Management
// =============================================
async function loadAdminAttendance(container) {
  container.innerHTML = '<div class="text-center p-8" style="color:var(--text-blue-200)">Loading attendance...</div>';

  try {
    const data = await api.get('/attendance');
    const { records } = data;

    container.innerHTML = `
      <div class="fade-in">
        <div class="tab-bar">
          <button class="tab-btn active" onclick="filterAttendance('all', this)">All</button>
          <button class="tab-btn" onclick="filterAttendance('pending', this)">Pending</button>
          <button class="tab-btn" onclick="filterAttendance('present', this)">Present</button>
          <button class="tab-btn" onclick="filterAttendance('absent', this)">Absent</button>
          <button class="tab-btn" onclick="filterAttendance('late', this)">Late</button>
        </div>

        <div class="table-container">
          <div class="table-header">
            <h3 class="font-bold">Attendance Records</h3>
          </div>
          <div style="overflow-x:auto">
            <table>
              <thead>
                <tr><th>Cadet</th><th>Date</th><th>Status</th><th>GPS</th><th>Reviewed By</th><th>Actions</th></tr>
              </thead>
              <tbody id="attendance-table-body">
                ${records.map(r => `
                  <tr data-status="${r.status}">
                    <td class="font-semibold">${r.cadetId?.cadetName || 'Unknown'}<br><span class="text-xs" style="color:var(--text-blue-300)">${r.cadetId?.enrollmentNumber || ''}</span></td>
                    <td>${formatDate(r.date)}</td>
                    <td><span class="badge badge-${r.status === 'present' ? 'green' : r.status === 'pending' ? 'yellow' : r.status === 'late' ? 'purple' : 'red'}">${r.status}</span></td>
                    <td>${r.gpsVerified ? '<span class="badge badge-green">Verified</span>' : '<span class="badge badge-red">No</span>'}</td>
                    <td class="text-sm">${r.reviewedBy?.fullName || '-'}</td>
                    <td>
                      ${r.status === 'pending' ? `
                        <button class="btn btn-sm btn-secondary" onclick="reviewAttendance('${r.id}', 'present')">✓ Approve</button>
                        <button class="btn btn-sm btn-danger" onclick="reviewAttendance('${r.id}', 'absent')">✕ Reject</button>
                      ` : '—'}
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

function filterAttendance(status, btn) {
  document.querySelectorAll('.tab-bar .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('#attendance-table-body tr').forEach(row => {
    row.style.display = (status === 'all' || row.dataset.status === status) ? '' : 'none';
  });
}

async function reviewAttendance(id, status) {
  try {
    await api.put(`/attendance/${id}/review`, { status, remarks: '' });
    showToast(`Attendance ${status === 'present' ? 'approved' : 'rejected'}`, 'success');
    loadAdminAttendance(document.getElementById('admin-content'));
  } catch (err) {
    showToast(err.message, 'error');
  }
}
