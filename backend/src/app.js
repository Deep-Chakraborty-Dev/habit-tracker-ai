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

// Build allowed origins list (production + local dev)
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL.replace(/\/+$/, '')); // strip trailing slash
}

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// ─── Body & Cookie parsing ────────────────────────────────
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

// ─── Health check ────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'AI-Tracker API is running 🚀' });
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
