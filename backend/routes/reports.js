// =============================================
// Reports Routes
// =============================================
const express = require('express');
const router = express.Router();
const { getOverviewReport, getAttendanceReport, getCampReport } = require('../controllers/reportController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.use(adminOnly);
router.get('/overview', getOverviewReport);
router.get('/attendance', getAttendanceReport);
router.get('/camps', getCampReport);

module.exports = router;
