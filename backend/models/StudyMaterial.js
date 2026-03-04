// =============================================
// Study Material Model
// =============================================
const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: { type: String, enum: ['Drill', 'Weapon Training', 'Map Reading', 'Field Craft', 'Administration', 'National Integration', 'Social Service', 'Health & Hygiene', 'Other'], required: true },
  year: { type: String, enum: ['1st Year', '2nd Year', '3rd Year', 'All Years'], required: true },
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  fileSize: { type: Number, default: 0 },
  fileType: { type: String, default: 'application/pdf' },
  downloadCount: { type: Number, default: 0 },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true
});

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
