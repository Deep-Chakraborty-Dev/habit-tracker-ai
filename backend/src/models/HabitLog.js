const mongoose = require('mongoose');

const habitLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    habit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Habit',
      required: true,
    },
    date: {
      type: String, // 'YYYY-MM-DD'
      required: true,
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index: A habit can only have one check-in log per date
habitLogSchema.index({ habit: 1, date: 1 }, { unique: true });
// Index on user and date to quickly fetch all logs for a user on a specific day
habitLogSchema.index({ user: 1, date: 1 });

const HabitLog = mongoose.model('HabitLog', habitLogSchema);

module.exports = HabitLog;
