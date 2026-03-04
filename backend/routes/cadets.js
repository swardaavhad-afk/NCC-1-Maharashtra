// =============================================
// Cadet Routes
// =============================================
const express = require('express');
const router = express.Router();
const { getAllCadets, getCadet, updateCadet, deleteCadet, getCadetStats } = require('../controllers/cadetController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.get('/stats/overview', adminOnly, getCadetStats);
router.get('/', adminOnly, getAllCadets);
router.get('/:id', getCadet);
router.put('/:id', adminOnly, updateCadet);
router.delete('/:id', adminOnly, deleteCadet);

module.exports = router;
