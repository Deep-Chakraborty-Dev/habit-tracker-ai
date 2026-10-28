import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Button — styled button with variants, loading state, and glossy emerald/mint aesthetic.
 *
 * Variants: 'primary' (light glossy emerald), 'secondary' (frosted cyber glass), 'ghost', 'danger'
 */
const variants = {
  primary: {
    background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.95), rgba(16, 185, 129, 0.85), rgba(5, 150, 105, 0.9))',
    color: '#062016',
    border: '1px solid rgba(167, 243, 208, 0.6)',
    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(10px)',
    fontWeight: 700,
  },
  secondary: {
    background: 'rgba(6, 30, 22, 0.65)',
    color: 'var(--text-primary, #ffffff)',
    border: '1px solid rgba(52, 211, 153, 0.3)',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(52, 211, 153, 0.15)',
    backdropFilter: 'blur(12px)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-secondary, #a7f3d0)',
    border: '1px solid transparent',
  },
  danger: {
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(220, 38, 38, 0.85))',
    color: '#ffffff',
    border: '1px solid rgba(254, 202, 202, 0.4)',
    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
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
          ? '0 6px 25px rgba(52, 211, 153, 0.55), inset 0 1px 2px rgba(255, 255, 255, 0.8)' 
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