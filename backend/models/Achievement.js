// =============================================
// Achievement Model
// =============================================
const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  cadetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cadet', required: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, enum: ['Academic', 'Sports', 'Camp', 'Social Service', 'Best Cadet', 'Firing', 'Drill', 'Other'], required: true },
  description: { type: String, trim: true },
  dateAwarded: { type: Date, required: true },
  awardedBy: { type: String, trim: true },
  certificateUrl: { type: String, default: null },
  level: { type: String, enum: ['Unit', 'Group', 'Directorate', 'National', 'International'], default: 'Unit' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true
});

achievementSchema.index({ cadetId: 1, category: 1 });

module.exports = mongoose.model('Achievement', achievementSchema);
