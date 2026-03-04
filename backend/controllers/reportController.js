// =============================================
// Reports Controller
// =============================================
const Cadet = require('../models/Cadet');
const Attendance = require('../models/Attendance');
const Achievement = require('../models/Achievement');
const Camp = require('../models/Camp');

// @desc    Get comprehensive report data
// @route   GET /api/reports/overview
exports.getOverviewReport = async (req, res, next) => {
  try {
    const totalCadets = await Cadet.countDocuments();
    const activeCadets = await Cadet.countDocuments({ status: 'active' });
    const totalCamps = await Camp.countDocuments();
    const totalAchievements = await Achievement.countDocuments();

    const attendanceStats = await Attendance.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const cadetsByYear = await Cadet.aggregate([
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    const cadetsByCollege = await Cadet.aggregate([
      { $group: { _id: '$collegeName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const recentAchievements = await Achievement.find()
      .populate('cadetId', 'cadetName')
      .sort({ dateAwarded: -1 })
      .limit(5);

    res.json({
      totalCadets, activeCadets, totalCamps, totalAchievements,
      attendanceStats, cadetsByYear, cadetsByCollege, recentAchievements
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance report
// @route   GET /api/reports/attendance
exports.getAttendanceReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const dailyAttendance = await Attendance.aggregate([
      { $match: query },
      { $group: { _id: { date: '$date', status: '$status' }, count: { $sum: 1 } } },
      { $sort: { '_id.date': -1 } }
    ]);

    const cadetAttendanceSummary = await Attendance.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$cadetId',
          totalDays: { $sum: 1 },
          presentDays: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
          absentDays: { $sum: { $cond: [{ $eq: ['$status', 'absent'] }, 1, 0] } }
        }
      },
      {
        $lookup: {
          from: 'cadets', localField: '_id', foreignField: '_id', as: 'cadet'
        }
      },
      { $unwind: '$cadet' },
      {
        $project: {
          cadetName: '$cadet.cadetName',
          enrollmentNumber: '$cadet.enrollmentNumber',
          totalDays: 1, presentDays: 1, absentDays: 1,
          percentage: { $multiply: [{ $divide: ['$presentDays', '$totalDays'] }, 100] }
        }
      },
      { $sort: { percentage: -1 } }
    ]);

    res.json({ dailyAttendance, cadetAttendanceSummary });
  } catch (error) {
    next(error);
  }
};

// @desc    Get camp report
// @route   GET /api/reports/camps
exports.getCampReport = async (req, res, next) => {
  try {
    const campsByType = await Camp.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    const campsByStatus = await Camp.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const recentCamps = await Camp.find()
      .sort({ startDate: -1 })
      .limit(10)
      .populate('createdBy', 'fullName');

    res.json({ campsByType, campsByStatus, recentCamps });
  } catch (error) {
    next(error);
  }
};
