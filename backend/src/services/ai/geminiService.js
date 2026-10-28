const { getGenAI } = require('../../config/gemini');

const getModel = () => {
  const genAI = getGenAI();
  return genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });
};

/**
 * Generate a weekly performance report using Gemini.
 */
const generateWeeklyReport = async (habitsData, logsData) => {
  try {
    const model = getModel();

    const prompt = `
      You are an elite productivity and performance coach. Analyze the user's weekly habit tracking data and generate a structured JSON report.
      
      User's Habit Data:f
      ${JSON.stringify(habitsData, null, 2)}
      
      Completion Logs (Last 7 Days):
      ${JSON.stringify(logsData, null, 2)}

      Generate a JSON response that matches this structure exactly:
      {
        "headline": "A short, engaging headline summarizing their week",
        "summary": "1-2 sentences summarizing their overall consistency and performance",
        "wins": ["bullet point win 1", "bullet point win 2"],
        "struggles": ["bullet point struggle 1", "bullet point struggle 2"],
        "suggestion": "One highly actionable, specific advice/tip grounded in their actual data to improve next week"
      }
      
      Rule: Do not give generic advice. Mention actual habits by name. Be direct, positive, and constructive.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('Error generating Weekly Report from Gemini:', error.message);
    // Graceful fallback
    return {
      headline: "Keep building momentum!",
      summary: "You are active and tracking your habits. Keep logging daily details to unlock advanced AI coaching insights.",
      wins: ["Logged habit activities this week", "Persisted in tracking consistency"],
      struggles: ["Maintaining streaks over weekends can be tough"],
      suggestion: "Try setting a fixed time in the morning to complete your most critical habit first."
    };
  }
};

/**
 * Generate suggested habits based on goals and preferences.
 */
const generateSuggestions = async (goals, productiveTime, pastStruggles) => {
  try {
    const model = getModel();

    const prompt = `
      You are a habit creation expert. Recommend 3 to 5 new habits for the user based on their goals and preferences.
      
      User's Personal Goals: "${goals}"
      User's Productive Time Preference: "${productiveTime}"
      User's Past Struggles (Failed/Archived habits context): "${pastStruggles}"

      Recommend exactly 3 to 5 habits. Generate a JSON response that matches this structure:
      {
        "suggestions": [
          {
            "name": "Habit name (short, actionable, e.g., '10 Min Morning Stretch')",
            "category": "One of: Fitness, Health, Learning, Mindfulness, Productivity, Social, Finance",
            "icon": "One matching Lucide icon key: Activity, Dumbbell, BookOpen, Heart, Brain, Coffee, Smile, DollarSign, Sparkles, Check",
            "reasoning": "1-2 sentences explaining why this fits their goals and time preferences",
            "suggestedFrequency": "One of: daily, weekly, custom",
            "targetDaysPerWeek": 5 (only if weekly, otherwise omit),
            "customDays": [1,3,5] (array of day numbers 0-6 if custom, otherwise omit)
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('Error generating suggestions from Gemini:', error.message);
    return {
      suggestions: [
        {
          name: "10-Minute Mindful Walk",
          category: "Mindfulness",
          icon: "Heart",
          reasoning: "A great way to clear your head and build positive mindfulness daily.",
          suggestedFrequency: "daily"
        },
        {
          name: "Read 10 Pages",
          category: "Learning",
          icon: "BookOpen",
          reasoning: "Perfect for constant learning and easily fits in your evening routine.",
          suggestedFrequency: "daily"
        }
      ]
    };
  }
};

/**
 * Generate a comeback comeback plan for a broken streak.
 */
const generateRecoveryPlan = async (habitName, category, longestStreak, daysSinceBreak) => {
  try {
    const model = getModel();

    const prompt = `
      You are a motivational coach. A user broke their streak on an important habit. Help them get back on track.
      
      Habit Name: "${habitName}"
      Category: "${category}"
      Previous Best Streak: ${longestStreak} days
      Days Since Last Completed: ${daysSinceBreak} days

      Provide an encouraging quote/advice and a simple, highly realistic 3-day recovery comeback plan.
      Each day must have a small, easily achievable action.
      
      Generate a JSON response that matches this structure exactly:
      {
        "encouragement": "A short, motivating message (1-2 sentences) acknowledging their past success",
        "day1": "Very easy action for Day 1 to frictionlessly start (e.g. 'Just open the book for 1 min')",
        "day2": "Slightly increased effort action for Day 2 (e.g. 'Read 5 pages')",
        "day3": "Standard routine action for Day 3 (e.g. 'Read 10 pages')"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('Error generating recovery plan from Gemini:', error.message);
    return {
      encouragement: "Streaks are meant to be broken, but comeback plans are meant to be built. Let's restart!",
      day1: "Spend just 2 minutes prepping for this habit today.",
      day2: "Complete a micro-version of the habit (e.g. 5 minutes or 1 check).",
      day3: "Return to your full normal routine today."
    };
  }
};

/**
 * Handle interactive habit assistant chat Q&A.
 */
const generateChatReply = async (userQuestion, dataSummary, chatHistory = []) => {
  try {
    const model = getModel();

    const prompt = `
      You are Momentum Assistant, a helpful AI habit tracking coach. Answer the user's question about their habits.
      Cite real numbers, names of habits, and dates from the data summary below to back up your answers.
      
      Data Summary of User's Habits and History (Last 30-90 days):
      ${JSON.stringify(dataSummary, null, 2)}
      
      Recent Chat History:
      ${JSON.stringify(chatHistory, null, 2)}
      
      User's Question: "${userQuestion}"

      Respond in strict JSON with a single key 'reply':
      {
        "reply": "Your natural language response. Keep it friendly, clear, analytical, and concise. Reference their actual streaks/numbers."
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('Error generating chat reply from Gemini:', error.message);
    return {
      reply: "I'm having trouble analyzing your logs right now. Rest assured, your habits look great! Try asking me again in a moment."
    };
  }
};

/**
 * Generate a short morning motivation notification/message.
 */
const generateMorningMotivation = async (yesterdayStatus, activeStreaks, dueTodayName) => {
  try {
    const model = getModel();

    const prompt = `
      Write a short, high-energy, personalized morning motivation message (1-2 sentences maximum).
      
      Yesterday's completions: ${JSON.stringify(yesterdayStatus)}
      User's current streaks: ${JSON.stringify(activeStreaks)}
      One key habit due today: "${dueTodayName || 'Stay consistent'}"

      Rule: Be punchy. Name actual habits from the list. Mention streaks if positive.
      
      Respond in strict JSON:
      {
        "message": "Your highly motivating morning message."
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error('Error generating morning motivation from Gemini:', error.message);
    return {
      message: "Rise and shine! Today is a perfect day to complete your habits and build your streaks."
    };
  }
};

module.exports = {
  generateWeeklyReport,
  generateSuggestions,
  generateRecoveryPlan,
  generateChatReply,
  generateMorningMotivation,
};
