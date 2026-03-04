// =============================================
// Auth Routes
// =============================================
const express = require('express');
const router = express.Router();
const { registerAdmin, registerCadet, login, loginByEnrollment, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { body } = require('express-validator');

// Validation middleware
const validateLogin = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const validateAdminRegister = [
  body('fullName').notEmpty().withMessage('Full name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phone').notEmpty().withMessage('Phone required'),
  body('rank').notEmpty().withMessage('Rank required'),
  body('serviceId').notEmpty().withMessage('Service ID required')
];

const validateCadetRegister = [
  body('cadetName').notEmpty().withMessage('Name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('enrollmentNumber').notEmpty().withMessage('Enrollment number required'),
  body('fatherName').notEmpty().withMessage('Father name required'),
  body('motherName').notEmpty().withMessage('Mother name required')
];

router.post('/register/admin', validateAdminRegister, registerAdmin);
router.post('/register/cadet', validateCadetRegister, registerCadet);
router.post('/login', validateLogin, login);
router.post('/login/enrollment', loginByEnrollment);
router.get('/me', protect, getMe);

module.exports = router;
