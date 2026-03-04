// =============================================
// Cadet Model - Full Cadet Portfolio
// =============================================
const mongoose = require('mongoose');

const cadetSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // Personal Information
  cadetName: { type: String, required: true, trim: true },
  fatherName: { type: String, required: true, trim: true },
  motherName: { type: String, required: true, trim: true },
  dob: { type: Date, required: true },
  bloodGroup: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], required: true },
  aadharNumber: { type: String, required: true, trim: true },
  // Contact Information
  cadetMobile: { type: String, required: true, trim: true },
  fatherMobile: { type: String, required: true, trim: true },
  motherMobile: { type: String, trim: true },
  // Academic Information
  enrollmentNumber: { type: String, required: true, unique: true, trim: true },
  sdSw: { type: String, enum: ['SD', 'SW'], required: true },
  year: { type: String, enum: ['1st Year', '2nd Year', '3rd Year', '4th Year'], required: true },
  enrolledCourse: { type: String, required: true, trim: true },
  collegeName: { type: String, required: true, trim: true },
  university: { type: String, required: true, trim: true },
  // Address Information
  residentialAddress: { type: String, required: true, trim: true },
  pincode: { type: String, required: true, trim: true },
  nearbyRailwayStation: { type: String, trim: true },
  // Bank Information
  bankName: { type: String, trim: true },
  accountNumber: { type: String, trim: true },
  ifscCode: { type: String, trim: true },
  micrCode: { type: String, trim: true },
  // Status
  status: { type: String, enum: ['active', 'inactive', 'passed_out'], default: 'active' },
  profileImage: { type: String, default: null },
}, {
  timestamps: true
});

// Index for searching
cadetSchema.index({ cadetName: 'text', enrollmentNumber: 'text', collegeName: 'text' });

module.exports = mongoose.model('Cadet', cadetSchema);
