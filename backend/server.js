// =============================================
// NCC 1 Maharashtra - Express Server Entry Point
// =============================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

const app = express();

// ── Connect to MongoDB ──

// ── Security Middleware ──
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// ── Rate Limiting ──
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// ── CORS ──
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// ── Body Parsing ──
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Compression ──
app.use(compression());

// ── Logging ──
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ── Static Files - Serve Frontend ──
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ── API Routes ──
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cadets', require('./routes/cadets'));
app.use('/api/camps', require('./routes/camps'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/study-materials', require('./routes/studyMaterials'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/dashboard', require('./routes/dashboard'));

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ── Serve Frontend for all non-API routes (SPA fallback) ──
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
  }
});

// ── Global Error Handler ──
app.use(require('./middleware/errorHandler'));

// ── Start Server ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════╗
║   NCC 1 Maharashtra - Server Started             ║
║   Port: ${PORT}                                      ║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(33)}║
║   Supabase: Connected                             ║
╚══════════════════════════════════════════════════╝
  `);
});

module.exports = app;
