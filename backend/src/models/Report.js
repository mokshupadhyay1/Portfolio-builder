const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  reportedPortfolio: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Portfolio',
    required: false
  },
  type: {
    type: String,
    enum: ['inappropriate', 'spam', 'bug', 'feedback'],
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'resolved', 'ignored'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', ReportSchema);
