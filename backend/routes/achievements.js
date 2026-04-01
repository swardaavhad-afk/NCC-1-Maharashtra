const express = require('express');
const router = express.Router();
const { 
  getAllAchievements, 
  getPublicGallery,
  createAchievement, 
  updateAchievement, 
  deleteAchievement, 
  getAchievementStats, 
  getCadetAchievements,
  approveAchievement
} = require('../controllers/achievementController');
const { protect, adminOnly, cadetOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/gallery', getPublicGallery);

router.use(protect);
router.get('/', adminOnly, getAllAchievements);
router.get('/stats', adminOnly, getAchievementStats);
router.get('/cadet/:cadetId', getCadetAchievements);

router.post(
  '/', 
  upload.fields([
    { name: 'certificate', maxCount: 1 }, 
    { name: 'campPhotos', maxCount: 5 }
  ]), 
  createAchievement
);

router.patch('/:id/approve', adminOnly, approveAchievement);

router.put(
  '/:id', 
  adminOnly, 
  upload.fields([
    { name: 'certificate', maxCount: 1 }, 
    { name: 'campPhotos', maxCount: 5 }
  ]), 
  updateAchievement
);

router.delete('/:id', adminOnly, deleteAchievement);

module.exports = router;
