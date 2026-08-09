import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Route guard component that protects access to private routes.
 * Redirects unauthorized users to /login.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center bg-[#0a0a0a]">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center animate-pulse"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #a855f7)',
            }}
          />
          <p className="text-sm font-medium text-neutral-400 animate-pulse">
            Loading session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
