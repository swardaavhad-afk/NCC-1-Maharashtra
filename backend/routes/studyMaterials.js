// =============================================
// Study Materials Routes
// =============================================
const express = require('express');
const router = express.Router();
const { getAllMaterials, createMaterial, updateMaterial, deleteMaterial, incrementDownload, getUploadUrl } = require('../controllers/studyMaterialController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.get('/', getAllMaterials);
router.post('/', adminOnly, createMaterial);
router.post('/upload-url', adminOnly, getUploadUrl);
router.put('/:id', adminOnly, updateMaterial);
router.delete('/:id', adminOnly, deleteMaterial);
router.post('/:id/download', incrementDownload);

module.exports = router;
