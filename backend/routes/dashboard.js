// =============================================
// Dashboard Routes
// =============================================
const express = require('express');
const router = express.Router();
const { adminDashboard, cadetDashboard } = require('../controllers/dashboardController');
const { protect, adminOnly, cadetOnly } = require('../middleware/auth');

router.use(protect);
router.get('/admin', adminOnly, adminDashboard);
router.get('/cadet', cadetOnly, cadetDashboard);

module.exports = router;
