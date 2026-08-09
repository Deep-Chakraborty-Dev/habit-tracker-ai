const express = require('express');
const { body } = require('express-validator');
const { signup, login, refresh, logout, me } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// ─── Signup Route ────────────────────────────────────────
router.post(
  '/signup',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Please provide a valid email address'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('timezone').optional().trim(),
    body('productiveTime')
      .optional()
      .isIn(['morning', 'afternoon', 'evening', 'night'])
      .withMessage('Invalid productive time preference'),
    validate,
  ],
  signup
);

// ─── Login Route ─────────────────────────────────────────
router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Please provide a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    validate,
  ],
  login
);

// ─── Token Refresh Route ─────────────────────────────────
router.post('/refresh', refresh);

// ─── Logout Route ────────────────────────────────────────
router.post('/logout', logout);

// ─── Protected Profile Route ─────────────────────────────
router.get('/me', protect, me);

module.exports = router;
