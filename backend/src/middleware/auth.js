const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  // Read Token from headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    const error = new Error('Not authorized to access this route');
    error.statusCode = 401;
    return next(error);
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user and attach to request
    req.user = await User.findById(decoded.id);
    if (!req.user) {
      const error = new Error('No user found with this token');
      error.statusCode = 401;
      return next(error);
    }

    next();
  } catch (err) {
    const error = new Error('Not authorized to access this route');
    error.statusCode = 401;
    return next(error);
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const error = new Error(`User role '${req.user?.role || 'none'}' is not authorized to access this route`);
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
};
