const express = require('express');
const router = express.Router();
const { 
  getAllMaterials, 
  createMaterial, 
  updateMaterial, 
  deleteMaterial, 
  incrementDownload 
} = require('../controllers/studyMaterialController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);
router.get('/', getAllMaterials);
router.post(
  '/', 
  adminOnly, 
  upload.single('file'), 
  createMaterial
);
router.put(
  '/:id', 
  adminOnly, 
  upload.single('file'), 
  updateMaterial
);
router.delete('/:id', adminOnly, deleteMaterial);
router.post('/:id/download', incrementDownload);

module.exports = router;
