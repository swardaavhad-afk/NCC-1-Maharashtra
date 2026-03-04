// =============================================
// Camp Controller
// =============================================
const Camp = require('../models/Camp');

// @desc    Get all camps
// @route   GET /api/camps
exports.getAllCamps = async (req, res, next) => {
  try {
    const { type, status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;

    const camps = await Camp.find(query)
      .populate('createdBy', 'fullName')
      .sort({ startDate: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Camp.countDocuments(query);
    res.json({ camps, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single camp
// @route   GET /api/camps/:id
exports.getCamp = async (req, res, next) => {
  try {
    const camp = await Camp.findById(req.params.id)
      .populate('createdBy', 'fullName')
      .populate('registeredCadets', 'cadetName enrollmentNumber');
    if (!camp) return res.status(404).json({ error: 'Camp not found' });
    res.json(camp);
  } catch (error) {
    next(error);
  }
};

// @desc    Create camp
// @route   POST /api/camps
exports.createCamp = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id;
    const camp = await Camp.create(req.body);
    res.status(201).json(camp);
  } catch (error) {
    next(error);
  }
};

// @desc    Update camp
// @route   PUT /api/camps/:id
exports.updateCamp = async (req, res, next) => {
  try {
    const camp = await Camp.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!camp) return res.status(404).json({ error: 'Camp not found' });
    res.json(camp);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete camp
// @route   DELETE /api/camps/:id
exports.deleteCamp = async (req, res, next) => {
  try {
    const camp = await Camp.findByIdAndDelete(req.params.id);
    if (!camp) return res.status(404).json({ error: 'Camp not found' });
    res.json({ message: 'Camp deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Register cadet for camp
// @route   POST /api/camps/:id/register
exports.registerForCamp = async (req, res, next) => {
  try {
    const camp = await Camp.findById(req.params.id);
    if (!camp) return res.status(404).json({ error: 'Camp not found' });

    const { cadetId } = req.body;
    if (camp.registeredCadets.includes(cadetId)) {
      return res.status(400).json({ error: 'Cadet already registered' });
    }
    if (camp.registeredCadets.length >= camp.maxCadets) {
      return res.status(400).json({ error: 'Camp is full' });
    }

    camp.registeredCadets.push(cadetId);
    await camp.save();
    res.json(camp);
  } catch (error) {
    next(error);
  }
};
