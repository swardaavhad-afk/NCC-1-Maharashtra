// =============================================
// Cadet Controller
// =============================================
const { supabaseAdmin } = require('../config/supabase');

exports.getAllCadets = async (req, res, next) => {
  try {
    const { search, year, status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('cadets')
      .select('*, users:user_id(full_name, email, phone, last_login)', { count: 'exact' });

    if (search) {
      query = query.or(`cadet_name.ilike.%${search}%,enrollment_number.ilike.%${search}%,college_name.ilike.%${search}%`);
    }
    if (year) query = query.eq('year', year);
    if (status) query = query.eq('status', status);

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data: cadets, count, error } = await query;
    if (error) return res.status(400).json({ error: error.message });

    const formattedCadets = cadets.map(c => ({
      ...c,
      cadetName: c.cadet_name,
      enrollmentNumber: c.enrollment_number,
      sdSw: c.sd_sw,
      collegeName: c.college_name
    }));

    const pages = Math.ceil((count || 0) / limit);
    res.json({ cadets: formattedCadets, total: count || 0, page: parseInt(page), pages });
  } catch (error) {
    next(error);
  }
};

exports.getCadet = async (req, res, next) => {
  try {
    const { data: cadet, error } = await supabaseAdmin
      .from('cadets')
      .select('*, users:user_id(*)')
      .eq('id', req.params.id)
      .single();

    if (error || !cadet) return res.status(404).json({ error: 'Cadet not found' });
    res.json(cadet);
  } catch (error) {
    next(error);
  }
};

exports.updateCadet = async (req, res, next) => {
  try {
    const { data: cadet, error } = await supabaseAdmin
      .from('cadets')
      .update(req.body)
      .eq('id', req.params.id)
      .select('*, users:user_id(*)')
      .single();

    if (error || !cadet) return res.status(404).json({ error: 'Cadet not found' });
    res.json(cadet);
  } catch (error) {
    next(error);
  }
};

exports.deleteCadet = async (req, res, next) => {
  try {
    const { data: cadet, error } = await supabaseAdmin.from('cadets').select('user_id').eq('id', req.params.id).single();
    if (error || !cadet) return res.status(404).json({ error: 'Cadet not found' });
    await supabaseAdmin.from('users').update({ is_active: false }).eq('id', cadet.user_id);
    await supabaseAdmin.from('cadets').delete().eq('id', req.params.id);
    res.json({ message: 'Cadet removed successfully' });
  } catch (error) {
    next(error);
  }
};

exports.getCadetStats = async (req, res, next) => {
  try {
    const { count: total, error: e1 } = await supabaseAdmin.from('cadets').select('*', { count: 'exact', head: true });
    const { count: active, error: e2 } = await supabaseAdmin.from('cadets').select('*', { count: 'exact', head: true }).eq('status', 'active');
    const { data: byYear, error: e3 } = await supabaseAdmin.from('cadets').select('year');
    const { data: byDivision, error: e4 } = await supabaseAdmin.from('cadets').select('sd_sw');
    
    if (e1 || e2 || e3 || e4) return res.status(400).json({ error: 'Failed to fetch stats' });

    res.json({
      total: total || 0,
      active: active || 0,
      byYear: byYear ? byYear.reduce((acc, curr) => { const existing = acc.find(item => item._id === curr.year); if (existing) existing.count += 1; else acc.push({ _id: curr.year, count: 1 }); return acc; }, []) : [],
      byDivision: byDivision ? byDivision.reduce((acc, curr) => { const existing = acc.find(item => item._id === curr.sd_sw); if (existing) existing.count += 1; else acc.push({ _id: curr.sd_sw, count: 1 }); return acc; }, []) : []
    });
  } catch (error) {
    next(error);
  }
};