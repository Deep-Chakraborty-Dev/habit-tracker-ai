import api from './axios';

/**
 * Toggle check-in log status for a habit on a specific date YYYY-MM-DD.
 */
export const toggleLog = async (habitId, date) => {
  const { data } = await api.post('/logs/toggle', {
    habitId,
    date,
  });
  return data;
};

/**
 * Fetch 7-day grid logs for all habits given a weekOffset.
 */
export const getWeekGrid = async (weekOffset = 0) => {
  const { data } = await api.get(`/logs/week?weekOffset=${weekOffset}`);
  return data;
};

/**
 * Fetch last 90 days of logs for a user (aggregated or per habit).
 */
export const getHeatmapLogs = async (habitId = null) => {
  const url = habitId ? `/logs/heatmap/${habitId}` : '/logs/heatmap';
  const { data } = await api.get(url);
  return data;
};
