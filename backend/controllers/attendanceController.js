// =============================================
// Attendance Controller
// =============================================
const Attendance = require('../models/Attendance');
const Cadet = require('../models/Cadet');
const { uploadFile, getPublicUrl } = require('../config/supabase');

// @desc    Get all attendance records
// @route   GET /api/attendance
exports.getAllAttendance = async (req, res, next) => {
  try {
    const { date, status, cadetId, page = 1, limit = 50 } = req.query;
    const query = {};
    if (date) query.date = new Date(date);
    if (status) query.status = status;
    if (cadetId) query.cadetId = cadetId;

    const records = await Attendance.find(query)
      .populate('cadetId', 'cadetName enrollmentNumber')
      .populate('reviewedBy', 'fullName')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Attendance.countDocuments(query);
    res.json({ records, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit attendance (cadet)
// @route   POST /api/attendance
exports.submitAttendance = async (req, res, next) => {
  try {
    const { cadetId, date, gpsLatitude, gpsLongitude, campId } = req.body;

    const attendance = await Attendance.create({
      cadetId,
      date: date || new Date(),
      gpsLatitude,
      gpsLongitude,
      gpsVerified: !!(gpsLatitude && gpsLongitude),
      status: 'pending',
      campId
    });

    res.status(201).json(attendance);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Attendance already submitted for this date' });
    }
    next(error);
  }
};

// @desc    Review attendance (admin)
// @route   PUT /api/attendance/:id/review
exports.reviewAttendance = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;

    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      { status, remarks, reviewedBy: req.user._id, reviewedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('cadetId', 'cadetName enrollmentNumber');

    if (!attendance) return res.status(404).json({ error: 'Record not found' });
    res.json(attendance);
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance stats
// @route   GET /api/attendance/stats
exports.getAttendanceStats = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const query = {};
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const stats = await Attendance.aggregate([
      { $match: query },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const total = await Attendance.countDocuments(query);
    res.json({ stats, total });
  } catch (error) {
    next(error);
  }
};

// @desc    Get cadet's attendance history
// @route   GET /api/attendance/cadet/:cadetId
exports.getCadetAttendance = async (req, res, next) => {
  try {
    const records = await Attendance.find({ cadetId: req.params.cadetId })
      .sort({ date: -1 })
      .limit(100);
    res.json(records);
  } catch (error) {
    next(error);
  }
};
