const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// ─── Token Helpers ───────────────────────────────────────
const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
};

const setRefreshTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('momentum_refresh_token', token, {
    httpOnly: true,
    secure: isProduction, // HTTPS in production
    sameSite: isProduction ? 'none' : 'lax', // Lax for dev, None for cross-site prod
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days matching token lifespan
  });
};

// ─── Controller Handlers ─────────────────────────────────

/**
 * Register a new user.
 */
const signup = asyncHandler(async (req, res) => {
  const { name, email, password, timezone, productiveTime } = req.body;

  // 1. Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'User with this email already exists');
  }

  // 2. Select a random avatar background color from a sleek dark-mode palette
  const avatarColors = [
    '#f59e0b', // Amber Glow
    '#a855f7', // Purple Accent
    '#34d399', // Emerald Accent
    '#fb7185', // Rose Accent
    '#38bdf8', // Sky Accent
  ];
  const avatarColor = avatarColors[Math.floor(Math.random() * avatarColors.length)];

  // 3. Create user (password hash handled by pre-save hook)
  const user = await User.create({
    name,
    email,
    passwordHash: password, // Pre-save hook hashes this
    avatarColor,
    timezone: timezone || 'UTC',
    productiveTime: productiveTime || 'morning',
  });

  // 4. Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // 5. Set refresh token in cookie
  setRefreshTokenCookie(res, refreshToken);

  // 6. Return response
  return ApiResponse.created(res, {
    token: accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatarColor: user.avatarColor,
      theme: user.theme,
      timezone: user.timezone,
      productiveTime: user.productiveTime,
    },
  }, 'Registration successful');
});

/**
 * Login user.
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // 1. Find user
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // 2. Verify password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // 3. Generate tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // 4. Set cookie
  setRefreshTokenCookie(res, refreshToken);

  // 5. Send response
  return ApiResponse.success(res, {
    token: accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      avatarColor: user.avatarColor,
      theme: user.theme,
      timezone: user.timezone,
      productiveTime: user.productiveTime,
    },
  }, 'Login successful');
});

/**
 * Refresh access token.
 */
const refresh = asyncHandler(async (req, res) => {
  // Read refresh token from cookies
  const refreshToken = req.cookies.momentum_refresh_token;

  if (!refreshToken) {
    throw new ApiError(401, 'No refresh token provided');
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    // Generate new access token
    const accessToken = generateAccessToken(user);

    return ApiResponse.success(res, { token: accessToken }, 'Token refreshed successfully');
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
});

/**
 * Logout user.
 */
const logout = asyncHandler(async (req, res) => {
  // Clear cookie
  res.clearCookie('momentum_refresh_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  return ApiResponse.success(res, null, 'Logged out successfully');
});

/**
 * Get current authenticated user details.
 */
const me = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, {
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatarColor: req.user.avatarColor,
      theme: req.user.theme,
      timezone: req.user.timezone,
      productiveTime: req.user.productiveTime,
    },
  }, 'User context retrieved');
});

module.exports = {
  signup,
  login,
  refresh,
  logout,
  me,
};
