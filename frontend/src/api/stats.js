import api from './axios';

/**
 * Fetch overview metrics.
 */
export const getOverview = async () => {
  const { data } = await api.get('/stats/overview');
  return data;
};

/**
 * Fetch monthly completion count data.
 */
export const getMonthly = async () => {
  const { data } = await api.get('/stats/monthly');
  return data;
};

/**
 * Fetch category breakdown data.
 */
export const getCategoryBreakdown = async () => {
  const { data } = await api.get('/stats/category-breakdown');
  return data;
};

/**
 * Fetch list of habits sorted by completion rates.
 */
export const getPerHabitPerformance = async () => {
  const { data } = await api.get('/stats/per-habit-performance');
  return data;
};
