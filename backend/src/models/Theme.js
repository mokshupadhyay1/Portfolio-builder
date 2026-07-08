const mongoose = require('mongoose');

const ThemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a theme name'],
    unique: true,
    trim: true
  },
  colors: {
    primary: {
      type: String,
      required: [true, 'Please add a primary color hex']
    },
    secondary: {
      type: String,
      required: [true, 'Please add a secondary color hex']
    },
    background: {
      type: String,
      required: [true, 'Please add a background color hex']
    },
    text: {
      type: String,
      required: [true, 'Please add a text color hex']
    },
    card: {
      type: String,
      required: [true, 'Please add a card background color hex']
    }
  },
  fontFamily: {
    type: String,
    required: [true, 'Please add a font family'],
    default: 'Inter'
  },
  isCustom: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Theme', ThemeSchema);
