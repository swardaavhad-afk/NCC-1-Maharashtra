// =============================================
// Camp Controller
// =============================================
const { supabaseAdmin } = require('../config/supabase');

// @desc    Get all camps
// @route   GET /api/camps
exports.getAllCamps = async (req, res, next) => {
  try {
    const { type, status, page = 1, limit = 20 } = req.query;
    const pageNum = parseInt(page);
    const pageLimit = parseInt(limit);
    const offset = (pageNum - 1) * pageLimit;

    let query = supabaseAdmin.from('camps').select('*, users(full_name)', { count: 'exact' });

    if (type) query = query.eq('type', type);
    if (status) query = query.eq('status', status);

    const { data: camps, count } = await query.order('start_date', { ascending: false })
      .range(offset, offset + pageLimit - 1);

    if (!camps) return res.status(500).json({ error: 'Failed to fetch camps' });

    res.json({
      camps,
      total: count,
      page: pageNum,
      pages: Math.ceil(count / pageLimit)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single camp
// @route   GET /api/camps/:id
exports.getCamp = async (req, res, next) => {
  try {
    const { data: camp, error } = await supabaseAdmin
      .from('camps')
      .select('*, users(full_name), camp_cadets(cadets(cadet_name, enrollment_number))')
      .eq('id', req.params.id)
      .single();

    if (error || !camp) return res.status(404).json({ error: 'Camp not found' });
    res.json(camp);
  } catch (error) {
    next(error);
  }
};

// @desc    Create camp
// @route   POST /api/camps
exports.createCamp = async (req, res, next) => {
  try {
    const { data: camp, error } = await supabaseAdmin
      .from('camps')
      .insert([{ ...req.body, created_by: req.user.id }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.status(201).json(camp);
  } catch (error) {
    next(error);
  }
};

// @desc    Update camp
// @route   PUT /api/camps/:id
exports.updateCamp = async (req, res, next) => {
  try {
    const { data: camp, error } = await supabaseAdmin
      .from('camps')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !camp) return res.status(404).json({ error: 'Camp not found' });
    res.json(camp);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete camp
// @route   DELETE /api/camps/:id
exports.deleteCamp = async (req, res, next) => {
  try {
    const { data: camp, error } = await supabaseAdmin
      .from('camps')
      .delete()
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !camp) return res.status(404).json({ error: 'Camp not found' });
    res.json({ message: 'Camp deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Register cadet for camp
// @route   POST /api/camps/:id/register
exports.registerForCamp = async (req, res, next) => {
  try {
    const { cadetId } = req.body;

    // Check if camp exists and get max cadets
    const { data: camp, error: campError } = await supabaseAdmin
      .from('camps')
      .select('id, max_cadets')
      .eq('id', req.params.id)
      .single();

    if (campError || !camp) return res.status(404).json({ error: 'Camp not found' });

    // Check if cadet already registered
    const { data: existing } = await supabaseAdmin
      .from('camp_cadets')
      .select('id')
      .eq('camp_id', req.params.id)
      .eq('cadet_id', cadetId)
      .single();

    if (existing) return res.status(400).json({ error: 'Cadet already registered' });

    // Check camp capacity
    const { count } = await supabaseAdmin
      .from('camp_cadets')
      .select('*', { count: 'exact' })
      .eq('camp_id', req.params.id);

    if (count >= camp.max_cadets) {
      return res.status(400).json({ error: 'Camp is full' });
    }

    // Register cadet
    const { data: registration, error } = await supabaseAdmin
      .from('camp_cadets')
      .insert([{ camp_id: req.params.id, cadet_id: cadetId }])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json(registration);
  } catch (error) {
    next(error);
  }
};