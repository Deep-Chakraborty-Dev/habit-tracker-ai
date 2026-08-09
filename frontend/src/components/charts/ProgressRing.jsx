import { motion } from 'framer-motion';

/**
 * ProgressRing — clean SVG progress circle with entrance and change animations.
 *
 * @param {number} size - diameter of the ring in px (default 80)
 * @param {number} strokeWidth - thickness of the ring line in px (default 8)
 * @param {number} progress - value between 0 and 1
 * @param {string} color - hex color string of progress track
 */
const ProgressRing = ({ size = 80, strokeWidth = 8, progress = 0, color = '#f59e0b' }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Ensure progress is bounded between 0 and 1
  const safeProgress = Math.max(0, Math.min(1, progress));
  const strokeDashoffset = circumference - safeProgress * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="var(--glass-border)"
          strokeWidth={strokeWidth}
        />
        {/* Active Progress Circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      {/* Percentage Center Text */}
      <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
        <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          {Math.round(safeProgress * 100)}%
        </span>
      </div>
    </div>
  );
};

export default ProgressRing;
