// =============================================
// Attendance Routes
// =============================================
const express = require('express');
const router = express.Router();
const { getAllAttendance, submitAttendance, reviewAttendance, getAttendanceStats, getCadetAttendance } = require('../controllers/attendanceController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.get('/', getAllAttendance);
router.get('/stats', adminOnly, getAttendanceStats);
router.get('/cadet/:cadetId', getCadetAttendance);
router.post('/', submitAttendance);
router.put('/:id/review', adminOnly, reviewAttendance);

module.exports = router;
