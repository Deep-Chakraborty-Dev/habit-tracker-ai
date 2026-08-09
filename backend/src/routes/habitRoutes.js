const express = require('express');
const { body } = require('express-validator');
const {
  createHabit,
  getHabits,
  updateHabit,
  toggleArchiveHabit,
  deleteHabit,
} = require('../controllers/habitController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Apply auth protection to all routes
router.use(protect);

// ─── Get/Create Habits ───────────────────────────────────
router.route('/')
  .get(getHabits)
  .post(
    [
      body('name').trim().notEmpty().withMessage('Habit name is required'),
      body('category').trim().notEmpty().withMessage('Category is required'),
      body('icon').trim().notEmpty().withMessage('Icon is required'),
      body('color').trim().notEmpty().withMessage('Color is required'),
      body('frequency')
        .isIn(['daily', 'weekly', 'custom'])
        .withMessage('Frequency must be daily, weekly, or custom'),
      body('targetDaysPerWeek')
        .optional()
        .isInt({ min: 1, max: 7 })
        .withMessage('Target days per week must be between 1 and 7'),
      body('customDays')
        .optional()
        .isArray()
        .withMessage('Custom days must be an array of numbers (0-6)'),
      validate,
    ],
    createHabit
  );

// ─── CRUD per habit ID ───────────────────────────────────
router.route('/:id')
  .put(
    [
      body('name').optional().trim().notEmpty().withMessage('Habit name cannot be empty'),
      body('category').optional().trim().notEmpty().withMessage('Category cannot be empty'),
      body('icon').optional().trim().notEmpty().withMessage('Icon cannot be empty'),
      body('color').optional().trim().notEmpty().withMessage('Color cannot be empty'),
      body('frequency')
        .optional()
        .isIn(['daily', 'weekly', 'custom'])
        .withMessage('Frequency must be daily, weekly, or custom'),
      body('targetDaysPerWeek')
        .optional()
        .isInt({ min: 1, max: 7 })
        .withMessage('Target days per week must be between 1 and 7'),
      body('customDays')
        .optional()
        .isArray()
        .withMessage('Custom days must be an array of numbers (0-6)'),
      validate,
    ],
    updateHabit
  )
  .delete(deleteHabit);

// Archive toggler
router.patch('/:id/archive', toggleArchiveHabit);

module.exports = router;
