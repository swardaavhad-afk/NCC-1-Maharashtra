// =============================================
// Reports Controller
// =============================================
const { supabaseAdmin } = require('../config/supabase');

// @desc    Get comprehensive report data
// @route   GET /api/reports/overview
exports.getOverviewReport = async (req, res, next) => {
  try {
    // Get counts
    const { count: totalCadets } = await supabaseAdmin
      .from('cadets')
      .select('*', { count: 'exact' });

    const { count: activeCadets } = await supabaseAdmin
      .from('cadets')
      .select('*', { count: 'exact' })
      .eq('status', 'active');

    const { count: totalCamps } = await supabaseAdmin
      .from('camps')
      .select('*', { count: 'exact' });

    const { count: totalAchievements } = await supabaseAdmin
      .from('achievements')
      .select('*', { count: 'exact' });

    // Attendance stats
    const { data: attendanceData } = await supabaseAdmin
      .from('attendance')
      .select('status');

    const attendanceStats = {};
    attendanceData?.forEach(rec => {
      attendanceStats[rec.status] = (attendanceStats[rec.status] || 0) + 1;
    });

    const attendanceStatsList = Object.entries(attendanceStats).map(([status, count]) => ({
      _id: status,
      count
    }));

    // Cadets by year
    const { data: cadetsByYearData } = await supabaseAdmin
      .from('cadets')
      .select('year');

    const cadetsByYearMap = {};
    cadetsByYearData?.forEach(cadet => {
      cadetsByYearMap[cadet.year] = (cadetsByYearMap[cadet.year] || 0) + 1;
    });

    const cadetsByYear = Object.entries(cadetsByYearMap)
      .map(([year, count]) => ({ _id: year, count }))
      .sort((a, b) => a._id.localeCompare(b._id));

    // Cadets by college (top 10)
    const { data: cadetsByCollegeData } = await supabaseAdmin
      .from('cadets')
      .select('college_name');

    const cadetsByCollegeMap = {};
    cadetsByCollegeData?.forEach(cadet => {
      cadetsByCollegeMap[cadet.college_name] = (cadetsByCollegeMap[cadet.college_name] || 0) + 1;
    });

    const cadetsByCollege = Object.entries(cadetsByCollegeMap)
      .map(([college, count]) => ({ _id: college, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Recent achievements
    const { data: recentAchievements } = await supabaseAdmin
      .from('achievements')
      .select('*, cadets(cadet_name)')
      .order('date_awarded', { ascending: false })
      .limit(5);

    res.json({
      totalCadets,
      activeCadets,
      totalCamps,
      totalAchievements,
      attendanceStats: attendanceStatsList,
      cadetsByYear,
      cadetsByCollege,
      recentAchievements
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

    // Fetch attendance records
    let attendanceQuery = supabaseAdmin
      .from('attendance')
      .select('date, status, cadet_id, cadets(cadet_name, enrollment_number)');

    if (startDate && endDate) {
      attendanceQuery = attendanceQuery.gte('date', startDate).lte('date', endDate);
    }

    const { data: attendanceRecords, error } = await attendanceQuery;

    if (error) return res.status(500).json({ error: error.message });

    // Group by date and status
    const dailyAttendanceMap = {};
    attendanceRecords?.forEach(rec => {
      const dateKey = rec.date;
      if (!dailyAttendanceMap[dateKey]) {
        dailyAttendanceMap[dateKey] = {};
      }
      if (!dailyAttendanceMap[dateKey][rec.status]) {
        dailyAttendanceMap[dateKey][rec.status] = 0;
      }
      dailyAttendanceMap[dateKey][rec.status]++;
    });

    const dailyAttendance = Object.entries(dailyAttendanceMap)
      .flatMap(([date, statuses]) =>
        Object.entries(statuses).map(([status, count]) => ({
          _id: { date, status },
          count
        }))
      )
      .sort((a, b) => new Date(b._id.date) - new Date(a._id.date));

    // Cadet attendance summary
    const cadetSummaryMap = {};
    attendanceRecords?.forEach(rec => {
      if (!cadetSummaryMap[rec.cadet_id]) {
        cadetSummaryMap[rec.cadet_id] = {
          cadetId: rec.cadet_id,
          cadetName: rec.cadets?.cadet_name,
          enrollmentNumber: rec.cadets?.enrollment_number,
          totalDays: 0,
          presentDays: 0,
          absentDays: 0
        };
      }
      cadetSummaryMap[rec.cadet_id].totalDays++;
      if (rec.status === 'present') {
        cadetSummaryMap[rec.cadet_id].presentDays++;
      } else if (rec.status === 'absent') {
        cadetSummaryMap[rec.cadet_id].absentDays++;
      }
    });

    const cadetAttendanceSummary = Object.values(cadetSummaryMap)
      .map(summary => ({
        ...summary,
        percentage: summary.totalDays > 0
          ? (summary.presentDays / summary.totalDays) * 100
          : 0
      }))
      .sort((a, b) => b.percentage - a.percentage);

    res.json({
      dailyAttendance,
      cadetAttendanceSummary
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get camp report
// @route   GET /api/reports/camps
exports.getCampReport = async (req, res, next) => {
  try {
    // Camps by type
    const { data: campsByTypeData } = await supabaseAdmin
      .from('camps')
      .select('type');

    const campsByTypeMap = {};
    campsByTypeData?.forEach(camp => {
      campsByTypeMap[camp.type] = (campsByTypeMap[camp.type] || 0) + 1;
    });

    const campsByType = Object.entries(campsByTypeMap).map(([type, count]) => ({
      _id: type,
      count
    }));

    // Camps by status
    const { data: campsByStatusData } = await supabaseAdmin
      .from('camps')
      .select('status');

    const campsByStatusMap = {};
    campsByStatusData?.forEach(camp => {
      campsByStatusMap[camp.status] = (campsByStatusMap[camp.status] || 0) + 1;
    });

    const campsByStatus = Object.entries(campsByStatusMap).map(([status, count]) => ({
      _id: status,
      count
    }));

    // Recent camps
    const { data: recentCamps } = await supabaseAdmin
      .from('camps')
      .select('*, users(full_name)')
      .order('start_date', { ascending: false })
      .limit(10);

    res.json({
      campsByType,
      campsByStatus,
      recentCamps
    });
  } catch (error) {
    next(error);
  }
};

