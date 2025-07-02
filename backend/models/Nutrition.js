const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  meals: [{
    name: {
      type: String,
      required: true
    },
    time: {
      type: String,
      required: true
    },
    items: [{
      name: {
        type: String,
        required: true
      },
      protein: {
        type: Number,
        required: true
      },
      carbs: {
        type: Number,
        required: true
      },
      fat: {
        type: Number,
        required: true
      },
      calories: {
        type: Number,
        required: true
      }
    }]
  }],
  dailySummary: {
    calories: {
      type: Number,
      default: 0
    },
    protein: {
      type: Number,
      default: 0
    },
    carbs: {
      type: Number,
      default: 0
    },
    fat: {
      type: Number,
      default: 0
    }
  },
  nutrientDetails: {
    macros: {
      protein: {
        current: {
          type: Number,
          default: 0
        },
        target: {
          type: Number,
          default: 150
        }
      },
      carbs: {
        current: {
          type: Number,
          default: 0
        },
        target: {
          type: Number,
          default: 200
        }
      },
      fat: {
        current: {
          type: Number,
          default: 0
        },
        target: {
          type: Number,
          default: 65
        }
      }
    },
    hydration: {
      water: {
        current: {
          type: Number,
          default: 0
        },
        target: {
          type: Number,
          default: 8
        }
      }
    }
  }
}, {
  timestamps: true
});

// Create compound index for userId and date
nutritionSchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Nutrition', nutritionSchema); 