// =============================================
// Attendance Model
// =============================================
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  cadetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cadet', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent', 'late', 'excused', 'pending'], default: 'pending' },
  // GPS Verification
  gpsLatitude: { type: Number, default: null },
  gpsLongitude: { type: Number, default: null },
  gpsVerified: { type: Boolean, default: false },
  // Photo Verification
  photoUrl: { type: String, default: null },
  // Admin review
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  reviewedAt: { type: Date, default: null },
  remarks: { type: String, trim: true, default: '' },
  // Camp reference (optional)
  campId: { type: mongoose.Schema.Types.ObjectId, ref: 'Camp', default: null },
}, {
  timestamps: true
});

// Compound index to prevent duplicate attendance
attendanceSchema.index({ cadetId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
