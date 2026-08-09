import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  TrendingUp,
  Settings,
  Dumbbell,
  Briefcase,
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

/**
 * Navbar — vertical sidebar navigation for desktop.
 * Positioned on the left side of the screen; hidden on mobile.
 */
const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/weekly', icon: CalendarDays, label: 'Weekly Grid' },
  { to: '/insights', icon: TrendingUp, label: 'AI Coach' },
  { to: '/stats', icon: BarChart3, label: 'Statistics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const Navbar = () => {
  return (
    <motion.nav
      className="hidden md:flex fixed top-0 bottom-0 left-0 z-50 w-64 flex-col justify-between py-8 px-5 border-r"
      style={{
        background: 'var(--glass-bg)',
        borderColor: 'var(--glass-border)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      initial={{ x: -260, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="space-y-8 w-full">
        {/* Brand / Logo */}
        <NavLink to="/" className="flex items-center gap-3 no-underline px-1">
          <div className="relative w-10 h-10 shrink-0">
            <Briefcase className="w-6 h-6 text-purple-400 absolute top-0 left-0 opacity-80" />
            <Dumbbell className="w-6.5 h-6.5 text-amber-500 absolute bottom-0 right-0 rotate-45" style={{ filter: 'drop-shadow(0 0 10px rgba(245, 158, 11, 0.4))' }} />
          </div>
          <span
            className="text-xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            AI-Tracker
          </span>
        </NavLink>

        {/* Stacked Links */}
        <div className="flex flex-col gap-1.5 w-full">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 no-underline w-full hover:bg-white/3 ${
                  isActive ? '' : ''
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? 'var(--color-amber-glow)' : 'var(--text-secondary)',
                background: isActive ? 'rgba(245, 158, 11, 0.08)' : 'transparent',
                border: isActive ? '1px solid rgba(245, 158, 11, 0.15)' : '1px solid transparent',
              })}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Footer / Theme Toggle at bottom */}
      <div className="border-t pt-6 w-full flex items-center justify-between px-2" style={{ borderColor: 'var(--glass-border)' }}>
        <span className="text-xs font-semibold text-neutral-400">
          Appearance
        </span>
        <ThemeToggle />
      </div>
    </motion.nav>
  );
};

export default Navbar;
