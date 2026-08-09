import api from './axios';

/**
 * Request weekly AI report grounded in last 7 days check-in history.
 */
export const getWeeklyReport = async () => {
  const { data } = await api.post('/ai/weekly-report');
  return data;
};

/**
 * Run AI habit suggestion wizard.
 */
export const getSuggestions = async (goals, productiveTime, pastStruggles) => {
  const { data } = await api.post('/ai/suggestions', {
    goals,
    productiveTime,
    pastStruggles,
  });
  return data;
};

/**
 * Request recovery action plan for a broken streak.
 */
export const getRecoveryPlan = async (habitId) => {
  const { data } = await api.get(`/ai/recovery-plan/${habitId}`);
  return data;
};

/**
 * Ask natural language habit questions to the AI assistant.
 */
export const askChat = async (message, history = []) => {
  const { data } = await api.post('/ai/chat', {
    message,
    history,
  });
  return data;
};

/**
 * Get cached daily morning motivation quote.
 */
export const getMorningMotivation = async () => {
  const { data } = await api.get('/ai/morning-motivation');
  return data;
};
