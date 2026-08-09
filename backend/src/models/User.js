const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
    },
    avatarColor: {
      type: String,
      default: '#f59e0b', // Default to amber-glow color
    },
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'dark',
    },
    timezone: {
      type: String,
      default: 'UTC',
    },
    productiveTime: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'night'],
      default: 'morning',
    },
  },
  {
    timestamps: true,
  }
);

// ─── Pre-save hook: Hash password if modified ────────────
userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return;

  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

// ─── Instance method: Compare passwords ──────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
