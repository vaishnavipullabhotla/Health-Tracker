const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Goal = require('../models/Goal');

// Create a new goal
router.post('/', protect, async (req, res) => {
  try {
    const { name, target, unit } = req.body;
    
    const goal = await Goal.create({
      userId: req.user.id,
      name,
      target,
      unit
    });

    res.status(201).json(goal);
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all goals for the current user
router.get('/', protect, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.id });
    res.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update a goal
router.put('/:id', protect, async (req, res) => {
  try {
    const { progress } = req.body;
    
    if (typeof progress !== 'number' || progress < 0) {
      return res.status(400).json({ message: 'Invalid progress value' });
    }

    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user.id });
    
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    // Update progress
    goal.progress = progress;
    
    // Calculate remaining percentage
    goal.remaining = Math.max(0, Math.round(((goal.target - goal.progress) / goal.target) * 100));
    
    // Check if goal is completed
    if (goal.progress >= goal.target) {
      goal.type = 'completed';
      goal.points = Math.round(goal.target * 10); // Award points based on target value
    } else {
      goal.type = 'active';
    }

    const updatedGoal = await goal.save();
    res.json(updatedGoal);
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete a goal
router.delete('/:id', protect, async (req, res) => {
  try {
    console.log('Attempting to delete goal:', {
      goalId: req.params.id,
      userId: req.user.id
    });

    const goal = await Goal.findByIdAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!goal) {
      console.log('Goal not found for:', {
        goalId: req.params.id,
        userId: req.user.id
      });
      return res.status(404).json({ message: 'Goal not found' });
    }

    console.log('Goal deleted successfully');
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router; 