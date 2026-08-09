import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  TrendingUp,
  Settings,
} from 'lucide-react';

/**
 * BottomTabBar — mobile-only fixed bottom navigation.
 * Shown below `md` breakpoint; replaces the desktop Navbar.
 */
const tabs = [
  { to: '/', icon: LayoutDashboard, label: 'Home' },
  { to: '/weekly', icon: CalendarDays, label: 'Weekly' },
  { to: '/insights', icon: TrendingUp, label: 'Insights' },
  { to: '/stats', icon: BarChart3, label: 'Stats' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

const BottomTabBar = () => {
  return (
    <motion.nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
      style={{
        background: 'var(--glass-bg)',
        borderTop: '1px solid var(--glass-border)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {tabs.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-xs font-medium transition-all duration-200 no-underline"
          style={({ isActive }) => ({
            color: isActive ? 'var(--color-amber-glow)' : 'var(--text-tertiary)',
          })}
        >
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </NavLink>
      ))}
    </motion.nav>
  );
};

export default BottomTabBar;
