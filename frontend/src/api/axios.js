import axios from 'axios';

/**
 * Axios instance configured for the Momentum API.
 * In development, Vite's proxy handles /api → localhost:5000.
 * In production, set VITE_API_URL to the deployed server.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// ─── Request interceptor: attach JWT ─────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('momentum-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response interceptor: handle 401 / token refresh ────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and we haven't retried yet, try refreshing the token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('momentum-refresh-token');
        if (!refreshToken) throw new Error('No refresh token');

        const { data } = await axios.post('/api/auth/refresh', {
          refreshToken,
        });

        if (data.success) {
          localStorage.setItem('momentum-token', data.data.token);
          originalRequest.headers.Authorization = `Bearer ${data.data.token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed — clear tokens and redirect to login
        localStorage.removeItem('momentum-token');
        localStorage.removeItem('momentum-refresh-token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
