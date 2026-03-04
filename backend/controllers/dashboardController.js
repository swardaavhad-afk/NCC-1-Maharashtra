// =============================================
// Dashboard Controller
// =============================================
const Cadet = require('../models/Cadet');
const Camp = require('../models/Camp');
const Attendance = require('../models/Attendance');
const Achievement = require('../models/Achievement');

// @desc    Admin dashboard overview
// @route   GET /api/dashboard/admin
exports.adminDashboard = async (req, res, next) => {
  try {
    const totalCadets = await Cadet.countDocuments({ status: 'active' });
    const totalCamps = await Camp.countDocuments();
    const upcomingCamps = await Camp.countDocuments({ status: 'upcoming' });
    const pendingAttendance = await Attendance.countDocuments({ status: 'pending' });
    const totalAchievements = await Achievement.countDocuments();

    // Recent activities
    const recentAttendance = await Attendance.find()
      .populate('cadetId', 'cadetName enrollmentNumber')
      .sort({ createdAt: -1 })
      .limit(5);

    const upcomingCampsList = await Camp.find({ status: 'upcoming' })
      .sort({ startDate: 1 })
      .limit(5);

    const recentAchievements = await Achievement.find()
      .populate('cadetId', 'cadetName')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: { totalCadets, totalCamps, upcomingCamps, pendingAttendance, totalAchievements },
      recentAttendance,
      upcomingCampsList,
      recentAchievements
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cadet dashboard overview
// @route   GET /api/dashboard/cadet
exports.cadetDashboard = async (req, res, next) => {
  try {
    const cadet = await Cadet.findOne({ userId: req.user._id });
    if (!cadet) return res.status(404).json({ error: 'Cadet profile not found' });

    const myAttendance = await Attendance.find({ cadetId: cadet._id })
      .sort({ date: -1 }).limit(10);

    const myAchievements = await Achievement.find({ cadetId: cadet._id })
      .sort({ dateAwarded: -1 }).limit(5);

    const myCamps = await Camp.find({ registeredCadets: cadet._id })
      .sort({ startDate: -1 }).limit(5);

    const upcomingCamps = await Camp.find({ status: 'upcoming' })
      .sort({ startDate: 1 }).limit(5);

    // Attendance stats
    const totalAttendance = await Attendance.countDocuments({ cadetId: cadet._id });
    const presentCount = await Attendance.countDocuments({ cadetId: cadet._id, status: 'present' });
    const attendancePercentage = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 0;

    res.json({
      cadet,
      stats: { totalAttendance, presentCount, attendancePercentage, totalAchievements: myAchievements.length },
      myAttendance,
      myAchievements,
      myCamps,
      upcomingCamps
    });
  } catch (error) {
    next(error);
  }
};
