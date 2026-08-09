import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Dumbbell, Briefcase } from 'lucide-react';
import useAuthStore from '../store/authStore';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { setAuth, clearAuth, setLoading } = useAuthStore();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const [init, setInit] = useState(false);

  // ─── Fetch Current User Context ─────────────────────────
  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem('aitracker-token');
    if (!token) {
      clearAuth();
      setInit(true);
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.getMe();
      if (res.success) {
        setAuth(res.data.user, token);
      } else {
        localStorage.removeItem('aitracker-token');
        clearAuth();
      }
    } catch (error) {
      console.error('Failed to restore auth session:', error.message);
      localStorage.removeItem('aitracker-token');
      clearAuth();
    } finally {
      setLoading(false);
      setInit(true);
    }
  }, [clearAuth, setAuth, setLoading]);

  // Restore session on mount
  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  // ─── Login Handler ──────────────────────────────────────
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      if (res.success && res.data) {
        const { token, user: userData } = res.data;
        localStorage.setItem('aitracker-token', token);
        setAuth(userData, token);
        return { success: true };
      }
      return { success: false, error: res.message || 'Login failed' };
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Login failed';
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // ─── Signup Handler ─────────────────────────────────────
  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      // Capture client timezone automatically
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

      const res = await authApi.signup(name, email, password, timezone);
      if (res.success && res.data) {
        const { token, user: userData } = res.data;
        localStorage.setItem('aitracker-token', token);
        setAuth(userData, token);
        return { success: true };
      }
      return { success: false, error: res.message || 'Registration failed' };
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message || 'Registration failed';
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  // ─── Logout Handler ─────────────────────────────────────
  const logout = async () => {
    setLoading(true);
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error on server:', error.message);
    } finally {
      localStorage.removeItem('aitracker-token');
      clearAuth();
      setLoading(false);
    }
  };

  // Prevent initial flash of login page by waiting for init
  const showContent = init && !isLoading;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading: !init || isLoading,
        login,
        signup,
        logout,
      }}
    >
      {init ? children : (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#0a0a0a]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16 animate-pulse shrink-0">
              <Briefcase className="w-10 h-10 text-purple-400 absolute top-0 left-0 opacity-80" />
              <Dumbbell className="w-11 h-11 text-amber-500 absolute bottom-0 right-0 rotate-45" style={{ filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.45))' }} />
            </div>
            <p className="text-sm font-medium text-neutral-400 animate-pulse">
              Syncing your AI-Tracker...
            </p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
