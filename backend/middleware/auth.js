// =============================================
// JWT Authentication Middleware
// =============================================
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'ncc_maharashtra_secret_key_2026';

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

// Verify Token Middleware
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ error: 'User not found' });
    }
    if (!req.user.isActive) {
      return res.status(403).json({ error: 'Account deactivated' });
    }
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Not authorized, token invalid' });
  }
};

// Admin-only Middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
};

// Cadet-only Middleware
const cadetOnly = (req, res, next) => {
  if (req.user && req.user.role === 'cadet') {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied. Cadet only.' });
  }
};

module.exports = { generateToken, protect, adminOnly, cadetOnly, JWT_SECRET };
