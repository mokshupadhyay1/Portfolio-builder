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

module.exports = router;
