import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, Mail, Lock, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlassPanel from '../components/ui/GlassPanel';
import Button from '../components/ui/Button';
import toast from '../components/ui/Toast';

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
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10 overflow-hidden">
      {/* Dynamic Ambient Backlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-amber-600/20 via-orange-500/10 to-rose-600/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative"
      >
        {/* Animated Border Glow Overlay */}
        <div className="absolute -inset-0.5 rounded-[2.5rem] bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 opacity-30 blur-lg group-hover:opacity-60 transition duration-1000 animate-pulse" />

        <GlassPanel
          className="relative !rounded-[2.25rem] !bg-[#0a0a0f]/95 !border-white/10 p-8 sm:p-10 flex flex-col gap-6 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
          hoverable={false}
        >
          {/* Header Icon Core */}
          <div className="text-center">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="relative w-20 h-20 mx-auto mb-5 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-orange-500/10 to-transparent border border-amber-500/40 flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.3)] cursor-pointer"
            >
              <Flame className="w-10 h-10 text-amber-400 fill-amber-400/20 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
              <Sparkles className="w-4 h-4 text-orange-300 absolute top-2 right-2 animate-bounce" />
            </motion.div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                Auth Protocol
              </span>
            </div>

            <h2 className="text-3xl font-black uppercase font-mono tracking-tight text-white">
              Welcome Back
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm font-medium text-zinc-400">
              Access your telemetry matrix & habit routines.
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <motion.div
              className="flex items-center gap-3 p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs font-mono shadow-[0_0_20px_rgba(244,63,94,0.15)]"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
            >
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Email input */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-[10px] font-mono font-bold uppercase tracking-widest block text-zinc-400"
              >
                Access Identifier / Email
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-amber-400 transition-colors">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3.5 rounded-2xl border border-zinc-800 bg-zinc-950/80 text-white placeholder-zinc-600 text-sm font-medium outline-none transition-all duration-300 focus:border-amber-500/50 focus:bg-zinc-900 focus:shadow-[0_0_25px_rgba(245,158,11,0.15)]"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password input */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-[10px] font-mono font-bold uppercase tracking-widest block text-zinc-400"
              >
                Access Cipher / Password
              </label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-amber-400 transition-colors">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3.5 rounded-2xl border border-zinc-800 bg-zinc-950/80 text-white placeholder-zinc-600 text-sm font-medium outline-none transition-all duration-300 focus:border-amber-500/50 focus:bg-zinc-900 focus:shadow-[0_0_25px_rgba(245,158,11,0.15)]"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                variant="primary"
                className="w-full py-4 mt-3 font-mono font-bold uppercase tracking-wider text-xs rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-black shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:shadow-[0_0_40px_rgba(245,158,11,0.55)] border-0 flex items-center justify-center gap-2"
                loading={loading}
              >
                <span>Authorize &amp; Launch</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </form>

          {/* Footer */}
          <div className="text-center pt-2 border-t border-zinc-800/80">
            <p className="text-xs font-medium text-zinc-400">
              No account registered?{' '}
              <Link
                to="/signup"
                className="font-mono font-bold uppercase text-amber-400 hover:text-amber-300 hover:underline tracking-wider transition-colors ml-1"
              >
                Create Account &rarr;
              </Link>
            </p>
          </div>
        </GlassPanel>
      </motion.div>
    </div>
  );
};

export default LoginPage;