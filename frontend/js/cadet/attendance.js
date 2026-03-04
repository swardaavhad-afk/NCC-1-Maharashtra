// =============================================
// Cadet Attendance Submission
// =============================================
async function loadCadetAttendance(container) {
  container.innerHTML = '<div class="text-center p-8" style="color:var(--text-blue-200)">Loading attendance...</div>';

  try {
    const [historyData, statsData] = await Promise.all([
      api.get('/attendance/my'),
      api.get('/attendance/my-stats')
    ]);
    const records = historyData.records || historyData;
    const stats = statsData;

    container.innerHTML = `
      <div class="fade-in">
        <div class="grid grid-2 mb-6">
          <!-- Submit Attendance -->
          <div class="card">
            <div class="card-header"><h3 class="card-title" style="color:var(--text-yellow-400)">Mark Attendance</h3></div>
            <form onsubmit="submitAttendance(event)">
              <div class="form-group">
                <label class="form-label">Date</label>
                <input type="date" name="date" class="form-control" value="${new Date().toISOString().split('T')[0]}" required>
              </div>
              <div class="form-group">
                <label class="form-label">GPS Location</label>
                <div style="display:flex;gap:0.5rem">
                  <input type="text" id="gps-coords" class="form-control" placeholder="Click Capture" readonly>
                  <button type="button" class="btn btn-outline" onclick="captureGPS()">📍 Capture</button>
                </div>
                <input type="hidden" name="latitude" id="gps-lat">
                <input type="hidden" name="longitude" id="gps-lng">
              </div>
              <div class="form-group">
                <label class="form-label">Remarks</label>
                <textarea name="remarks" class="form-control" placeholder="Optional remarks..."></textarea>
              </div>
              <button type="submit" class="btn btn-primary btn-block">Submit Attendance</button>
            </form>
          </div>

          <!-- Stats -->
          <div class="card">
            <div class="card-header"><h3 class="card-title" style="color:var(--text-yellow-400)">My Stats</h3></div>
            <div style="text-align:center;padding:1rem">
              <div style="font-size:3rem;font-weight:800;color:var(--text-yellow-400)">${stats.percentage || 0}%</div>
              <div class="text-sm" style="color:var(--text-blue-200)">Attendance Rate</div>
            </div>
            <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap">
              <div class="text-center"><div class="font-bold" style="color:var(--text-green-400)">${stats.present || 0}</div><div class="text-xs">Present</div></div>
              <div class="text-center"><div class="font-bold" style="color:var(--text-red-400)">${stats.absent || 0}</div><div class="text-xs">Absent</div></div>
              <div class="text-center"><div class="font-bold" style="color:var(--text-yellow-400)">${stats.pending || 0}</div><div class="text-xs">Pending</div></div>
              <div class="text-center"><div class="font-bold" style="color:var(--text-purple-400)">${stats.late || 0}</div><div class="text-xs">Late</div></div>
            </div>
          </div>
        </div>

        <!-- History -->
        <div class="table-container">
          <div class="table-header"><h3 class="font-bold">Attendance History</h3></div>
          <div style="overflow-x:auto">
            <table>
              <thead>
                <tr><th>Date</th><th>Status</th><th>GPS</th><th>Reviewed By</th><th>Remarks</th></tr>
              </thead>
              <tbody>
                ${(Array.isArray(records) ? records : []).map(r => `
                  <tr>
                    <td>${formatDate(r.date)}</td>
                    <td><span class="badge badge-${r.status === 'present' ? 'green' : r.status === 'pending' ? 'yellow' : r.status === 'late' ? 'purple' : 'red'}">${r.status}</span></td>
                    <td>${r.gpsVerified ? '✓' : '—'}</td>
                    <td class="text-sm">${r.reviewedBy?.fullName || '-'}</td>
                    <td class="text-sm">${r.remarks || '-'}</td>
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

function captureGPS() {
  if (!navigator.geolocation) {
    showToast('Geolocation not supported', 'error');
    return;
  }
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      document.getElementById('gps-lat').value = latitude;
      document.getElementById('gps-lng').value = longitude;
      document.getElementById('gps-coords').value = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
      showToast('GPS captured!', 'success');
    },
    (err) => showToast('GPS error: ' + err.message, 'error'),
    { enableHighAccuracy: true }
  );
}

async function submitAttendance(e) {
  e.preventDefault();
  const formData = getFormData(e.target);

  if (!formData.latitude || !formData.longitude) {
    showToast('Please capture GPS location first', 'error');
    return;
  }

  try {
    await api.post('/attendance', {
      date: formData.date,
      gpsCoordinates: { latitude: parseFloat(formData.latitude), longitude: parseFloat(formData.longitude) },
      remarks: formData.remarks
    });
    showToast('Attendance submitted!', 'success');
    loadCadetAttendance(document.getElementById('cadet-content'));
  } catch (err) {
    showToast(err.message, 'error');
  }
}
