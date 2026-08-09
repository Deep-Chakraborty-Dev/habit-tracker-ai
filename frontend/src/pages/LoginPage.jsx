import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dumbbell, Briefcase, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlassPanel from '../components/ui/GlassPanel';
import Button from '../components/ui/Button';
import toast from '../components/ui/Toast';

/**
 * LoginPage — user login screen with premium glass-card aesthetic.
 */
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(email, password);

    if (result.success) {
      toast.success('Welcome back to AI-Tracker!');
      navigate('/');
    } else {
      setError(result.error || 'Invalid credentials');
      toast.error(result.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
      <GlassPanel
        className="max-w-md w-full p-8 flex flex-col gap-6"
        hoverable={false}
        glow
      >
        {/* Header */}
        <div className="text-center">
          <div className="relative w-14 h-14 mx-auto mb-4 shrink-0">
            <Briefcase className="w-9 h-9 text-purple-400 absolute top-0 left-0 opacity-80" />
            <Dumbbell className="w-9.5 h-9.5 text-amber-500 absolute bottom-0 right-0 rotate-45" style={{ filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.45))' }} />
          </div>
          <h2
            className="text-3xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Welcome Back
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Log in to continue building your habits.
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <motion.div
            className="flex items-center gap-2 p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email input */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-semibold tracking-wide uppercase block"
              style={{ color: 'var(--text-secondary)' }}
            >
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 rounded-xl border transition-all text-sm outline-none bg-black/10 focus:bg-black/20"
                style={{
                  borderColor: 'var(--glass-border)',
                  color: 'var(--text-primary)',
                }}
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs font-semibold tracking-wide uppercase block"
              style={{ color: 'var(--text-secondary)' }}
            >
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 rounded-xl border transition-all text-sm outline-none bg-black/10 focus:bg-black/20"
                style={{
                  borderColor: 'var(--glass-border)',
                  color: 'var(--text-primary)',
                }}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            variant="primary"
            className="w-full py-3.5 mt-2 font-bold tracking-wide"
            loading={loading}
          >
            Log In
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold transition-colors hover:underline"
            style={{ color: 'var(--color-amber-glow)' }}
          >
            Create an account
          </Link>
        </p>
      </GlassPanel>
    </div>
  );
};

export default LoginPage;
