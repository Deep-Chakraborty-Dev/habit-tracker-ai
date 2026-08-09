import api from './axios';

/**
 * Fetch active or archived habits.
 */
export const getHabits = async (archived = false) => {
  const { data } = await api.get(`/habits?archived=${archived}`);
  return data;
};

/**
 * Create a new habit.
 */
export const createHabit = async (habitData) => {
  const { data } = await api.post('/habits', habitData);
  return data;
};

/**
 * Update a habit's core details.
 */
export const updateHabit = async (id, habitData) => {
  const { data } = await api.put(`/habits/${id}`, habitData);
  return data;
};

/**
 * Toggle archiving status of a habit.
 */
export const toggleArchiveHabit = async (id) => {
  const { data } = await api.patch(`/habits/${id}/archive`);
  return data;
};

/**
 * Delete a habit.
 */
export const deleteHabit = async (id) => {
  const { data } = await api.delete(`/habits/${id}`);
  return data;
};
