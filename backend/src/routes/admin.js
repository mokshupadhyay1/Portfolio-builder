const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Resume = require('../models/Resume');
const Report = require('../models/Report');

const router = express.Router();

// Apply protect & authorize('admin') to all routes in this file
router.use(protect);
router.use(authorize('admin'));

// @desc    Get system statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'developer' });
    const totalPortfolios = await Portfolio.countDocuments();
    const publishedPortfolios = await Portfolio.countDocuments({ isPublished: true });
    const totalResumes = await Resume.countDocuments();
    const pendingReports = await Report.countDocuments({ status: 'pending' });

    res.status(200).json({
      success: true,
      data: {
        users: totalUsers,
        portfolios: totalPortfolios,
        publishedPortfolios,
        resumes: totalResumes,
        reports: pendingReports
      }
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get all users list
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find({ role: 'developer' }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Delete a user and cascade delete portfolios/resumes
// @route   DELETE /api/admin/users/:userId
// @access  Private/Admin
router.delete('/users/:userId', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      return next(error);
    }

    // Cascade delete portfolios, resumes and reports
    await Portfolio.deleteMany({ user: user._id });
    await Resume.deleteMany({ user: user._id });
    await Report.deleteMany({ reporter: user._id });
    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User and all associated portfolios/resumes deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get all portfolios
// @route   GET /api/admin/portfolios
// @access  Private/Admin
router.get('/portfolios', async (req, res, next) => {
  try {
    const portfolios = await Portfolio.find()
      .populate('user', 'username email developerRole')
      .populate('template', 'name displayName')
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: portfolios
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Toggle publish status of a portfolio
// @route   PUT /api/admin/portfolios/:portfolioId/publish
// @access  Private/Admin
router.put('/portfolios/:portfolioId/publish', async (req, res, next) => {
  try {
    const { isPublished } = req.body;
    const portfolio = await Portfolio.findById(req.params.portfolioId);
    if (!portfolio) {
      const error = new Error('Portfolio not found');
      error.statusCode = 404;
      return next(error);
    }

    portfolio.isPublished = !!isPublished;
    await portfolio.save();

    res.status(200).json({
      success: true,
      message: `Portfolio successfully ${portfolio.isPublished ? 'published' : 'unpublished'}`,
      data: portfolio
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Delete a portfolio
// @route   DELETE /api/admin/portfolios/:portfolioId
// @access  Private/Admin
router.delete('/portfolios/:portfolioId', async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findById(req.params.portfolioId);
    if (!portfolio) {
      const error = new Error('Portfolio not found');
      error.statusCode = 404;
      return next(error);
    }

    await portfolio.deleteOne();
    res.status(200).json({
      success: true,
      message: 'Portfolio deleted successfully'
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Private/Admin
router.get('/reports', async (req, res, next) => {
  try {
    const reports = await Report.find()
      .populate('reporter', 'username email')
      .populate({
        path: 'reportedPortfolio',
        select: 'title slug isPublished',
        populate: { path: 'user', select: 'username' }
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: reports
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Resolve or ignore a report
// @route   PUT /api/admin/reports/:reportId
// @access  Private/Admin
router.put('/reports/:reportId', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['resolved', 'ignored'].includes(status)) {
      const error = new Error('Invalid report status. Use resolved or ignored');
      error.statusCode = 400;
      return next(error);
    }

    const report = await Report.findById(req.params.reportId);
    if (!report) {
      const error = new Error('Report not found');
      error.statusCode = 404;
      return next(error);
    }

    report.status = status;
    await report.save();

    res.status(200).json({
      success: true,
      message: `Report status updated to ${status}`,
      data: report
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
