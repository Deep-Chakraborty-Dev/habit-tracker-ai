import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import useThemeStore from '../../store/themeStore';

/**
 * ThemeToggle — animated dark/light mode switch.
 * Rotates the icon on toggle for a satisfying micro-interaction.
 */
const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-colors cursor-pointer"
      style={{
        background: 'var(--glass-bg)',
        border: '1px solid var(--glass-border)',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {isDark ? (
          <Sun className="w-5 h-5" style={{ color: 'var(--color-amber-glow, #f59e0b)' }} />
        ) : (
          <Moon className="w-5 h-5" style={{ color: 'var(--color-purple-accent, #a855f7)' }} />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
