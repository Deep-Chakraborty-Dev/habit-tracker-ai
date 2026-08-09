const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Habit name is required'],
      trim: true,
      maxlength: [100, 'Habit name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      default: 'Productivity',
      trim: true,
    },
    icon: {
      type: String,
      required: true,
      default: 'Check', // key of Lucide icon
    },
    color: {
      type: String,
      required: true,
      default: '#f59e0b', // hex or class
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'custom'],
      required: [true, 'Frequency is required'],
      default: 'daily',
    },
    targetDaysPerWeek: {
      type: Number,
      min: 1,
      max: 7,
      default: 5,
    },
    customDays: {
      type: [Number], // 0 (Sun) - 6 (Sat)
      validate: {
        validator: function (val) {
          if (this.frequency === 'custom') {
            return val && val.length > 0;
          }
          return true;
        },
        message: 'Custom frequency requires selecting at least one day.',
      },
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to help fetch a user's habits efficiently
habitSchema.index({ user: 1, isArchived: 1 });

const Habit = mongoose.model('Habit', habitSchema);

module.exports = Habit;
