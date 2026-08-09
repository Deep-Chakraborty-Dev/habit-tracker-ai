import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';

// Layout
import AuroraBackground from './components/layout/AuroraBackground';
import Navbar from './components/layout/Navbar';
import BottomTabBar from './components/layout/BottomTabBar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import { ToastContainer } from './components/ui/Toast';
import AIChatWidget from './components/ai/AIChatWidget';

// Auth Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import WeeklyGrid from './pages/WeeklyGrid';
import Insights from './pages/Insights';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';

// Store
import useThemeStore from './store/themeStore';

// TanStack Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * AppContent — Sub-component to access AuthContext.
 * Conditionally renders Navbars if authenticated, handles routing protection.
 */
const AppContent = () => {
  const { theme } = useThemeStore();
  const { isAuthenticated } = useAuth();

  // Sync theme class on <html> element
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <>
      {/* Aurora background — always visible */}
      <AuroraBackground />

      {/* Toast notifications */}
      <ToastContainer />

      {/* Desktop navbar (only when logged in) */}
      {isAuthenticated && <Navbar />}

      {/* Main content area */}
      <main className={`relative z-10 min-h-screen px-4 md:px-8 max-w-7xl mx-auto ${
        isAuthenticated ? 'pt-8 md:pt-10 md:pl-72 pb-24 md:pb-8' : 'pt-4 pb-4 flex items-center justify-center'
      }`}>
        <Routes>
          {/* Public Auth Routes */}
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
          />
          <Route
            path="/signup"
            element={isAuthenticated ? <Navigate to="/" replace /> : <SignupPage />}
          />

          {/* Protected Main Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/weekly"
            element={
              <ProtectedRoute>
                <WeeklyGrid />
              </ProtectedRoute>
            }
          />
          <Route
            path="/insights"
            element={
              <ProtectedRoute>
                <Insights />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stats"
            element={
              <ProtectedRoute>
                <Statistics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Mobile bottom tab bar (only when logged in) */}
      {isAuthenticated && <BottomTabBar />}

      {/* Floating AI Chat Assistant (only when logged in) */}
      {isAuthenticated && <AIChatWidget />}
    </>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
