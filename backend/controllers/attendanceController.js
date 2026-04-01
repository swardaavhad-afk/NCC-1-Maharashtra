// =============================================
// Attendance Controller
// =============================================
const { supabaseAdmin } = require('../config/supabase');

// @desc    Get all attendance records
// @route   GET /api/attendance
exports.getAllAttendance = async (req, res, next) => {
  try {
    const { date, status, cadetId, page = 1, limit = 50 } = req.query;
    const pageNum = parseInt(page);
    const pageLimit = parseInt(limit);
    const offset = (pageNum - 1) * pageLimit;

    let query = supabaseAdmin
      .from('attendance')
      .select('*, cadets(cadet_name, enrollment_number), users(full_name)', { count: 'exact' });

    if (date) query = query.eq('date', date);
    if (status) query = query.eq('status', status);
    if (cadetId) query = query.eq('cadet_id', cadetId);

    const { data: records, count } = await query
      .order('date', { ascending: false })
      .range(offset, offset + pageLimit - 1);

    if (!records) return res.status(500).json({ error: 'Failed to fetch records' });

    res.json({
      records,
      total: count,
      page: pageNum,
      pages: Math.ceil(count / pageLimit)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit attendance (cadet)
// @route   POST /api/attendance
exports.submitAttendance = async (req, res, next) => {
  try {
    const { cadetId, date, gpsLatitude, gpsLongitude, campId } = req.body;

    const { data: attendance, error } = await supabaseAdmin
      .from('attendance')
      .insert([{
        cadet_id: cadetId,
        date: date || new Date().toISOString(),
        gps_latitude: gpsLatitude,
        gps_longitude: gpsLongitude,
        gps_verified: !!(gpsLatitude && gpsLongitude),
        status: 'pending',
        camp_id: campId
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return res.status(400).json({ error: 'Attendance already submitted for this date' });
      }
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json(attendance);
  } catch (error) {
    next(error);
  }
};

// @desc    Review attendance (admin)
// @route   PUT /api/attendance/:id/review
exports.reviewAttendance = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;

    const { data: attendance, error } = await supabaseAdmin
      .from('attendance')
      .update({
        status,
        remarks,
        reviewed_by: req.user.id,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select('*, cadets(cadet_name, enrollment_number)')
      .single();

    if (error || !attendance) return res.status(404).json({ error: 'Record not found' });
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
    let query = supabaseAdmin.from('attendance').select('status');

    if (startDate && endDate) {
      query = query.gte('date', startDate).lte('date', endDate);
    }

    const { data: records, error } = await query;

    if (error) return res.status(500).json({ error: error.message });

    // Group by status manually
    const stats = {};
    records.forEach(record => {
      stats[record.status] = (stats[record.status] || 0) + 1;
    });

    const statsList = Object.entries(stats).map(([status, count]) => ({
      _id: status,
      count
    }));

    res.json({
      stats: statsList,
      total: records.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get cadet's attendance history
// @route   GET /api/attendance/cadet/:cadetId
exports.getCadetAttendance = async (req, res, next) => {
  try {
    const { data: records, error } = await supabaseAdmin
      .from('attendance')
      .select('*')
      .eq('cadet_id', req.params.cadetId)
      .order('date', { ascending: false })
      .limit(100);

    if (error) return res.status(500).json({ error: error.message });
    res.json(records || []);
  } catch (error) {
    next(error);
  }
};