const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Protect middleware: Ensures the request has a valid JWT access token.
 * Extracts the token, verifies it, and attaches the user object to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Get token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorised, no token provided');
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Find user and attach to req
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      throw new ApiError(401, 'Not authorised, user not found');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Not authorised, token has expired');
    }
    throw new ApiError(401, 'Not authorised, invalid token');
  }
});

module.exports = { protect };
