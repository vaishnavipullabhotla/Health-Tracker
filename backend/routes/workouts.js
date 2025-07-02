const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Workout = require('../models/Workout');

// Add new workout with debug logging
router.post('/', protect, async (req, res) => {
  try {
    const workout = new Workout({
      ...req.body,
      user: req.user.id
    });
    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    console.error('Failed to add workout:', error);
    res.status(500).json({ message: 'Failed to add workout', error: error.message });
  }
});

module.exports = router; 