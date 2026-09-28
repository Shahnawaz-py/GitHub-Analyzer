require('dotenv').config();
const express = require('express');
const cors = require('cors');
const analyzerRoutes = require('./routes/analyzerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Allow frontend requests
  methods: ['GET', 'POST', 'OPTIONS'],
}));
app.use(express.json());

// Request logging in development
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// API Routes
app.use('/api', analyzerRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    name: 'GitHub Analyzer API',
    version: '1.0.0',
    description: 'High-performance Express API for GitHub metrics, profiling, and repository intelligence.',
    endpoints: {
      userAnalysis: 'GET /api/user/:username',
      repoAnalysis: 'GET /api/repo/:owner/:repo',
      userComparison: 'GET /api/compare?userA=:u1&userB=:u2',
      rateLimit: 'GET /api/ratelimit',
      health: 'GET /api/health',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`🚀 GitHub Analyzer Express API Running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🔑 GitHub Token: ${process.env.GITHUB_TOKEN ? 'Configured ✅ (5,000 req/hr)' : 'Unauthenticated (60 req/hr)'}`);
  console.log(`=========================================`);
});
