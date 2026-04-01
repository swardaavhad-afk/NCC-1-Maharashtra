// =============================================
// Auth Controller - Supabase Postgres
// =============================================
const bcrypt = require('bcryptjs');
const { supabaseAdmin, createSupabaseUser } = require('../config/supabase');
const { generateToken } = require('../middleware/auth');
const { validationResult } = require('express-validator');

// Helper to check validation errors
function checkValidation(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: errors.array()[0].msg });
    return false;
  }
  return true;
}

// Helper to hash password
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(12);
  return bcrypt.hash(password, salt);
}

// Helper to verify password
async function verifyPassword(candidatePassword, hashedPassword) {
  return bcrypt.compare(candidatePassword, hashedPassword);
}

// Helper to exclude password from user object
function sanitizeUser(user) {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

// @desc    Register Admin/ANO
// @route   POST /api/auth/register/admin
exports.registerAdmin = async (req, res, next) => {
  if (!checkValidation(req, res)) return;
  try {
    const { fullName, email, password, phone, rank, designation, serviceId, unitAssignment } = req.body;

    // Check if user exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user in Postgres
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .insert([{
        full_name: fullName,
        email,
        password: hashedPassword,
        phone,
        role: 'admin',
        rank,
        designation,
        service_id: serviceId,
        unit_assignment: unitAssignment,
        is_active: true,
      }])
      .select()
      .single();

    if (userError) {
      return res.status(400).json({ error: userError.message });
    }

    // Try to create in Supabase Auth (non-blocking)
    try {
      const supaUser = await createSupabaseUser(email, password, { fullName, role: 'admin' });
      if (supaUser?.user?.id) {
        await supabaseAdmin
          .from('users')
          .update({ supabase_user_id: supaUser.user.id })
          .eq('id', user.id);
      }
    } catch (e) {
      console.log('Supabase Auth user creation skipped:', e.message);
    }

    const token = generateToken(user.id, user.role);
    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
};

// @desc    Register Cadet
// @route   POST /api/auth/register/cadet
exports.registerCadet = async (req, res, next) => {
  if (!checkValidation(req, res)) return;
  try {
    const {
      cadetName, fatherName, motherName, dob, bloodGroup, aadharNumber,
      cadetMobile, fatherMobile, motherMobile,
      enrollmentNumber, sdSw, year, enrolledCourse, collegeName, university,
      residentialAddress, pincode, nearbyRailwayStation,
      bankName, accountNumber, ifscCode, micrCode,
      email, password
    } = req.body;

    // Check if email exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Check if enrollment number exists
    const { data: existingCadet } = await supabaseAdmin
      .from('cadets')
      .select('*')
      .eq('enrollment_number', enrollmentNumber)
      .single();

    if (existingCadet) {
      return res.status(400).json({ error: 'Enrollment number already registered' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user in Postgres
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .insert([{
        full_name: cadetName,
        email,
        password: hashedPassword,
        phone: cadetMobile,
        role: 'cadet',
        is_active: true,
      }])
      .select()
      .single();

    if (userError) {
      return res.status(400).json({ error: userError.message });
    }

    // Create cadet profile
    const { data: cadet, error: cadetError } = await supabaseAdmin
      .from('cadets')
      .insert([{
        user_id: user.id,
        cadet_name: cadetName,
        father_name: fatherName,
        mother_name: motherName,
        dob,
        blood_group: bloodGroup,
        aadhar_number: aadharNumber,
        cadet_mobile: cadetMobile,
        father_mobile: fatherMobile,
        mother_mobile: motherMobile,
        enrollment_number: enrollmentNumber,
        sd_sw: sdSw,
        year,
        enrolled_course: enrolledCourse,
        college_name: collegeName,
        university,
        residential_address: residentialAddress,
        pincode,
        nearby_railway_station: nearbyRailwayStation,
        bank_name: bankName,
        account_number: accountNumber,
        ifsc_code: ifscCode,
        micr_code: micrCode,
      }])
      .select()
      .single();

    if (cadetError) {
      return res.status(400).json({ error: cadetError.message });
    }

    // Try to create in Supabase Auth (non-blocking)
    try {
      const supaUser = await createSupabaseUser(email, password, { fullName: cadetName, role: 'cadet' });
      if (supaUser?.user?.id) {
        await supabaseAdmin
          .from('users')
          .update({ supabase_user_id: supaUser.user.id })
          .eq('id', user.id);
      }
    } catch (e) {
      console.log('Supabase Auth user creation skipped:', e.message);
    }

    const token = generateToken(user.id, user.role);
    res.status(201).json({ token, user: sanitizeUser(user), cadet });
  } catch (error) {
    next(error);
  }
};

// @desc    Login User by Email
// @route   POST /api/auth/login
exports.login = async (req, res, next) => {
  if (!checkValidation(req, res)) return;
  try {
    const { email, password } = req.body;

    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password
    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    // Update last login
    await supabaseAdmin
      .from('users')
      .update({ last_login: new Date() })
      .eq('id', user.id);

    // If cadet, get cadet profile
    let cadetProfile = null;
    if (user.role === 'cadet') {
      const { data: cadet } = await supabaseAdmin
        .from('cadets')
        .select('*')
        .eq('user_id', user.id)
        .single();
      cadetProfile = cadet;
    }

    const token = generateToken(user.id, user.role);
    res.json({ token, user: sanitizeUser(user), cadet: cadetProfile });
  } catch (error) {
    next(error);
  }
};

// @desc    Login Cadet by Enrollment Number
// @route   POST /api/auth/login/enrollment
exports.loginByEnrollment = async (req, res, next) => {
  try {
    const { enrollmentNumber, password } = req.body;

    // Get cadet by enrollment number
    const { data: cadet, error: cadetError } = await supabaseAdmin
      .from('cadets')
      .select('*')
      .eq('enrollment_number', enrollmentNumber)
      .single();

    if (!cadet) {
      return res.status(401).json({ error: 'Invalid enrollment number' });
    }

    // Get user
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', cadet.user_id)
      .single();

    if (!user) {
      return res.status(401).json({ error: 'User account not found' });
    }

    // Verify password
    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Update last login
    await supabaseAdmin
      .from('users')
      .update({ last_login: new Date() })
      .eq('id', user.id);

    const token = generateToken(user.id, user.role);
    res.json({ token, user: sanitizeUser(user), cadet });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    // req.user is set by the protect middleware
    const userId = req.user.id;

    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let cadetProfile = null;
    if (user.role === 'cadet') {
      const { data: cadet } = await supabaseAdmin
        .from('cadets')
        .select('*')
        .eq('user_id', userId)
        .single();
      cadetProfile = cadet;
    }

    res.json({ user: sanitizeUser(user), cadet: cadetProfile });
  } catch (error) {
    next(error);
  }
};

