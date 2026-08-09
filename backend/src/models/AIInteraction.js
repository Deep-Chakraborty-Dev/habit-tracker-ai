const mongoose = require('mongoose');

const aiInteractionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['weekly_report', 'suggestion', 'recovery_plan', 'chat', 'morning_motivation'],
      required: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index to quickly query recent interactions for a user
aiInteractionSchema.index({ user: 1, type: 1, createdAt: -1 });

const AIInteraction = mongoose.model('AIInteraction', aiInteractionSchema);

module.exports = AIInteraction;
