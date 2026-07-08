const mongoose = require('mongoose');

const PortfolioTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a template name'],
    unique: true,
    trim: true,
    lowercase: true
  },
  displayName: {
    type: String,
    required: [true, 'Please add a display name']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  previewImage: {
    type: String,
    default: ''
  },
  recommendedRoles: {
    type: [String],
    enum: ['frontend', 'backend', 'fullstack', 'ai-ml', 'mobile', 'devops'],
    default: []
  },
  defaultStructure: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Please add the default sections layout structure']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PortfolioTemplate', PortfolioTemplateSchema);
