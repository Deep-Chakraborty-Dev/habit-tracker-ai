const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const ApiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Get overview stats: active streaks, best streak, total habits, completion rate.
 */
const getOverviewStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1. Get habits
  const habits = await Habit.find({ user: userId, isArchived: false });

  // Compute streaks info
  const activeStreaksCount = habits.filter((h) => h.currentStreak > 0).length;
  const bestStreak = Math.max(...habits.map((h) => h.currentStreak || 0), 0);
  const longestStreak = Math.max(...habits.map((h) => h.longestStreak || 0), 0);

  // 2. Compute completion rate: total completed logs / total possible logs since creation
  // Let's count how many completed logs exist
  const totalCompleted = await HabitLog.countDocuments({
    user: userId,
    completed: true,
  });

  // Calculate standard completion rate
  // completions today/this week. Let's send a simplified completion rate based on logs in last 30 days
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const thirtyDaysAgoStr = thirtyDaysAgo.toLocaleDateString('en-CA', { timeZone: req.user.timezone || 'UTC' });

  const totalLogs30Days = await HabitLog.countDocuments({
    user: userId,
    date: { $gte: thirtyDaysAgoStr },
  });

  const completedLogs30Days = await HabitLog.countDocuments({
    user: userId,
    date: { $gte: thirtyDaysAgoStr },
    completed: true,
  });

  const completionRate30Days = totalLogs30Days > 0 ? (completedLogs30Days / totalLogs30Days) * 100 : 0;

  return ApiResponse.success(res, {
    activeStreaksCount,
    bestStreak,
    longestStreak,
    completionRate: Math.round(completionRate30Days),
    totalActiveHabits: habits.length,
  }, 'Overview stats calculated successfully');
});

/**
 * Get category breakdown of habits (for donut chart).
 */
const getCategoryBreakdown = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const habits = await Habit.find({ user: userId, isArchived: false });

  const categoryCounts = {};
  habits.forEach((h) => {
    categoryCounts[h.category] = (categoryCounts[h.category] || 0) + 1;
  });

  const data = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
    value: categoryCounts[cat],
  }));

  return ApiResponse.success(res, data, 'Category breakdown retrieved successfully');
});

/**
 * Get monthly check-ins for the last 6 months (for bar chart).
 */
const getMonthlyStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const timezone = req.user.timezone || 'UTC';

  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(today.getMonth() - 5);
  sixMonthsAgo.setDate(1); // Start of month
  const startDateStr = sixMonthsAgo.toLocaleDateString('en-CA', { timeZone: timezone });

  // Get completed logs for last 6 months
  const logs = await HabitLog.find({
    user: userId,
    date: { $gte: startDateStr },
    completed: true,
  });

  // Group by month YYYY-MM
  const monthlyCounts = {};
  logs.forEach((log) => {
    const monthKey = log.date.substring(0, 7); // 'YYYY-MM'
    monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
  });

  // Build sequential array of last 6 months
  const statsData = [];
  const monthCursor = new Date(sixMonthsAgo);

  for (let i = 0; i < 6; i++) {
    const monthKey = monthCursor.toISOString().substring(0, 7); // 'YYYY-MM'
    const monthName = monthCursor.toLocaleDateString('en-US', { month: 'short' });
    statsData.push({
      month: monthName,
      completions: monthlyCounts[monthKey] || 0,
    });
    monthCursor.setMonth(monthCursor.getMonth() + 1);
  }

  return ApiResponse.success(res, statsData, 'Monthly completion stats retrieved successfully');
});

/**
 * Get per-habit performance rates.
 */
const getPerHabitPerformance = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const habits = await Habit.find({ user: userId, isArchived: false });

  const performance = await Promise.all(
    habits.map(async (habit) => {
      const totalCount = await HabitLog.countDocuments({ habit: habit._id });
      const completedCount = await HabitLog.countDocuments({ habit: habit._id, completed: true });

      const rate = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

      return {
        _id: habit._id,
        name: habit.name,
        color: habit.color,
        icon: habit.icon,
        completions: completedCount,
        completionRate: Math.round(rate),
      };
    })
  );

  // Sort by highest completion rate descending
  performance.sort((a, b) => b.completionRate - a.completionRate);

  return ApiResponse.success(res, performance, 'Per habit performance retrieved successfully');
});

module.exports = {
  getOverviewStats,
  getCategoryBreakdown,
  getMonthlyStats,
  getPerHabitPerformance,
};
