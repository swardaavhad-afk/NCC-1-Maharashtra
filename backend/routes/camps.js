// =============================================
// Camp Routes
// =============================================
const express = require('express');
const router = express.Router();
const { getAllCamps, getCamp, createCamp, updateCamp, deleteCamp, registerForCamp } = require('../controllers/campController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.get('/', getAllCamps);
router.get('/:id', getCamp);
router.post('/', adminOnly, createCamp);
router.put('/:id', adminOnly, updateCamp);
router.delete('/:id', adminOnly, deleteCamp);
router.post('/:id/register', registerForCamp);

module.exports = router;
