// =============================================
// Camp Model
// =============================================
const mongoose = require('mongoose');

const campSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, enum: ['Annual Training Camp', 'Combined Annual Training Camp', 'National Integration Camp', 'Thal Sainik Camp', 'Republic Day Camp', 'Independence Day Camp', 'Special Camp', 'Other'], required: true },
  location: { type: String, required: true, trim: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String, trim: true },
  maxCadets: { type: Number, default: 50 },
  registeredCadets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cadet' }],
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true
});

module.exports = mongoose.model('Camp', campSchema);
