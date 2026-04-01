// =============================================
// Dashboard Controller
// =============================================
const { supabaseAdmin } = require('../config/supabase');

// @desc    Admin dashboard overview
// @route   GET /api/dashboard/admin
exports.adminDashboard = async (req, res, next) => {
  try {
    // Get counts
    const { count: totalCadets } = await supabaseAdmin
      .from('cadets')
      .select('*', { count: 'exact' })
      .eq('status', 'active');

    const { count: totalCamps } = await supabaseAdmin
      .from('camps')
      .select('*', { count: 'exact' });

    const { count: upcomingCamps } = await supabaseAdmin
      .from('camps')
      .select('*', { count: 'exact' })
      .eq('status', 'upcoming');

    const { count: pendingAttendance } = await supabaseAdmin
      .from('attendance')
      .select('*', { count: 'exact' })
      .eq('status', 'pending');

    const { count: totalAchievements } = await supabaseAdmin
      .from('achievements')
      .select('*', { count: 'exact' });

    // Recent activities
    const { data: recentAttendance } = await supabaseAdmin
      .from('attendance')
      .select('*, cadets(cadet_name, enrollment_number)')
      .order('created_at', { ascending: false })
      .limit(5);

    const { data: upcomingCampsList } = await supabaseAdmin
      .from('camps')
      .select('*')
      .eq('status', 'upcoming')
      .order('start_date', { ascending: true })
      .limit(5);

    const { data: recentAchievements } = await supabaseAdmin
      .from('achievements')
      .select('*, cadets(cadet_name)')
      .order('created_at', { ascending: false })
      .limit(5);

    res.json({
      stats: {
        totalCadets,
        totalCamps,
        upcomingCamps,
        pendingAttendance,
        totalAchievements
      },
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
    // Get cadet profile
    const { data: cadet, error: cadetError } = await supabaseAdmin
      .from('cadets')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (cadetError || !cadet) {
      return res.status(404).json({ error: 'Cadet profile not found' });
    }

    // Get cadet's attendance
    const { data: myAttendance } = await supabaseAdmin
      .from('attendance')
      .select('*')
      .eq('cadet_id', cadet.id)
      .order('date', { ascending: false })
      .limit(10);

    // Get cadet's achievements
    const { data: myAchievements } = await supabaseAdmin
      .from('achievements')
      .select('*')
      .eq('cadet_id', cadet.id)
      .order('date_awarded', { ascending: false })
      .limit(5);

    // Get cadet's registered camps
    const { data: myCamps } = await supabaseAdmin
      .from('camp_cadets')
      .select('camps(*)')
      .eq('cadet_id', cadet.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get upcoming camps
    const { data: upcomingCamps } = await supabaseAdmin
      .from('camps')
      .select('*')
      .eq('status', 'upcoming')
      .order('start_date', { ascending: true })
      .limit(5);

    // Calculate attendance percentage
    const { count: totalAttendance } = await supabaseAdmin
      .from('attendance')
      .select('*', { count: 'exact' })
      .eq('cadet_id', cadet.id);

    const { count: presentCount } = await supabaseAdmin
      .from('attendance')
      .select('*', { count: 'exact' })
      .eq('cadet_id', cadet.id)
      .eq('status', 'present');

    const attendancePercentage = totalAttendance > 0
      ? Math.round((presentCount / totalAttendance) * 100)
      : 0;

    res.json({
      cadet,
      stats: {
        totalAttendance,
        presentCount,
        attendancePercentage,
        totalAchievements: myAchievements?.length || 0
      },
      myAttendance,
      myAchievements,
      myCamps,
      upcomingCamps
    });
  } catch (error) {
    next(error);
  }
};