const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const validateRequest = require('../middleware/validation');
const User = require('../models/User');

const router = express.Router();

// @desc    Update user developer role (onboarding)
// @route   PUT /api/user/role
// @access  Private
router.put(
  '/role',
  protect,
  [
    body('developerRole')
      .isIn(['frontend', 'backend', 'fullstack', 'ai-ml', 'mobile', 'devops'])
      .withMessage('Please select a valid developer track')
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        return next(error);
      }

      user.developerRole = req.body.developerRole;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Developer track updated successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          developerRole: user.developerRole,
          createdAt: user.createdAt
        }
      });
    } catch (err) {
      next(err);
    }
  }
);

// @desc    Update user profile settings
// @route   PUT /api/user/profile
// @access  Private
router.put(
  '/profile',
  protect,
  [
    body('username')
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Please provide a valid email address')
      .normalizeEmail(),
    body('developerRole')
      .optional()
      .isIn(['frontend', 'backend', 'fullstack', 'ai-ml', 'mobile', 'devops', 'none'])
      .withMessage('Please select a valid developer track'),
    body('password')
      .optional()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  validateRequest,
  async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        const error = new Error('User not found');
        error.statusCode = 404;
        return next(error);
      }

      const { username, email, developerRole, password } = req.body;

      // Check unique username
      if (username && username !== user.username) {
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
          const error = new Error('Username is already taken');
          error.statusCode = 400;
          return next(error);
        }
        user.username = username;
      }

      // Check unique email
      if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          const error = new Error('Email is already registered');
          error.statusCode = 400;
          return next(error);
        }
        user.email = email;
      }

      if (developerRole) {
        user.developerRole = developerRole;
      }

      if (password) {
        user.password = password;
      }

      await user.save();

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          developerRole: user.developerRole,
          createdAt: user.createdAt
        }
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
