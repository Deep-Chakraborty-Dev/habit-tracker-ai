const rateLimit = require('express-rate-limit');
const ApiResponse = require('../utils/apiResponse');

/**
 * Rate limiter middleware for AI endpoints.
 * Limits calls to 20 requests per hour per user/IP to control Google Gemini API costs.
 */
const aiRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 20, // Limit each IP/user to 20 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  validate: { trustProxy: false }, // Disable IP trust validations on development localhost
  handler: (req, res) => {
    return ApiResponse.error(
      res,
      'Too many AI requests. Please wait an hour before requesting more coaching reports.',
      429
    );
  },
  keyGenerator: (req) => {
    // Rate limit by user ID (always populated by auth protect middleware)
    return req.user ? req.user._id.toString() : 'anonymous';
  },
});

module.exports = {
  aiRateLimiter,
};
