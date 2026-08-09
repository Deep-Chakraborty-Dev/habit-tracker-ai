import { motion } from 'framer-motion';

/**
 * GlassPanel — the primary card surface for Momentum.
 * Glass-morphism with backdrop-blur, theme-aware backgrounds via CSS vars.
 *
 * @param {boolean} hoverable - Whether the panel lifts on hover (default true)
 * @param {boolean} glow - Whether to add an amber glow shadow
 * @param {string}  className - Additional classes
 * @param {object}  style - Additional inline styles
 */
const GlassPanel = ({
  children,
  hoverable = true,
  glow = false,
  className = '',
  style = {},
  animate = true,
  ...props
}) => {
  const Wrapper = animate ? motion.div : 'div';
  const animateProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: 'easeOut' },
      }
    : {};

  return (
    <Wrapper
      className={`${hoverable ? 'glass-panel' : 'glass-panel-static'} ${
        glow ? 'glow-card' : ''
      } ${className}`}
      style={style}
      {...animateProps}
      {...props}
    >
      {children}
    </Wrapper>
  );
};

export default GlassPanel;
