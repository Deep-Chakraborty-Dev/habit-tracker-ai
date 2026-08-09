import { create } from 'zustand';

/**
 * Theme store — manages dark/light mode.
 * Persists preference to localStorage, respects system preference on first load.
 */
const getInitialTheme = () => {
  // Check localStorage first
  const stored = localStorage.getItem('momentum-theme');
  if (stored === 'light' || stored === 'dark') return stored;

  // Fall back to system preference
  if (window.matchMedia?.('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
};

const useThemeStore = create((set) => ({
  theme: getInitialTheme(),

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('momentum-theme', next);
      return { theme: next };
    }),

  setTheme: (theme) => {
    localStorage.setItem('momentum-theme', theme);
    set({ theme });
  },
}));

export default useThemeStore;
