// =============================================
// Cadet Attendance Submission
// =============================================
async function loadCadetAttendance(container) {
  container.innerHTML = '<div class="text-center p-8" style="color:var(--text-blue-200)">Loading attendance...</div>';

  try {
    const user = JSON.parse(localStorage.getItem('ncc_user') || '{}');
    const cadet = JSON.parse(localStorage.getItem('ncc_cadet') || '{}');
    const cadetId = cadet.id;
    let records = [];
    let stats = { present: 0, absent: 0, pending: 0, late: 0, percentage: 0 };
    if (cadetId) {
      const historyData = await api.get(`/attendance/cadet/${cadetId}`);
      records = Array.isArray(historyData) ? historyData : (historyData.records || []);
      // Calculate stats from records
      const present = records.filter(r => r.status === 'present').length;
      const absent = records.filter(r => r.status === 'absent').length;
      const pending = records.filter(r => r.status === 'pending').length;
      const late = records.filter(r => r.status === 'late').length;
      const total = records.length;
      stats = { present, absent, pending, late, percentage: total > 0 ? Math.round((present / total) * 100) : 0 };
    }

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
                  <input type="text" id="gps-coords" class="form-control" placeholder="Autofilled on Capture" readonly>
                </div>
                <input type="hidden" name="latitude" id="gps-lat">
                <input type="hidden" name="longitude" id="gps-lng">
              </div>
              <div class="form-group">
                <label class="form-label">Photo Identity (Camera)</label>
                <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                  <video id="camera-stream" autoplay playsinline style="width: 100%; border-radius: 8px; border: 1px solid var(--border-light); background: #000; align-self: center; display: none;"></video>
                  <canvas id="camera-canvas" style="display: none;"></canvas>
                  <img id="photo-preview" src="" style="width: 100%; border-radius: 8px; border: 1px solid var(--border-light); display: none;"/>
                  
                  <div style="display:flex; gap: 0.5rem;">
                    <button type="button" class="btn btn-outline flex-1" id="start-camera-btn" onclick="startCamera()">📷 Open Camera</button>
                    <button type="button" class="btn btn-primary flex-1" id="capture-photo-btn" onclick="capturePhoto()" style="display: none;">📸 Capture Photo & GPS</button>
                    <button type="button" class="btn btn-outline" id="retake-photo-btn" onclick="retakePhoto()" style="display: none;">🔄 Retake</button>
                  </div>
                </div>
                <input type="hidden" name="photoDataUrl" id="photo-data">
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
    const cadet = JSON.parse(localStorage.getItem('ncc_cadet') || '{}');
    await api.post('/attendance', {
      cadetId: cadet.id,
      date: formData.date,
      gpsLatitude: parseFloat(formData.latitude),
      gpsLongitude: parseFloat(formData.longitude),
      remarks: formData.remarks,
      photo: formData.photoDataUrl
    });
    showToast('Attendance submitted!', 'success');
    
    // Stop camera if still running
    stopCamera();
    
    loadCadetAttendance(document.getElementById('cadet-content'));
  } catch (err) {
    showToast(err.message, 'error');
  }
}

// Camera Globals
let cameraStream = null;

async function startCamera() {
  const video = document.getElementById('camera-stream');
  const startBtn = document.getElementById('start-camera-btn');
  const captureBtn = document.getElementById('capture-photo-btn');
  const preview = document.getElementById('photo-preview');
  const retakeBtn = document.getElementById('retake-photo-btn');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }, // Prefer back camera on mobile
      audio: false
    });
    
    cameraStream = stream;
    video.srcObject = stream;
    video.style.display = 'block';
    startBtn.style.display = 'none';
    captureBtn.style.display = 'flex';
    preview.style.display = 'none';
    retakeBtn.style.display = 'none';
    
    // reset hidden photo input
    document.getElementById('photo-data').value = "";
  } catch (err) {
    console.error("Camera error:", err);
    showToast('Could not access camera. Please allow permissions.', 'error');
  }
}

async function capturePhoto() {
  const video = document.getElementById('camera-stream');
  const canvas = document.getElementById('camera-canvas');
  const preview = document.getElementById('photo-preview');
  const captureBtn = document.getElementById('capture-photo-btn');
  const retakeBtn = document.getElementById('retake-photo-btn');
  
  if (!cameraStream) return;

  // Automatically start fetching GPS location when capturing the photo!
  captureGPS();

  // Set canvas scale and draw from video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert to DataURL (JPEG works best for forms)
  const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
  
  // Save to hidden form input for submission
  document.getElementById('photo-data').value = dataUrl;
  
  // Update UI Elements
  preview.src = dataUrl;
  preview.style.display = 'block';
  video.style.display = 'none';
  captureBtn.style.display = 'none';
  retakeBtn.style.display = 'inline-block';
  
  // Stop video track temporarily to save power
  stopCamera();
}

function retakePhoto() {
  startCamera();
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }
}

