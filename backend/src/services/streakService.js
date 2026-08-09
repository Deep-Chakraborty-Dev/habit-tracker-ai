const HabitLog = require('../models/HabitLog');

/**
 * Helper to get YYYY-MM-DD date string for a Date object in a specific timezone.
 */
const getDateString = (date, timezone) => {
  return date.toLocaleDateString('en-CA', { timeZone: timezone });
};

/**
 * Parse YYYY-MM-DD in user's timezone to a local Date object.
 */
const parseDateString = (dateStr) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Checks if a specific date was due for a habit.
 */
const isHabitDueOnDate = (habit, date) => {
  if (habit.frequency === 'daily') return true;

  if (habit.frequency === 'custom') {
    const dayOfWeek = date.getDay(); // 0 (Sun) - 6 (Sat)
    return habit.customDays.includes(dayOfWeek);
  }

  // For weekly, we handle target completions per week in the main calculation.
  return true;
};

/**
 * Recalculate current and longest streaks for a single habit.
 * Returns { currentStreak, longestStreak }
 */
const calculateStreaks = async (habit, timezone = 'UTC') => {
  const todayStr = getDateString(new Date(), timezone);
  const today = parseDateString(todayStr);

  // Fetch all completed logs for this habit, sorted by date in descending order
  const logs = await HabitLog.find({
    habit: habit._id,
    completed: true,
  }).sort({ date: -1 });

  if (logs.length === 0) {
    return { currentStreak: 0, longestStreak: habit.longestStreak || 0 };
  }

  const completedDates = new Set(logs.map((l) => l.date));

  // ─── Case 1: Daily or Custom Frequencies ──────────────────
  if (habit.frequency === 'daily' || habit.frequency === 'custom') {
    let currentStreak = 0;
    let isStreakActive = true;
    let checkDate = new Date(today);

    // 1. Determine starting date
    // If today is completed, start from today.
    // If today is NOT completed, check if yesterday was due and completed.
    // If yesterday was NOT due, we backtrack to find the last due day and check it.
    let lastDueCompleted = false;
    let stepsBack = 0;

    // Look back to see if streak is active (up to 7 days to cover custom frequencies)
    while (stepsBack < 7) {
      const dateStr = getDateString(checkDate, timezone);
      const isDue = isHabitDueOnDate(habit, checkDate);

      if (isDue) {
        if (completedDates.has(dateStr)) {
          lastDueCompleted = true;
          break;
        } else {
          // If the last due date was today, they still have time to complete it, so check yesterday
          if (dateStr === todayStr) {
            // Check yesterday
          } else {
            // It was due in the past and they missed it -> streak is broken
            break;
          }
        }
      }

      checkDate.setDate(checkDate.getDate() - 1);
      stepsBack++;
    }

    if (lastDueCompleted) {
      // Re-init checkDate to today to compute current streak
      checkDate = new Date(today);
      let missedDue = false;

      while (true) {
        const dateStr = getDateString(checkDate, timezone);
        const isDue = isHabitDueOnDate(habit, checkDate);

        if (isDue) {
          if (completedDates.has(dateStr)) {
            currentStreak++;
          } else {
            // Today is allowed to be uncompleted if they still have time to complete it
            if (dateStr === todayStr) {
              // Ignore today, streak is still active from yesterday
            } else {
              missedDue = true;
              break;
            }
          }
        }

        checkDate.setDate(checkDate.getDate() - 1);
        // Safety exit: if we go back further than the habit's creation date, stop
        if (checkDate < habit.createdAt) {
          break;
        }
      }
    }

    // 2. Calculate longest streak historically
    let longestStreak = habit.longestStreak || 0;
    let tempStreak = 0;
    let historyDate = new Date(today);
    // Find the oldest log to know how far back to check
    const oldestLog = logs[logs.length - 1];
    const oldestDate = oldestLog ? parseDateString(oldestLog.date) : new Date(habit.createdAt);

    // Set check date to today and traverse backwards
    historyDate = new Date(today);
    while (historyDate >= oldestDate) {
      const dateStr = getDateString(historyDate, timezone);
      const isDue = isHabitDueOnDate(habit, historyDate);

      if (isDue) {
        if (completedDates.has(dateStr)) {
          tempStreak++;
          if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
          }
        } else {
          if (dateStr !== todayStr) {
            tempStreak = 0; // Streak broken in history
          }
        }
      }
      historyDate.setDate(historyDate.getDate() - 1);
    }

    return {
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
    };
  }

  // ─── Case 2: Weekly Frequency ──────────────────────────────
  // completions are aggregated weekly (Mon-Sun).
  // Calculate streaks in chunks of calendar weeks.
  if (habit.frequency === 'weekly') {
    const target = habit.targetDaysPerWeek || 5;

    // Group completions by ISO week (YYYY-Www)
    const getISOWeekString = (date) => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() + 4 - (d.getDay() || 7));
      const yearStart = new Date(d.getFullYear(), 0, 1);
      const weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
      return `${d.getFullYear()}-W${String(weekNo).padStart(2, '0')}`;
    };

    const completionsPerWeek = {};
    logs.forEach((log) => {
      const logDate = parseDateString(log.date);
      const weekStr = getISOWeekString(logDate);
      completionsPerWeek[weekStr] = (completionsPerWeek[weekStr] || 0) + 1;
    });

    const currentWeekStr = getISOWeekString(today);

    // Backtrack through weeks
    let currentStreak = 0;
    let weekCheck = new Date(today);
    let streakBroken = false;

    // Safety check limit to prevent infinite loops (e.g. 52 weeks max history)
    for (let w = 0; w < 52; w++) {
      const weekStr = getISOWeekString(weekCheck);
      const completions = completionsPerWeek[weekStr] || 0;

      if (weekStr === currentWeekStr) {
        // If current week: met target?
        if (completions >= target) {
          currentStreak++;
        } else {
          // If we haven't met target yet but week is still in progress,
          // the streak is still alive (don't increment, but don't break yet).
        }
      } else {
        if (completions >= target) {
          currentStreak++;
        } else {
          streakBroken = true;
          break;
        }
      }

      // Move back one week
      weekCheck.setDate(weekCheck.getDate() - 7);
      if (weekCheck < habit.createdAt) {
        break;
      }
    }

    // Longest weekly streak calculation
    let longestStreak = habit.longestStreak || 0;
    let tempStreak = 0;
    let weekIterator = new Date(today);
    // Determine oldest log week
    const oldestLog = logs[logs.length - 1];
    const oldestDate = oldestLog ? parseDateString(oldestLog.date) : new Date(habit.createdAt);

    while (weekIterator >= oldestDate) {
      const weekStr = getISOWeekString(weekIterator);
      const completions = completionsPerWeek[weekStr] || 0;

      if (completions >= target) {
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
        }
      } else {
        if (weekStr !== currentWeekStr) {
          tempStreak = 0;
        }
      }

      weekIterator.setDate(weekIterator.getDate() - 7);
    }

    return {
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
    };
  }

  return { currentStreak: 0, longestStreak: habit.longestStreak || 0 };
};

/**
 * Utility to identify habits that have a streak break of at least thresholdDays.
 */
const getBrokenStreaks = async (userId, thresholdDays = 7) => {
  const Habit = require('../models/Habit');
  
  // Find all active habits for the user
  const habits = await Habit.find({ user: userId, isArchived: false });
  const brokenHabits = [];
  const todayStr = getDateString(new Date(), 'UTC');
  const today = parseDateString(todayStr);

  for (const habit of habits) {
    // Only look at habits that had a positive streak previously
    if (habit.longestStreak > 0) {
      const lastLog = await HabitLog.findOne({
        habit: habit._id,
        completed: true,
      }).sort({ date: -1 });

      if (lastLog) {
        const lastLogDate = parseDateString(lastLog.date);
        const diffTime = Math.abs(today - lastLogDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays >= thresholdDays) {
          brokenHabits.push({
            habit,
            daysSinceLastCompletion: diffDays,
          });
        }
      }
    }
  }

  return brokenHabits;
};

module.exports = {
  calculateStreaks,
  getBrokenStreaks,
};
