import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Button — styled button with variants, loading state, and micro-animation.
 *
 * Variants: 'primary' (electric purple gradient), 'secondary' (cyber glass), 'ghost', 'danger'
 */
const variants = {
  primary: {
    background: 'linear-gradient(135deg, #9333ea, #7c3aed, #6366f1)',
    color: '#ffffff',
    border: '1px solid rgba(192, 132, 252, 0.3)',
    boxShadow: '0 0 25px rgba(168, 85, 247, 0.4)',
    fontWeight: 700,
  },
  secondary: {
    background: 'rgba(12, 9, 21, 0.85)',
    color: 'var(--text-primary, #ffffff)',
    border: '1px solid rgba(168, 85, 247, 0.25)',
    backdropFilter: 'blur(12px)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary, #a1a1aa)',
    border: '1px solid transparent',
  },
  danger: {
    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
    color: '#ffffff',
    border: '1px solid rgba(244, 63, 94, 0.3)',
    boxShadow: '0 0 20px rgba(239, 68, 68, 0.35)',
    fontWeight: 700,
  },
};

const sizes = {
  sm: 'px-3.5 py-1.5 text-xs rounded-xl font-mono tracking-wider',
  md: 'px-5 py-2.5 text-sm rounded-2xl font-mono tracking-wide',
  lg: 'px-7 py-3.5 text-base rounded-2xl font-mono tracking-wide',
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
      className={`inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer select-none ${sizes[size]} ${className}`}
      style={{
        ...variants[variant],
        ...style,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
      }}
      disabled={disabled || loading}
      whileHover={{ 
        scale: disabled || loading ? 1 : 1.02,
        boxShadow: variant === 'primary' 
          ? '0 0 35px rgba(168, 85, 247, 0.65)' 
          : undefined
      }}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
      {children}
    </motion.button>
  );
};

export default Button;