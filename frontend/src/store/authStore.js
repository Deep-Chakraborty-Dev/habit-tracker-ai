import { create } from 'zustand';

/**
 * Auth store — tracks authentication state client-side.
 * The actual auth logic (login, signup, token management) lives in the AuthProvider context.
 */
const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, token) =>
    set({ user, token, isAuthenticated: !!user, isLoading: false }),

  clearAuth: () =>
    set({ user: null, token: null, isAuthenticated: false, isLoading: false }),

  setLoading: (isLoading) => set({ isLoading }),
}));

export default useAuthStore;
