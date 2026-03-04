// =============================================
// Achievement Controller
// =============================================
const Achievement = require('../models/Achievement');

// @desc    Get all achievements
// @route   GET /api/achievements
exports.getAllAchievements = async (req, res, next) => {
  try {
    const { category, cadetId, level, page = 1, limit = 50 } = req.query;
    const query = {};
    if (category) query.category = category;
    if (cadetId) query.cadetId = cadetId;
    if (level) query.level = level;

    const achievements = await Achievement.find(query)
      .populate('cadetId', 'cadetName enrollmentNumber')
      .populate('createdBy', 'fullName')
      .sort({ dateAwarded: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Achievement.countDocuments(query);
    res.json({ achievements, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Create achievement
// @route   POST /api/achievements
exports.createAchievement = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    const achievement = await Achievement.create(req.body);
    const populated = await achievement.populate('cadetId', 'cadetName enrollmentNumber');
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

// @desc    Update achievement
// @route   PUT /api/achievements/:id
exports.updateAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    }).populate('cadetId', 'cadetName enrollmentNumber');
    if (!achievement) return res.status(404).json({ error: 'Achievement not found' });
    res.json(achievement);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete achievement
// @route   DELETE /api/achievements/:id
exports.deleteAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);
    if (!achievement) return res.status(404).json({ error: 'Achievement not found' });
    res.json({ message: 'Achievement deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get achievement stats
// @route   GET /api/achievements/stats
exports.getAchievementStats = async (req, res, next) => {
  try {
    const byCategory = await Achievement.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    const byLevel = await Achievement.aggregate([
      { $group: { _id: '$level', count: { $sum: 1 } } }
    ]);
    const total = await Achievement.countDocuments();
    res.json({ total, byCategory, byLevel });
  } catch (error) {
    next(error);
  }
};

// @desc    Get cadet's achievements
// @route   GET /api/achievements/cadet/:cadetId
exports.getCadetAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.find({ cadetId: req.params.cadetId })
      .sort({ dateAwarded: -1 });
    res.json(achievements);
  } catch (error) {
    next(error);
  }
};
