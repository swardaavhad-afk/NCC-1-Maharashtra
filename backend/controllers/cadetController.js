// =============================================
// Cadet Controller
// =============================================
const Cadet = require('../models/Cadet');
const User = require('../models/User');

// @desc    Get all cadets (admin)
// @route   GET /api/cadets
exports.getAllCadets = async (req, res, next) => {
  try {
    const { search, year, status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (year) query.year = year;
    if (status) query.status = status;

    const cadets = await Cadet.find(query)
      .populate('userId', 'fullName email phone lastLogin')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Cadet.countDocuments(query);

    res.json({ cadets, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single cadet
// @route   GET /api/cadets/:id
exports.getCadet = async (req, res, next) => {
  try {
    const cadet = await Cadet.findById(req.params.id)
      .populate('userId', 'fullName email phone lastLogin');
    if (!cadet) {
      return res.status(404).json({ error: 'Cadet not found' });
    }
    res.json(cadet);
  } catch (error) {
    next(error);
  }
};

// @desc    Update cadet profile
// @route   PUT /api/cadets/:id
exports.updateCadet = async (req, res, next) => {
  try {
    const cadet = await Cadet.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!cadet) {
      return res.status(404).json({ error: 'Cadet not found' });
    }
    res.json(cadet);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete cadet
// @route   DELETE /api/cadets/:id
exports.deleteCadet = async (req, res, next) => {
  try {
    const cadet = await Cadet.findById(req.params.id);
    if (!cadet) {
      return res.status(404).json({ error: 'Cadet not found' });
    }
    // Deactivate associated user
    await User.findByIdAndUpdate(cadet.userId, { isActive: false });
    await Cadet.findByIdAndDelete(req.params.id);
    res.json({ message: 'Cadet removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get cadet stats
// @route   GET /api/cadets/stats/overview
exports.getCadetStats = async (req, res, next) => {
  try {
    const total = await Cadet.countDocuments();
    const active = await Cadet.countDocuments({ status: 'active' });
    const byYear = await Cadet.aggregate([
      { $group: { _id: '$year', count: { $sum: 1 } } }
    ]);
    const byDivision = await Cadet.aggregate([
      { $group: { _id: '$sdSw', count: { $sum: 1 } } }
    ]);

    res.json({ total, active, byYear, byDivision });
  } catch (error) {
    next(error);
  }
};
