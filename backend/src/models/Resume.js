const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    default: ''
  },
  extractedText: {
    type: String,
    required: true
  },
  ruleBasedResults: {
    score: {
      type: Number,
      default: 0
    },
    missingSections: {
      type: [String],
      default: []
    },
    weakActionVerbs: {
      type: [String],
      default: []
    },
    lengthCheck: {
      type: String,
      default: ''
    },
    hasContactInfo: {
      type: Boolean,
      default: false
    },
    hasEducation: {
      type: Boolean,
      default: false
    },
    hasProjects: {
      type: Boolean,
      default: false
    },
    hasSkills: {
      type: Boolean,
      default: false
    }
  },
  aiSuggestions: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Resume', ResumeSchema);
