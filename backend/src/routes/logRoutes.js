const express = require('express');
const { body } = require('express-validator');
const { toggleLog, getWeekGrid, getHeatmapLogs } = require('../controllers/logController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

// ─── Log Check-ins ───────────────────────────────────────
router.post(
  '/toggle',
  [
    body('habitId').isMongoId().withMessage('Valid Habit ID is required'),
    body('date')
      .matches(/^\d{4}-\d{2}-\d{2}$/)
      .withMessage('Date must be in YYYY-MM-DD format'),
    validate,
  ],
  toggleLog
);

// ─── Log Queries ─────────────────────────────────────────
router.get('/week', getWeekGrid);
router.get('/heatmap', getHeatmapLogs);
router.get('/heatmap/:habitId', getHeatmapLogs);

module.exports = router;
