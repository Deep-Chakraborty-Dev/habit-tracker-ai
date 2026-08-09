const express = require('express');
const { body } = require('express-validator');
const {
  getWeeklyCoachingReport,
  getSuggestedHabits,
  getComebackPlan,
  postChatAsk,
  getDailyMotivation,
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');

const router = express.Router();

// Apply auth protection & AI rate limiting to all endpoints
router.use(protect);
router.use(aiRateLimiter);

// ─── AI Routines ─────────────────────────────────────────
router.post('/weekly-report', getWeeklyCoachingReport);

router.post(
  '/suggestions',
  [
    body('goals').trim().notEmpty().withMessage('Goals are required for custom suggestions'),
    validate,
  ],
  getSuggestedHabits
);

router.get('/recovery-plan/:habitId', getComebackPlan);

router.post(
  '/chat',
  [
    body('message').trim().notEmpty().withMessage('Chat question message is required'),
    validate,
  ],
  postChatAsk
);

router.get('/morning-motivation', getDailyMotivation);

module.exports = router;
