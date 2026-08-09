const express = require('express');
const {
  getOverviewStats,
  getCategoryBreakdown,
  getMonthlyStats,
  getPerHabitPerformance,
} = require('../controllers/statsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/overview', getOverviewStats);
router.get('/monthly', getMonthlyStats);
router.get('/category-breakdown', getCategoryBreakdown);
router.get('/per-habit-performance', getPerHabitPerformance);

module.exports = router;
