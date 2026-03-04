// =============================================
// Auth Controller
// =============================================
const User = require('../models/User');
const Cadet = require('../models/Cadet');
const { generateToken } = require('../middleware/auth');
const { createSupabaseUser, signInWithEmail } = require('../config/supabase');

// @desc    Register Admin/ANO
// @route   POST /api/auth/register/admin
exports.registerAdmin = async (req, res, next) => {
  try {
    const { fullName, email, password, phone, rank, designation, serviceId, unitAssignment } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user in MongoDB
    const user = await User.create({
      fullName, email, password, phone, role: 'admin',
      rank, designation, serviceId, unitAssignment
    });

    // Try to create in Supabase (non-blocking)
    try {
      const supaUser = await createSupabaseUser(email, password, { fullName, role: 'admin' });
      user.supabaseUserId = supaUser.user.id;
      await user.save();
    } catch (e) {
      console.log('Supabase user creation skipped:', e.message);
    }

    const token = generateToken(user._id, user.role);
    res.status(201).json({ token, user: user.toJSON() });
  } catch (error) {
    next(error);
  }
};

// @desc    Register Cadet
// @route   POST /api/auth/register/cadet
exports.registerCadet = async (req, res, next) => {
  try {
    const {
      cadetName, fatherName, motherName, dob, bloodGroup, aadharNumber,
      cadetMobile, fatherMobile, motherMobile,
      enrollmentNumber, sdSw, year, enrolledCourse, collegeName, university,
      residentialAddress, pincode, nearbyRailwayStation,
      bankName, accountNumber, ifscCode, micrCode,
      email, password
    } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Check if enrollment number exists
    const existingCadet = await Cadet.findOne({ enrollmentNumber });
    if (existingCadet) {
      return res.status(400).json({ error: 'Enrollment number already registered' });
    }

    // Create user account
    const user = await User.create({
      fullName: cadetName, email, password, phone: cadetMobile, role: 'cadet'
    });

    // Create cadet profile
    const cadet = await Cadet.create({
      userId: user._id,
      cadetName, fatherName, motherName, dob, bloodGroup, aadharNumber,
      cadetMobile, fatherMobile, motherMobile,
      enrollmentNumber, sdSw, year, enrolledCourse, collegeName, university,
      residentialAddress, pincode, nearbyRailwayStation,
      bankName, accountNumber, ifscCode, micrCode
    });

    // Try to create in Supabase (non-blocking)
    try {
      const supaUser = await createSupabaseUser(email, password, { fullName: cadetName, role: 'cadet' });
      user.supabaseUserId = supaUser.user.id;
      await user.save();
    } catch (e) {
      console.log('Supabase user creation skipped:', e.message);
    }

    const token = generateToken(user._id, user.role);
    res.status(201).json({ token, user: user.toJSON(), cadet });
  } catch (error) {
    next(error);
  }
};

// @desc    Login User
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // If cadet, get cadet profile
    let cadetProfile = null;
    if (user.role === 'cadet') {
      cadetProfile = await Cadet.findOne({ userId: user._id });
    }

    const token = generateToken(user._id, user.role);
    res.json({ token, user: user.toJSON(), cadet: cadetProfile });
  } catch (error) {
    next(error);
  }
};

// @desc    Login Cadet by Enrollment Number
// @route   POST /api/auth/login/enrollment
exports.loginByEnrollment = async (req, res, next) => {
  try {
    const { enrollmentNumber, password } = req.body;

    const cadet = await Cadet.findOne({ enrollmentNumber });
    if (!cadet) {
      return res.status(401).json({ error: 'Invalid enrollment number' });
    }

    const user = await User.findById(cadet.userId);
    if (!user) {
      return res.status(401).json({ error: 'User account not found' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role);
    res.json({ token, user: user.toJSON(), cadet });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let cadetProfile = null;
    if (user.role === 'cadet') {
      cadetProfile = await Cadet.findOne({ userId: user._id });
    }
    res.json({ user: user.toJSON(), cadet: cadetProfile });
  } catch (error) {
    next(error);
  }
};
