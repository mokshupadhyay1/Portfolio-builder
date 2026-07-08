const mongoose = require('mongoose');

const SectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['hero', 'about', 'skills', 'projects', 'experience', 'contact', 'footer']
  },
  title: {
    type: String,
    required: true
  },
  visible: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { _id: false });

const PortfolioSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  title: {
    type: String,
    required: [true, 'Please add a portfolio title'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  template: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PortfolioTemplate',
    required: true
  },
  theme: {
    primary: { type: String, required: true },
    secondary: { type: String, required: true },
    background: { type: String, required: true },
    text: { type: String, required: true },
    card: { type: String, required: true },
    fontFamily: { type: String, required: true },
    darkMode: { type: Boolean, default: true }
  },
  sections: [SectionSchema],
  isPublished: {
    type: Boolean,
    default: false,
    index: true
  },
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
