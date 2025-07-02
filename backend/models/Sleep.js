const mongoose = require('mongoose');

const sleepSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  quality: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  sleepStages: {
    deep: Number,
    light: Number,
    rem: Number,
    awake: Number
  },
  notes: String
}, { timestamps: true });

module.exports = mongoose.model('Sleep', sleepSchema); 