// =============================================
// Cadet Profile View
// =============================================
async function loadCadetProfile(container) {
  container.innerHTML = '<div class="text-center p-8" style="color:var(--text-blue-200)">Loading profile...</div>';

  try {
    const user = JSON.parse(localStorage.getItem('ncc_user') || '{}');
    const cadet = await api.get(`/cadets/${user.cadetId}`);

    container.innerHTML = `
      <div class="fade-in">
        <!-- Profile Header -->
        <div class="card mb-6" style="background:linear-gradient(135deg, rgba(30,58,138,0.5), rgba(30,64,175,0.3));text-align:center">
          <div style="width:80px;height:80px;border-radius:50%;background:var(--navy-600);display:inline-flex;align-items:center;justify-content:center;font-size:2rem;font-weight:bold;color:var(--text-yellow-400);margin-bottom:1rem">
            ${cadet.cadetName.charAt(0)}
          </div>
          <h2 class="text-xl font-bold">${cadet.cadetName}</h2>
          <p style="color:var(--text-blue-200)">${cadet.enrollmentNumber} • ${cadet.sdSw}</p>
          <p class="text-sm" style="color:var(--text-blue-300)">${cadet.collegeName}</p>
          <span class="badge badge-${cadet.status === 'active' ? 'green' : 'red'}" style="margin-top:0.5rem">${cadet.status}</span>
        </div>

        <div class="grid grid-2">
          <!-- Personal Information -->
          <div class="card">
            <div class="card-header"><h3 class="card-title" style="color:var(--text-yellow-400)">Personal Information</h3></div>
            <div class="profile-section">
              <div class="profile-field"><span class="profile-field-label">Full Name</span><span class="profile-field-value">${cadet.cadetName}</span></div>
              <div class="profile-field"><span class="profile-field-label">Father's Name</span><span class="profile-field-value">${cadet.fatherName}</span></div>
              <div class="profile-field"><span class="profile-field-label">Mother's Name</span><span class="profile-field-value">${cadet.motherName}</span></div>
              <div class="profile-field"><span class="profile-field-label">Date of Birth</span><span class="profile-field-value">${formatDate(cadet.dob)}</span></div>
              <div class="profile-field"><span class="profile-field-label">Blood Group</span><span class="profile-field-value">${cadet.bloodGroup}</span></div>
              <div class="profile-field"><span class="profile-field-label">Aadhar Number</span><span class="profile-field-value">${cadet.aadharNumber}</span></div>
              <div class="profile-field"><span class="profile-field-label">Identification Mark</span><span class="profile-field-value">${cadet.identificationMark || '-'}</span></div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="card">
            <div class="card-header"><h3 class="card-title" style="color:var(--text-yellow-400)">Contact Information</h3></div>
            <div class="profile-section">
              <div class="profile-field"><span class="profile-field-label">Mobile</span><span class="profile-field-value">${cadet.cadetMobile}</span></div>
              <div class="profile-field"><span class="profile-field-label">Parent Mobile 1</span><span class="profile-field-value">${cadet.parentMobile1}</span></div>
              <div class="profile-field"><span class="profile-field-label">Parent Mobile 2</span><span class="profile-field-value">${cadet.parentMobile2 || '-'}</span></div>
            </div>
          </div>

          <!-- Academic Information -->
          <div class="card">
            <div class="card-header"><h3 class="card-title" style="color:var(--text-yellow-400)">Academic Information</h3></div>
            <div class="profile-section">
              <div class="profile-field"><span class="profile-field-label">Enrollment No</span><span class="profile-field-value">${cadet.enrollmentNumber}</span></div>
              <div class="profile-field"><span class="profile-field-label">SD/SW</span><span class="profile-field-value">${cadet.sdSw}</span></div>
              <div class="profile-field"><span class="profile-field-label">Year</span><span class="profile-field-value">${cadet.year}</span></div>
              <div class="profile-field"><span class="profile-field-label">Course</span><span class="profile-field-value">${cadet.enrolledCourse}</span></div>
              <div class="profile-field"><span class="profile-field-label">College</span><span class="profile-field-value">${cadet.collegeName}</span></div>
              <div class="profile-field"><span class="profile-field-label">University</span><span class="profile-field-value">${cadet.university}</span></div>
            </div>
          </div>

          <!-- Address -->
          <div class="card">
            <div class="card-header"><h3 class="card-title" style="color:var(--text-yellow-400)">Address</h3></div>
            <div class="profile-section">
              <div class="profile-field"><span class="profile-field-label">Address</span><span class="profile-field-value">${cadet.residentialAddress}</span></div>
              <div class="profile-field"><span class="profile-field-label">Pincode</span><span class="profile-field-value">${cadet.pincode}</span></div>
            </div>
          </div>

          <!-- Bank Details -->
          <div class="card" style="grid-column: span 2">
            <div class="card-header"><h3 class="card-title" style="color:var(--text-yellow-400)">Bank Details</h3></div>
            <div class="profile-section">
              <div class="grid grid-2">
                <div class="profile-field"><span class="profile-field-label">Bank Name</span><span class="profile-field-value">${cadet.bankName || '-'}</span></div>
                <div class="profile-field"><span class="profile-field-label">Branch</span><span class="profile-field-value">${cadet.bankBranch || '-'}</span></div>
                <div class="profile-field"><span class="profile-field-label">Account No</span><span class="profile-field-value">${cadet.accountNumber || '-'}</span></div>
                <div class="profile-field"><span class="profile-field-label">IFSC Code</span><span class="profile-field-value">${cadet.ifscCode || '-'}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    container.innerHTML = `<div class="card text-center p-8"><p style="color:var(--text-red-400)">Error: ${err.message}</p></div>`;
  }
}
