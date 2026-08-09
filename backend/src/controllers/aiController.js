const Habit = require('../models/Habit');
const HabitLog = require('../models/HabitLog');
const AIInteraction = require('../models/AIInteraction');
const geminiService = require('../services/ai/geminiService');
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

// ─── Controller Handlers ─────────────────────────────────

/**
 * Generate a weekly coaching report grounded in last 7 days' logs.
 */
const getWeeklyCoachingReport = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const timezone = req.user.timezone || 'UTC';

  // Find user's active habits
  const habits = await Habit.find({ user: userId, isArchived: false });

  // Get logs for the last 7 days
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);
  const startDateStr = getDateString(sevenDaysAgo, timezone);

  const logs = await HabitLog.find({
    user: userId,
    date: { $gte: startDateStr },
  });

  // Compile data maps for prompt grounding
  const habitsSummary = habits.map((h) => ({
    name: h.name,
    category: h.category,
    frequency: h.frequency,
    currentStreak: h.currentStreak,
    longestStreak: h.longestStreak,
  }));

  const logsSummary = logs.map((l) => ({
    habitId: l.habit,
    date: l.date,
    completed: l.completed,
  }));

  // Call Gemini service
  const report = await geminiService.generateWeeklyReport(habitsSummary, logsSummary);

  // Save report to AI interactions history
  await AIInteraction.create({
    user: userId,
    type: 'weekly_report',
    payload: report,
  });

  return ApiResponse.success(res, report, 'Weekly coaching report generated');
});

/**
 * Handle habit suggestions wizard based on user objectives.
 */
const getSuggestedHabits = asyncHandler(async (req, res) => {
  const { goals, productiveTime, pastStruggles } = req.body;

  if (!goals) {
    throw new ApiError(400, 'Goals details are required');
  }

  // Call Gemini suggestions suggestions
  const suggestions = await geminiService.generateSuggestions(
    goals,
    productiveTime || req.user.productiveTime || 'morning',
    pastStruggles || ''
  );

  return ApiResponse.success(res, suggestions, 'Habit suggestions generated successfully');
});

/**
 * Generate a comeback plan for a broken streak.
 */
const getComebackPlan = asyncHandler(async (req, res) => {
  const { habitId } = req.params;
  const timezone = req.user.timezone || 'UTC';

  const habit = await Habit.findOne({ _id: habitId, user: req.user._id });
  if (!habit) {
    throw new ApiError(404, 'Habit not found');
  }

  // Find the last completed log
  const lastLog = await HabitLog.findOne({
    habit: habitId,
    completed: true,
  }).sort({ date: -1 });

  let daysSinceBreak = 7; // Default fallback
  if (lastLog) {
    const todayStr = getDateString(new Date(), timezone);
    const today = parseDateString(todayStr);
    const lastLogDate = parseDateString(lastLog.date);
    const diffTime = Math.abs(today - lastLogDate);
    daysSinceBreak = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  const comebackPlan = await geminiService.generateRecoveryPlan(
    habit.name,
    habit.category,
    habit.longestStreak || 0,
    daysSinceBreak
  );

  return ApiResponse.success(res, comebackPlan, 'Streak recovery comeback plan generated');
});

/**
 * Ask the Habit Analysis Chat widget.
 */
const postChatAsk = asyncHandler(async (req, res) => {
  const { message, history } = req.body;
  const userId = req.user._id;

  if (!message) {
    throw new ApiError(400, 'Message is required');
  }

  // 1. Gather data summary (active habits + last 30 days completed logs count)
  const habits = await Habit.find({ user: userId, isArchived: false });
  const logs = await HabitLog.find({ user: userId, completed: true }).sort({ date: -1 }).limit(100);

  const dataSummary = {
    habits: habits.map((h) => ({
      name: h.name,
      category: h.category,
      currentStreak: h.currentStreak,
      longestStreak: h.longestStreak,
    })),
    completionsSummary: logs.map((l) => ({
      habitName: habits.find((h) => h._id.toString() === l.habit.toString())?.name || 'Unknown',
      date: l.date,
    })),
  };

  // 2. Generate answer
  const chatResponse = await geminiService.generateChatReply(message, dataSummary, history || []);

  return ApiResponse.success(res, chatResponse, 'Chat reply generated successfully');
});

/**
 * Get daily morning motivation. Caches response per user per day.
 */
const getDailyMotivation = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const timezone = req.user.timezone || 'UTC';

  const todayStr = getDateString(new Date(), timezone);

  // Check database cache first
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const existingMotivation = await AIInteraction.findOne({
    user: userId,
    type: 'morning_motivation',
    createdAt: { $gte: startOfToday },
  }).sort({ createdAt: -1 });

  if (existingMotivation) {
    return ApiResponse.success(
      res,
      existingMotivation.payload,
      'Retrieved cached morning motivation'
    );
  }

  // Generate new motivation
  // 1. Fetch yesterday's completion status
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getDateString(yesterday, timezone);

  const habits = await Habit.find({ user: userId, isArchived: false });
  const completedYesterday = await HabitLog.find({
    user: userId,
    date: yesterdayStr,
    completed: true,
  });

  const yesterdayStatus = habits.map((h) => {
    const wasCompleted = completedYesterday.some((l) => l.habit.toString() === h._id.toString());
    return {
      habitName: h.name,
      completed: wasCompleted,
    };
  });

  const activeStreaks = habits.map((h) => ({
    habitName: h.name,
    streak: h.currentStreak,
  }));

  const dueTodayHabit = habits[Math.floor(Math.random() * habits.length)]?.name || '';

  const motivation = await geminiService.generateMorningMotivation(
    yesterdayStatus,
    activeStreaks,
    dueTodayHabit
  );

  // Cache it
  await AIInteraction.create({
    user: userId,
    type: 'morning_motivation',
    payload: motivation,
  });

  return ApiResponse.success(res, motivation, 'Morning motivation generated');
});

module.exports = {
  getWeeklyCoachingReport,
  getSuggestedHabits,
  getComebackPlan,
  postChatAsk,
  getDailyMotivation,
};
