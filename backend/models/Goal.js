const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a goal name']
  },
  type: {
    type: String,
    enum: ['active', 'completed'],
    default: 'active'
  },
  progress: {
    type: Number,
    default: 0
  },
  target: {
    type: Number,
    required: [true, 'Please add a target value']
  },
  unit: {
    type: String,
    required: [true, 'Please add a unit']
  },
  remaining: {
    type: Number,
    default: 100
  },
  points: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Goal', goalSchema); 