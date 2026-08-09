import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, Circle, Loader2, Calendar } from 'lucide-react';
import useLogs from '../hooks/useLogs';
import GlassPanel from '../components/ui/GlassPanel';
import Button from '../components/ui/Button';

// Dynamic icon resolver using Lucide-react export maps
import * as Icons from 'lucide-react';
const HabitIcon = ({ name, className, style }) => {
  const IconComponent = Icons[name] || Icons.Check;
  return <IconComponent className={className} style={style} />;
};

const WeeklyGrid = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const { weekDates, grid, isLoading, toggleLog } = useLogs(weekOffset);

  const formatDayName = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatDateNumber = (dateStr) => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { day: 'numeric' });
  };

  const formatMonthRange = () => {
    if (weekDates.length === 0) return '';
    const firstDate = new Date(weekDates[0] + 'T00:00:00');
    const lastDate = new Date(weekDates[6] + 'T00:00:00');

    const firstMonth = firstDate.toLocaleDateString('en-US', { month: 'short' });
    const lastMonth = lastDate.toLocaleDateString('en-US', { month: 'short' });

    if (firstMonth === lastMonth) {
      return `${firstMonth} ${firstDate.getDate()} - ${lastDate.getDate()}, ${firstDate.getFullYear()}`;
    }
    return `${firstMonth} ${firstDate.getDate()} - ${lastMonth} ${lastDate.getDate()}, ${firstDate.getFullYear()}`;
  };

  const handleToggle = async (habitId, date) => {
    try {
      await toggleLog({ habitId, date });
    } catch (err) {
      console.error('Error toggling grid log:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
            Weekly Grid
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Track and toggle check-ins across the week.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="w-9 h-9 p-0 flex items-center justify-center cursor-pointer"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-black/10 text-sm font-semibold whitespace-nowrap" style={{ borderColor: 'var(--glass-border)' }}>
            <Calendar className="w-4 h-4 text-neutral-400" />
            <span>{formatMonthRange()}</span>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className="w-9 h-9 p-0 flex items-center justify-center cursor-pointer"
            aria-label="Next week"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {weekOffset !== 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setWeekOffset(0)}
              className="text-xs py-1 px-2.5 font-bold"
            >
              Today
            </Button>
          )}
        </div>
      </div>

      {/* Grid Container */}
      {isLoading ? (
        <GlassPanel className="p-12 flex flex-col items-center justify-center gap-3" hoverable={false}>
          <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
          <p className="text-sm text-neutral-400">Loading weekly check-ins...</p>
        </GlassPanel>
      ) : grid.length > 0 ? (
        <GlassPanel className="overflow-hidden border" style={{ borderColor: 'var(--glass-border)' }} hoverable={false}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--glass-border)', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                  <th className="text-left py-4 px-6 text-xs font-bold uppercase tracking-wider text-neutral-400 min-w-[200px]">
                    Habit Details
                  </th>
                  {weekDates.map((date) => {
                    const isToday = date === new Date().toLocaleDateString('en-CA');
                    return (
                      <th
                        key={date}
                        className="py-3 px-4 text-center text-xs min-w-[70px]"
                        style={{
                          color: isToday ? 'var(--color-amber-glow)' : 'var(--text-secondary)',
                          backgroundColor: isToday ? 'rgba(245,158,11,0.03)' : 'transparent',
                        }}
                      >
                        <p className="font-bold">{formatDayName(date)}</p>
                        <p className={`text-sm mt-0.5 font-extrabold w-6 h-6 mx-auto flex items-center justify-center rounded-full ${isToday ? 'bg-amber-500/10 text-amber-500' : ''}`}>
                          {formatDateNumber(date)}
                        </p>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800" style={{ divideColor: 'var(--glass-border)' }}>
                {grid.map(({ habit, completions }, idx) => (
                  <motion.tr
                    key={habit._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-white/2"
                  >
                    {/* Habit info */}
                    <td className="py-4 px-6 flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${habit.color}15` }}
                      >
                        <HabitIcon name={habit.icon} className="w-4.5 h-4.5" style={{ color: habit.color }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm leading-none" style={{ color: 'var(--text-primary)' }}>
                          {habit.name}
                        </p>
                        <span className="text-[10px] text-neutral-400 font-medium capitalize mt-1 inline-block">
                          {habit.category}
                        </span>
                      </div>
                    </td>

                    {/* Completion indicators */}
                    {completions.map(({ date, completed }) => {
                      const isToday = date === new Date().toLocaleDateString('en-CA');
                      return (
                        <td
                          key={date}
                          className="py-4 px-4 text-center"
                          style={{
                            backgroundColor: isToday ? 'rgba(245,158,11,0.03)' : 'transparent',
                          }}
                        >
                          <button
                            onClick={() => handleToggle(habit._id, date)}
                            className="inline-flex items-center justify-center rounded-full cursor-pointer hover:scale-110 transition-transform"
                          >
                            {completed ? (
                              <CheckCircle2
                                className="w-6 h-6"
                                style={{ color: habit.color }}
                              />
                            ) : (
                              <Circle
                                className="w-6 h-6 text-neutral-600 hover:text-neutral-500"
                              />
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      ) : (
        <GlassPanel className="p-12 text-center py-16" hoverable={false}>
          <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-3 bg-neutral-900 border" style={{ borderColor: 'var(--glass-border)' }}>
            <Calendar className="w-6 h-6 text-neutral-400" />
          </div>
          <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>No active habits found</h3>
          <p className="text-sm mt-1 max-w-sm mx-auto" style={{ color: 'var(--text-secondary)' }}>
            Create habits on the Dashboard first to populate your weekly grid tracking!
          </p>
        </GlassPanel>
      )}
    </div>
  );
};

export default WeeklyGrid;
