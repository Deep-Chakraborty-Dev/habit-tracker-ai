const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');

/**
 * Create and configure the Express application.
 */
const app = express();

// Enable proxy trusting (needed for express-rate-limit on local/render servers)
app.set('trust proxy', 1);

// ─── Security ────────────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// ─── Body & Cookie parsing ────────────────────────────────
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// ─── Health check ────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Momentum API is running 🚀' });
});

// ─── Routes ──────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/habits', require('./routes/habitRoutes'));
app.use('/api/logs', require('./routes/logRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// ─── Global error handler (must be last) ─────────────────
app.use(errorHandler);

module.exports = app;
