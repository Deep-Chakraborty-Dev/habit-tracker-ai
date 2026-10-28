import { motion } from 'framer-motion';
import GlassPanel from '../components/ui/GlassPanel';
import ThemeToggle from '../components/layout/ThemeToggle';
import useThemeStore from '../store/themeStore';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import { User, Palette, Shield, LogOut, Cpu, Radio, Sparkles, AlertTriangle } from 'lucide-react';

const Settings = () => {
  const { theme } = useThemeStore();
  const { user, logout } = useAuth();

  return (
    <div className="space-y-8 relative">
      {/* ═══════════════════════════════════════
          SETTINGS HERO HEADER
      ═══════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#121118] via-[#0d0d12] to-[#08080c] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-md mb-3">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-purple-400 uppercase">
                System Configuration
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase font-mono tracking-tight text-white">
              App Preferences
            </h1>

            <p className="mt-2 text-sm sm:text-base font-medium text-zinc-400 max-w-xl">
              Manage user identity, theme matrix styles, and system telemetry settings.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appearance Control Card */}
        <GlassPanel
          className="!rounded-3xl !bg-[#0c0c14]/90 !border-zinc-800/80 p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex flex-col justify-between"
          hoverable={false}
        >
          <div>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                  <Palette className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-base font-mono font-bold uppercase tracking-tight text-white">
                    Interface Theme
                  </h2>
                  <p className="text-xs text-zinc-500 font-medium">Color gamut &amp; illumination</p>
                </div>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-purple-500/10 border border-purple-500/30 text-purple-400">
                {theme} MODE
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-medium mb-6">
              Toggle between high-contrast neon dark mode and radiant luminescent palettes. UI elements will dynamically adapt their specular glow.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
              <span className="text-xs font-mono font-bold text-zinc-300 uppercase">Active State: {theme}</span>
            </div>
            <ThemeToggle />
          </div>
        </GlassPanel>

        {/* Profile Details Card */}
        <GlassPanel
          className="!rounded-3xl !bg-[#0c0c14]/90 !border-zinc-800/80 p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex flex-col justify-between"
          hoverable={false}
        >
          <div>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-zinc-800/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <User className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-base font-mono font-bold uppercase tracking-tight text-white">
                    Identity Core
                  </h2>
                  <p className="text-xs text-zinc-500 font-medium">Authenticated credentials</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400">
                <Radio className="w-3 h-3 animate-pulse" />
                <span>ONLINE</span>
              </div>
            </div>

            {user ? (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 mb-6">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-black text-black uppercase text-lg shadow-[0_0_20px_rgba(245,158,11,0.3)] shrink-0"
                    style={{ backgroundColor: user.avatarColor || '#f59e0b' }}
                  >
                    {user.name?.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono font-bold text-sm text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs font-medium text-zinc-400 truncate mt-0.5">
                      {user.email}
                    </p>
                    <p className="text-[10px] font-mono text-zinc-500 mt-1">
                      Timezone: {user.timezone || 'UTC'}
                    </p>
                  </div>
                </div>

                <Button
                  variant="danger"
                  size="sm"
                  onClick={logout}
                  className="font-mono font-bold uppercase tracking-wider text-[11px] px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </Button>
              </div>
            ) : (
              <p className="text-xs text-zinc-500 font-mono py-4">No active user session detected.</p>
            )}
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
            <Cpu className="w-3.5 h-3.5 text-amber-500" />
            <span>Telemetry Session Encrypted (SHA-256)</span>
          </div>
        </GlassPanel>
      </div>

      {/* Danger Zone Panel */}
      <GlassPanel
        className="!rounded-3xl !bg-[#0c0c14]/90 !border-rose-500/30 p-6 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
        hoverable={false}
      >
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,0.2)]">
              <Shield className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h2 className="text-base font-mono font-bold uppercase tracking-tight text-rose-400">
                Danger Zone
              </h2>
              <p className="text-xs text-zinc-500 font-medium">Critical system operations</p>
            </div>
          </div>
          <AlertTriangle className="w-5 h-5 text-rose-500 animate-pulse" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-rose-500/[0.03] border border-rose-500/20">
          <div>
            <h3 className="text-xs font-mono font-bold uppercase text-zinc-300">
              Purge Telemetry &amp; Account Identity
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Permanently wipe all historic 90-day heatmap logs, streaks, and habits.
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            disabled
            className="font-mono font-bold uppercase tracking-wider text-[10px] px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-600 opacity-60 cursor-not-allowed shrink-0"
          >
            Purge Data (Phase 9)
          </Button>
        </div>
      </GlassPanel>
    </div>
  );
};

export default Settings;