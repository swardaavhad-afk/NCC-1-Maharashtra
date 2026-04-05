

// =============================================
// Achievement Controller
// =============================================
const { supabaseAdmin, uploadFile, getPublicUrl } = require('../config/supabase');

// @desc    Get public gallery (approved achievements)
// @route   GET /api/achievements/gallery
exports.getPublicGallery = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const { data: achievements, count, error } = await supabaseAdmin
      .from('achievements')
      .select('*', { count: 'exact' })
      .eq('is_approved', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return res.status(500).json({ error: error.message });

    res.json({
      achievements: achievements || [],
      total: count || 0,
      page: parseInt(page),
      pages: Math.ceil((count || 0) / limit)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all achievements (admin only)
// @route   GET /api/achievements/admin/all
exports.getAllAchievements = async (req, res, next) => {
  try {
    const { cadetId, isApproved, isSpecial, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
      .from('achievements')
      .select('*', { count: 'exact' });

    if (cadetId) query = query.eq('cadet_id', cadetId);
    if (isApproved !== undefined) query = query.eq('is_approved', isApproved === 'true');
    if (isSpecial !== undefined) query = query.eq('is_special', isSpecial === 'true');

    const { data: achievements, count, error } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return res.status(500).json({ error: error.message });

    res.json({
      achievements: achievements || [],
      total: count || 0,
      page: parseInt(page),
      pages: Math.ceil((count || 0) / limit)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get cadet's achievements
// @route   GET /api/achievements/cadet/:cadetId
exports.getCadetAchievements = async (req, res, next) => {
  try {
    const cadetId = req.params.cadetId;

    const { data: achievements, error } = await supabaseAdmin
      .from('achievements')
      .select('*')
      .eq('cadet_id', cadetId)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });

    res.json(achievements || []);
  } catch (error) {
    next(error);
  }
};

// @desc    Create achievement with file uploads
// @route   POST /api/achievements
exports.createAchievement = async (req, res, next) => {
  try {
    const { title, description, dateAwarded, category, level, rank, name, campName, collegeName, is_special } = req.body;
    const files = req.files || {};
    const userId = req.user.id;
    const userRole = req.user.role || 'cadet';

    let cadetId = req.body.cadetId;

    // Resolve cadetId if submitted by a cadet
    if (!cadetId && userRole === 'cadet') {
      const { data: cadet, error: cadetErr } = await supabaseAdmin
        .from('cadets')
        .select('id')
        .eq('user_id', userId)
        .single();
      
      if (cadetErr || !cadet) {
        return res.status(404).json({ error: 'Cadet profile not found for this user. Please complete your profile first.' });
      }
      cadetId = cadet.id;
    } else if (!cadetId) {
      return res.status(400).json({ error: 'cadetId is required for submitting an achievement' });
    }

    // Validate required fields
    if (!title || !category || !dateAwarded) {
      return res.status(400).json({ error: 'Missing required fields: title, category, dateAwarded' });
    }

    let certificateUrl = null;
    let campPhotosUrls = [];

    try {
      // Upload certificate
      if (files.certificate) {
        const certificatePath = `achievements/${cadetId}/${Date.now()}-${files.certificate[0].filename || files.certificate.name || 'cert'}`;
        await uploadFile('certificates', certificatePath, files.certificate[0].buffer || files.certificate.data, files.certificate[0].mimetype || files.certificate.mimetype);
        certificateUrl = getPublicUrl('certificates', certificatePath);
      }

      // Upload camp photos
      if (files.campPhotos) {
        const photoFiles = Array.isArray(files.campPhotos) ? files.campPhotos : [files.campPhotos];
        for (const photo of photoFiles) {
          const photoPath = `achievements/${cadetId}/${Date.now()}-${photo.filename || photo.name || 'photo'}`;
          await uploadFile('certificates', photoPath, photo.buffer || photo.data, photo.mimetype);
          const photoUrl = getPublicUrl('certificates', photoPath);
          if (photoUrl) campPhotosUrls.push(photoUrl);
        }
      }
    } catch (uploadError) {
      return res.status(400).json({ error: `File upload failed: ${uploadError.message}` });
    }

    // Determine approval status based on user role
    const isApproved = userRole === 'admin';
    const isSpecialValue = userRole === 'admin' && is_special === 'true';

    // Insert achievement record
    const achievementData = {
      title,
      description,
      date_awarded: dateAwarded,
      category,
      level,
      certificate_url: certificateUrl,
      cadet_id: cadetId,
      is_approved: isApproved,
      is_special: isSpecialValue,
      created_at: new Date().toISOString()
    };

    const { data: achievement, error } = await supabaseAdmin
      .from('achievements')
      .insert([achievementData])
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json(achievement);
  } catch (error) {
    next(error);
  }
};

// @desc    Approve achievement (admin only)
// @route   PATCH /api/achievements/:id/approve
exports.approveAchievement = async (req, res, next) => {
  try {
    const { data: achievement, error } = await supabaseAdmin
      .from('achievements')
      .update({ is_approved: true })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    res.json(achievement);
  } catch (error) {
    next(error);
  }
};

// @desc    Update achievement (admin only)
// @route   PUT /api/achievements/:id
exports.updateAchievement = async (req, res, next) => {
  try {
    const { rank, name, camp_name, college_name, is_special } = req.body;
    const updateData = {};

    if (rank) updateData.rank = rank;
    if (name) updateData.name = name;
    if (camp_name) updateData.camp_name = camp_name;
    if (college_name) updateData.college_name = college_name;
    if (is_special !== undefined) updateData.is_special = is_special;

    const { data: achievement, error } = await supabaseAdmin
      .from('achievements')
      .update(updateData)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    res.json(achievement);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete achievement (admin only)
// @route   DELETE /api/achievements/:id
exports.deleteAchievement = async (req, res, next) => {
  try {
    const { data: achievement, error: selectError } = await supabaseAdmin
      .from('achievements')
      .select()
      .eq('id', req.params.id)
      .single();

    if (selectError || !achievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    const { error: deleteError } = await supabaseAdmin
      .from('achievements')
      .delete()
      .eq('id', req.params.id);

    if (deleteError) {
      return res.status(400).json({ error: deleteError.message });
    }

    res.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get achievement statistics
// @route   GET /api/achievements/stats
exports.getAchievementStats = async (req, res, next) => {
  try {
    const { data: allAchievements, error } = await supabaseAdmin
      .from('achievements')
      .select('rank, is_approved, is_special, cadet_id');

    if (error) return res.status(500).json({ error: error.message });

    const totalAchievements = allAchievements.length;
    const approvedCount = allAchievements.filter(a => a.is_approved).length;
    const pendingCount = allAchievements.filter(a => !a.is_approved).length;
    const specialCount = allAchievements.filter(a => a.is_special).length;

    // Count by rank
    const byRank = {};
    allAchievements.forEach(ach => {
      byRank[ach.rank] = (byRank[ach.rank] || 0) + 1;
    });

    const byRankList = Object.entries(byRank).map(([rank, count]) => ({
      rank,
      count
    }));

    // Count unique cadets
    const uniqueCadets = new Set(allAchievements.map(a => a.cadet_id)).size;

    res.json({
      total: totalAchievements,
      approved: approvedCount,
      pending: pendingCount,
      special: specialCount,
      uniqueCadets,
      byRank: byRankList
    });
  } catch (error) {
    next(error);
  }
};

