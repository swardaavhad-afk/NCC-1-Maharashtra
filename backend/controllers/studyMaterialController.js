// =============================================
// Study Material Controller
// =============================================
const StudyMaterial = require('../models/StudyMaterial');
const { uploadFile, getPublicUrl, deleteFile } = require('../config/supabase');

// @desc    Get all study materials
// @route   GET /api/study-materials
exports.getAllMaterials = async (req, res, next) => {
  try {
    const { category, year, page = 1, limit = 50 } = req.query;
    const query = {};
    if (category) query.category = category;
    if (year) query.year = year;

    const materials = await StudyMaterial.find(query)
      .populate('uploadedBy', 'fullName')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await StudyMaterial.countDocuments(query);
    res.json({ materials, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload study material
// @route   POST /api/study-materials
exports.createMaterial = async (req, res, next) => {
  try {
    const { title, description, category, year, fileUrl, fileName, fileSize, fileType } = req.body;

    const material = await StudyMaterial.create({
      title, description, category, year,
      fileUrl, fileName, fileSize, fileType,
      uploadedBy: req.user._id
    });

    res.status(201).json(material);
  } catch (error) {
    next(error);
  }
};

// @desc    Update study material
// @route   PUT /api/study-materials/:id
exports.updateMaterial = async (req, res, next) => {
  try {
    const material = await StudyMaterial.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    });
    if (!material) return res.status(404).json({ error: 'Material not found' });
    res.json(material);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete study material
// @route   DELETE /api/study-materials/:id
exports.deleteMaterial = async (req, res, next) => {
  try {
    const material = await StudyMaterial.findByIdAndDelete(req.params.id);
    if (!material) return res.status(404).json({ error: 'Material not found' });
    res.json({ message: 'Material deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Increment download count
// @route   POST /api/study-materials/:id/download
exports.incrementDownload = async (req, res, next) => {
  try {
    const material = await StudyMaterial.findByIdAndUpdate(
      req.params.id,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );
    if (!material) return res.status(404).json({ error: 'Material not found' });
    res.json(material);
  } catch (error) {
    next(error);
  }
};

// @desc    Get upload URL from Supabase
// @route   POST /api/study-materials/upload-url
exports.getUploadUrl = async (req, res, next) => {
  try {
    const { fileName, fileType } = req.body;
    const filePath = `study-materials/${Date.now()}-${fileName}`;
    // Return the path for client-side upload
    res.json({ filePath, bucket: 'ncc-files' });
  } catch (error) {
    next(error);
  }
};
