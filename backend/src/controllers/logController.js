const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const { calculateStreaks } = require('../services/streakService');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

// ─── Local Date Helpers ──────────────────────────────────
const getDateString = (date, timezone) => {
  return date.toLocaleDateString('en-CA', { timeZone: timezone });
};

const parseDateString = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const getWeekRange = (weekOffset, timezone) => {
  const todayStr = getDateString(new Date(), timezone);
  const today = parseDateString(todayStr);

  const currentDay = today.getDay(); // 0 is Sunday
  // Shift to start week on Monday (1). Sunday becomes index 7 instead of 0
  const dayShift = currentDay === 0 ? -6 : 1 - currentDay;

  const monday = new Date(today);
  monday.setDate(today.getDate() + dayShift + weekOffset * 7);

  const range = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    range.push(getDateString(day, timezone));
  }
  return range;
};

// ─── Controllers ─────────────────────────────────────────

/**
 * Toggle check-in status for a habit on a specific date.
 * Recalculates streak server-side on each toggle.
 */
const toggleLog = asyncHandler(async (req, res) => {
  const { habitId, date } = req.body;

  // 1. Verify habit ownership
  const habit = await Habit.findOne({ _id: habitId, user: req.user._id });
  if (!habit) {
    throw new ApiError(404, 'Habit not found or not authorised');
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!date || !dateRegex.test(date)) {
    throw new ApiError(400, 'Invalid date format. Expected YYYY-MM-DD.');
  }

  // 2. Find existing log
  let log = await HabitLog.findOne({ habit: habitId, date });

  if (log) {
    log.completed = !log.completed;
    await log.save();
  } else {
    log = await HabitLog.create({
      user: req.user._id,
      habit: habitId,
      date,
      completed: true,
    });
  }

  // 3. Recalculate streaks
  const { currentStreak, longestStreak } = await calculateStreaks(habit, req.user.timezone || 'UTC');

  // 4. Update streaks on habit
  habit.currentStreak = currentStreak;
  habit.longestStreak = longestStreak;
  await habit.save();

  return ApiResponse.success(
    res,
    { log, habit },
    `Habit check-in toggled. Streak is now ${currentStreak}.`
  );
});

/**
 * Get 7-day grid logs for all habits given a weekOffset.
 */
const getWeekGrid = asyncHandler(async (req, res) => {
  const weekOffset = parseInt(req.query.weekOffset, 10) || 0;
  const timezone = req.user.timezone || 'UTC';
  
  const weekDates = getWeekRange(weekOffset, timezone);
  const startDateStr = weekDates[0];
  const endDateStr = weekDates[6];

  // Get active habits
  const habits = await Habit.find({ user: req.user._id, isArchived: false });

  // Get all completed logs for user within this week range
  const logs = await HabitLog.find({
    user: req.user._id,
    date: { $gte: startDateStr, $lte: endDateStr },
    completed: true,
  });

  // Map logs to habitId -> date -> completed mapping
  const logMap = {};
  logs.forEach((log) => {
    const hId = log.habit.toString();
    if (!logMap[hId]) logMap[hId] = {};
    logMap[hId][log.date] = true;
  });

  // Construct grid rows
  const grid = habits.map((habit) => {
    const hId = habit._id.toString();
    const completions = weekDates.map((date) => ({
      date,
      completed: !!(logMap[hId] && logMap[hId][date]),
    }));

    return {
      habit,
      completions,
    };
  });

  return ApiResponse.success(res, { dates: weekDates, grid }, 'Week grid retrieved successfully');
});

/**
 * Get last 90 days of logs for a user (aggregated across all habits, or for a specific habit).
 */
const getHeatmapLogs = asyncHandler(async (req, res) => {
  const { habitId } = req.params;
  const timezone = req.user.timezone || 'UTC';

  const todayStr = getDateString(new Date(), timezone);
  const today = parseDateString(todayStr);

  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 90);
  const startDateStr = getDateString(startDate, timezone);

  const query = {
    user: req.user._id,
    date: { $gte: startDateStr, $lte: todayStr },
    completed: true,
  };

  if (habitId) {
    query.habit = habitId;
  }

  const logs = await HabitLog.find(query);

  // Group by date and count completions
  const completionCounts = {};
  logs.forEach((log) => {
    completionCounts[log.date] = (completionCounts[log.date] || 0) + 1;
  });

  // Construct heatmap data array for 90 days
  const heatmapData = [];
  const dateCursor = new Date(startDate);
  
  while (dateCursor <= today) {
    const dateStr = getDateString(dateCursor, timezone);
    heatmapData.push({
      date: dateStr,
      count: completionCounts[dateStr] || 0,
    });
    dateCursor.setDate(dateCursor.getDate() + 1);
  }

  return ApiResponse.success(res, heatmapData, 'Heatmap data retrieved successfully');
});

module.exports = {
  toggleLog,
  getWeekGrid,
  getHeatmapLogs,
};
