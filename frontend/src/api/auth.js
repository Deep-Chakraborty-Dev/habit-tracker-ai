import api from './axios';

/**
 * Register a new user.
 * Sends user credentials and client timezone.
 */
export const signup = async (name, email, password, timezone) => {
  const { data } = await api.post('/auth/signup', {
    name,
    email,
    password,
    timezone,
  });
  return data;
};

/**
 * Log in an existing user.
 */
export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', {
    email,
    password,
  });
  return data;
};

/**
 * Log out user (clears HTTP-only refresh cookie on server).
 */
export const logout = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

/**
 * Get current authenticated user details.
 */
export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};
