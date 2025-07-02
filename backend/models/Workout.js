const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  type: { type: String, required: true },
  duration: { type: Number, required: true },
  distance: { type: Number },
  weight: { type: Number },
  measure: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema); 