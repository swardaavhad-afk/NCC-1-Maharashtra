// =============================================
// Achievement Routes
// =============================================
const express = require('express');
const router = express.Router();
const { getAllAchievements, createAchievement, updateAchievement, deleteAchievement, getAchievementStats, getCadetAchievements } = require('../controllers/achievementController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.get('/', getAllAchievements);
router.get('/stats', getAchievementStats);
router.get('/cadet/:cadetId', getCadetAchievements);
router.post('/', adminOnly, createAchievement);
router.put('/:id', adminOnly, updateAchievement);
router.delete('/:id', adminOnly, deleteAchievement);

module.exports = router;
