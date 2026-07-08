const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorHandler');
const auth = require('./routes/auth');
const user = require('./routes/user');
const portfolio = require('./routes/portfolio');
const resume = require('./routes/resume');
const admin = require('./routes/admin');

const app = express();

// Standard Middlewares
app.use(helmet());
app.use(cors({
  origin: '*', // Adjust origins later for production
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DevLaunch API is healthy and running',
    timestamp: new Date(),
    env: process.env.NODE_ENV
  });
});

// Mount Routes
app.use('/api/auth', auth);
app.use('/api/user', user);
app.use('/api/portfolio', portfolio);
app.use('/api/resume', resume);
app.use('/api/admin', admin);

// Root API Welcome Route
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the DevLaunch API'
  });
});

// Catch-all route for unhandled routes
app.use('*', (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`);
  error.statusCode = 404;
  next(error);
});

// Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;
