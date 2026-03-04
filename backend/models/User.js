// =============================================
// User Model - Admin/ANO & Cadet Authentication
// =============================================
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['admin', 'cadet'], required: true },
  phone: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  supabaseUserId: { type: String, default: null },
  profileImage: { type: String, default: null },
  lastLogin: { type: Date, default: null },
  // Admin-specific fields
  rank: { type: String, default: null },
  designation: { type: String, default: null },
  serviceId: { type: String, default: null },
  unitAssignment: { type: String, default: null },
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
