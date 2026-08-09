import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Button — styled button with variants, loading state, and micro-animation.
 *
 * Variants: 'primary' (amber gradient), 'secondary' (glass), 'ghost', 'danger'
 */
const variants = {
  primary: {
    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
    color: '#ffffff',
    border: 'none',
    fontWeight: 600,
  },
  secondary: {
    background: 'var(--glass-bg)',
    color: 'var(--text-primary)',
    border: '1px solid var(--glass-border)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid transparent',
  },
  danger: {
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: '#ffffff',
    border: 'none',
    fontWeight: 600,
  },
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-5 py-2.5 text-sm rounded-xl',
  lg: 'px-7 py-3 text-base rounded-xl',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  style = {},
  ...props
}) => {
  return (
    <motion.button
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 cursor-pointer ${sizes[size]} ${className}`}
      style={{ ...variants[variant], ...style, opacity: disabled ? 0.5 : 1 }}
      disabled={disabled || loading}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </motion.button>
  );
};

export default Button;
