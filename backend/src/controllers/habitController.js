const Habit = require('../models/Habit');
// We will require HabitLog model to delete logs when deleting a habit
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Create a new habit.
 */
const createHabit = asyncHandler(async (req, res) => {
  const {
    name,
    category,
    icon,
    color,
    frequency,
    targetDaysPerWeek,
    customDays,
  } = req.body;

  const habit = await Habit.create({
    user: req.user._id,
    name,
    category,
    icon,
    color,
    frequency,
    targetDaysPerWeek: frequency === 'weekly' ? targetDaysPerWeek : undefined,
    customDays: frequency === 'custom' ? customDays : undefined,
  });

  return ApiResponse.created(res, habit, 'Habit created successfully');
});

/**
 * Get active or archived habits for the authenticated user.
 */
const getHabits = asyncHandler(async (req, res) => {
  const isArchived = req.query.archived === 'true';

  const habits = await Habit.find({
    user: req.user._id,
    isArchived,
  }).sort({ createdAt: -1 });

  return ApiResponse.success(res, habits, 'Habits retrieved successfully');
});

/**
 * Update a habit's core details.
 */
const updateHabit = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    name,
    category,
    icon,
    color,
    frequency,
    targetDaysPerWeek,
    customDays,
  } = req.body;

  // Find habit and check ownership
  const habit = await Habit.findOne({ _id: id, user: req.user._id });
  if (!habit) {
    throw new ApiError(404, 'Habit not found or not authorised');
  }

  // Update properties
  habit.name = name ?? habit.name;
  habit.category = category ?? habit.category;
  habit.icon = icon ?? habit.icon;
  habit.color = color ?? habit.color;
  habit.frequency = frequency ?? habit.frequency;

  if (frequency === 'weekly') {
    habit.targetDaysPerWeek = targetDaysPerWeek;
    habit.customDays = undefined;
  } else if (frequency === 'custom') {
    habit.customDays = customDays;
    habit.targetDaysPerWeek = undefined;
  } else if (frequency === 'daily') {
    habit.targetDaysPerWeek = undefined;
    habit.customDays = undefined;
  }

  await habit.save();

  return ApiResponse.success(res, habit, 'Habit updated successfully');
});

/**
 * Toggle archiving status of a habit.
 */
const toggleArchiveHabit = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const habit = await Habit.findOne({ _id: id, user: req.user._id });
  if (!habit) {
    throw new ApiError(404, 'Habit not found or not authorised');
  }

  habit.isArchived = !habit.isArchived;
  await habit.save();

  return ApiResponse.success(
    res,
    habit,
    `Habit successfully ${habit.isArchived ? 'archived' : 'unarchived'}`
  );
});

/**
 * Delete a habit and all of its associated logs.
 */
const deleteHabit = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const habit = await Habit.findOneAndDelete({ _id: id, user: req.user._id });
  if (!habit) {
    throw new ApiError(404, 'Habit not found or not authorised');
  }

  // Delete all logs linked to this habit to prevent orphaned records in our logs collection
  // Require lazy loaded HabitLog to avoid circular dependencies if any
  try {
    const HabitLog = require('../models/HabitLog');
    if (HabitLog) {
      await HabitLog.deleteMany({ habit: id });
    }
  } catch (err) {
    // If HabitLog model is not registered yet, we handle it gracefully.
    // It will be created in Phase 4.
    console.log('Skipping log deletion, model not yet registered');
  }

  return ApiResponse.success(res, null, 'Habit and logs deleted successfully');
});

module.exports = {
  createHabit,
  getHabits,
  updateHabit,
  toggleArchiveHabit,
  deleteHabit,
};
