import { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Flame, Archive, Trash2, Edit2 } from 'lucide-react';
import GlassPanel from '../ui/GlassPanel';
import Button from '../ui/Button';

// Dynamic icon resolver using Lucide-react export maps
const HabitIcon = ({ name, className, style }) => {
  const IconComponent = Icons[name] || Icons.Check;
  return <IconComponent className={className} style={style} />;
};

const HabitCard = ({ habit, onEdit, onArchive, onDelete, onToggleLog, isCompletedToday = false }) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const {
    _id,
    name,
    category,
    icon,
    color,
    frequency,
    currentStreak = 0,
    longestStreak = 0,
    targetDaysPerWeek,
    customDays = [],
  } = habit;

  const frequencyLabel = () => {
    if (frequency === 'daily') return 'Daily';
    if (frequency === 'weekly') return `${targetDaysPerWeek}x per week`;
    if (frequency === 'custom') {
      const days = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
      return customDays.map((d) => days[d]).join(', ');
    }
    return '';
  };

  return (
    <GlassPanel className="p-5 flex flex-col gap-4 relative overflow-hidden" hoverable>
      {/* Background radial highlight matching habit color */}
      <div
        className="absolute -top-10 -right-10 w-24 h-24 rounded-full filter blur-[40px] opacity-10 pointer-events-none"
        style={{ backgroundColor: color }}
      />

      {/* Top section: Icon & Details */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${color}20` }}
          >
            <HabitIcon name={icon} className="w-5.5 h-5.5" style={{ color }} />
          </div>
          <div>
            <h3
              className="font-semibold text-base line-clamp-1"
              style={{ color: 'var(--text-primary)' }}
            >
              {name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-400">
              <span className="font-medium px-2 py-0.5 rounded-md bg-neutral-900 border" style={{ borderColor: 'var(--glass-border)' }}>
                {category}
              </span>
              <span>&bull;</span>
              <span>{frequencyLabel()}</span>
            </div>
          </div>
        </div>

        {/* Edit/Archive/Delete buttons */}
        <div className="flex items-center gap-0.5 shrink-0 opacity-40 hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(habit)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-neutral-400 hover:text-white"
            title="Edit habit"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onArchive(_id)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-neutral-400 hover:text-amber-500"
            title="Archive habit"
          >
            <Archive className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors cursor-pointer text-neutral-400 hover:text-red-500"
            title="Delete habit"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mid section: Streaks stats */}
      <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-black/10 border text-center" style={{ borderColor: 'var(--glass-border)' }}>
        <div>
          <div className="flex items-center justify-center gap-1.5">
            <Flame className="w-4 h-4" style={{ color: currentStreak > 0 ? '#f59e0b' : 'var(--text-tertiary)' }} />
            <span className="text-sm font-bold text-primary">{currentStreak}</span>
          </div>
          <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Current Streak</span>
        </div>
        <div className="border-l" style={{ borderColor: 'var(--glass-border)' }}>
          <div className="flex items-center justify-center gap-1.5">
            <Icons.Trophy className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-sm font-bold text-primary">{longestStreak}</span>
          </div>
          <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">Longest Run</span>
        </div>
      </div>

      {/* Bottom section: Check-off button (Triggered in Phase 4) */}
      <div className="flex items-center justify-between gap-3 mt-1">
        <span className="text-xs text-neutral-400 font-medium">
          Check-in tracker:
        </span>
        <button
          onClick={() => onToggleLog && onToggleLog(_id)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 border cursor-pointer ${
            isCompletedToday
              ? 'text-white border-transparent'
              : 'text-neutral-400 border-neutral-700 hover:bg-neutral-800'
          }`}
          style={{
            background: isCompletedToday
              ? `linear-gradient(135deg, ${color}, #171717)`
              : 'transparent',
            borderColor: isCompletedToday ? 'transparent' : 'var(--glass-border)',
            boxShadow: isCompletedToday ? `0 0 12px ${color}30` : 'none',
          }}
        >
          {isCompletedToday ? (
            <>
              <Icons.CheckCircle2 className="w-4 h-4 text-white" />
              <span>Done Today</span>
            </>
          ) : (
            <>
              <Icons.Circle className="w-4 h-4 text-neutral-400" />
              <span>Complete</span>
            </>
          )}
        </button>
      </div>

      {/* Delete confirmation overlay */}
      {showConfirmDelete && (
        <div className="absolute inset-0 bg-neutral-950/90 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-20">
          <Trash2 className="w-8 h-8 text-red-500 mb-2 animate-bounce" />
          <h4 className="font-bold text-sm text-primary">Delete Habit?</h4>
          <p className="text-xs text-neutral-400 mt-1 max-w-[200px]">
            This deletes all 90-day progress history logs. This cannot be undone.
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConfirmDelete(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                onDelete(_id);
                setShowConfirmDelete(false);
              }}
            >
              Confirm
            </Button>
          </div>
        </div>
      )}
    </GlassPanel>
  );
};

export default HabitCard;
