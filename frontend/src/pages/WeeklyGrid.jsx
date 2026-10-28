import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Loader2, 
  Calendar, 
  Radio, 
  CheckCheck,
  Filter
} from 'lucide-react';
import useLogs from '../hooks/useLogs';
import GlassPanel from '../components/ui/GlassPanel';
import Button from '../components/ui/Button';

import * as Icons from 'lucide-react';
const HabitIcon = ({ name, className, style }) => {
  const IconComponent = Icons[name] || Icons.Check;
  return <IconComponent className={className} style={style} />;
};

const WeeklyGrid = () => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const { weekDates, grid, isLoading, toggleLog } = useLogs(weekOffset);

  const todayStr = new Date().toLocaleDateString('en-CA');

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

    return `${firstMonth} ${firstDate.getDate()} - ${lastDate.getDate()}, ${firstDate.getFullYear()}`;
  };

  const handleToggle = async (habitId, date) => {
    try {
      await toggleLog({ habitId, date });
    } catch (err) {
      console.error('Error toggling grid log:', err);
    }
  };

  // Batch toggle all habits for today
  const handleBatchCompleteToday = async () => {
    const uncheckedToday = grid.filter(({ completions }) => {
      const match = completions.find((c) => c.date === todayStr);
      return !match || !match.completed;
    });

    for (const item of uncheckedToday) {
      await handleToggle(item.habit._id, todayStr);
    }
  };

  // Distinct category list
  const categories = useMemo(() => {
    const set = new Set(grid.map((g) => g.habit.category?.toUpperCase() || 'GENERAL'));
    return ['ALL', ...Array.from(set)];
  }, [grid]);

  // Filtered rows
  const filteredGrid = useMemo(() => {
    if (selectedCategory === 'ALL') return grid;
    return grid.filter(
      (g) => (g.habit.category?.toUpperCase() || 'GENERAL') === selectedCategory
    );
  }, [grid, selectedCategory]);

  return (
    <div className="space-y-8 relative">
      {/* ═══════════════════════════════════════
          CYBER-GRID TELEMETRY HEADER
      ═══════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-[#121118] via-[#0d0d12] to-[#08080c] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-md mb-3">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                Temporal Matrix
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase font-mono tracking-tight text-white">
              Weekly Breakdown
            </h1>
            <p className="text-sm font-medium text-zinc-400 mt-1">
              Synchronize check-ins and log consistency points across the 7-day protocol.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {weekOffset === 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBatchCompleteToday}
                className="text-xs font-mono uppercase font-bold px-3.5 py-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 flex items-center gap-1.5 transition-all"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Check All Today</span>
              </Button>
            )}

            <div className="flex items-center gap-2 bg-black/40 p-1.5 rounded-2xl border border-zinc-800 backdrop-blur-md">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setWeekOffset((prev) => prev - 1)}
                className="w-9 h-9 p-0 rounded-xl bg-zinc-900 border border-zinc-700/60 text-zinc-300 hover:text-amber-400 flex items-center justify-center cursor-pointer"
                aria-label="Previous week"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/60 text-xs font-mono font-bold text-amber-400 whitespace-nowrap">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>{formatMonthRange()}</span>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setWeekOffset((prev) => prev + 1)}
                className="w-9 h-9 p-0 rounded-xl bg-zinc-900 border border-zinc-700/60 text-zinc-300 hover:text-amber-400 flex items-center justify-center cursor-pointer"
                aria-label="Next week"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>

              {weekOffset !== 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setWeekOffset(0)}
                  className="text-[10px] font-mono uppercase font-black px-2.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-300"
                >
                  Today
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          CATEGORY FILTER BAR
      ═══════════════════════════════════════ */}
      {categories.length > 2 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 uppercase mr-2 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'bg-zinc-900/80 text-zinc-400 border border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════
          GRID MATRIX CONTAINER
      ═══════════════════════════════════════ */}
      {isLoading ? (
        <GlassPanel
          className="p-16 flex flex-col items-center justify-center gap-4 !rounded-3xl !bg-[#0c0c14]/90 !border-zinc-800/80"
          hoverable={false}
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
          </div>
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
            Parsing Telemetry Logs...
          </p>
        </GlassPanel>
      ) : filteredGrid.length > 0 ? (
        <GlassPanel
          className="overflow-hidden !rounded-3xl !bg-[#0c0c14]/90 !border-zinc-800/80 p-0 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          hoverable={false}
        >
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-zinc-800/80 bg-zinc-950/60">
                  <th className="text-left py-4 px-6 text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400 min-w-[220px]">
                    <div className="flex items-center gap-2">
                      <Radio className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                      <span>Habit Protocol</span>
                    </div>
                  </th>
                  {weekDates.map((date) => {
                    const isToday = date === todayStr;
                    return (
                      <th
                        key={date}
                        className={`py-4 px-3 text-center min-w-[76px] border-l border-zinc-900/60 ${
                          isToday ? 'bg-amber-500/[0.04]' : ''
                        }`}
                      >
                        <p
                          className={`text-[10px] font-mono font-black uppercase tracking-wider ${
                            isToday ? 'text-amber-400' : 'text-zinc-500'
                          }`}
                        >
                          {formatDayName(date)}
                        </p>
                        <div
                          className={`text-xs font-mono font-black w-7 h-7 mx-auto mt-1 flex items-center justify-center rounded-xl transition-all ${
                            isToday
                              ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]'
                              : 'text-zinc-300 bg-zinc-900/60 border border-zinc-800/60'
                          }`}
                        >
                          {formatDateNumber(date)}
                        </div>
                      </th>
                    );
                  })}
                  <th className="text-center py-4 px-4 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 border-l border-zinc-900/60 w-24">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {filteredGrid.map(({ habit, completions }, idx) => {
                  const completedDays = completions.filter((c) => c.completed).length;
                  const weekScorePercent = Math.round((completedDays / 7) * 100);

                  return (
                    <motion.tr
                      key={habit._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="hover:bg-zinc-900/40 transition-colors group"
                    >
                      {/* Habit Info Cell */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <div
                            className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-105"
                            style={{
                              backgroundColor: `${habit.color}15`,
                              borderColor: `${habit.color}40`,
                              boxShadow: `0 0 15px ${habit.color}20`,
                            }}
                          >
                            <HabitIcon
                              name={habit.icon}
                              className="w-5 h-5"
                              style={{ color: habit.color }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-white font-mono tracking-tight truncate group-hover:text-amber-300 transition-colors">
                              {habit.name}
                            </p>
                            <span
                              className="text-[9px] font-mono font-extrabold uppercase tracking-widest px-2 py-0.5 rounded border inline-block mt-1"
                              style={{
                                color: habit.color,
                                borderColor: `${habit.color}30`,
                                backgroundColor: `${habit.color}10`,
                              }}
                            >
                              {habit.category}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Completion Indicators */}
                      {completions.map(({ date, completed }) => {
                        const isToday = date === todayStr;
                        return (
                          <td
                            key={date}
                            className={`py-4 px-3 text-center border-l border-zinc-900/60 ${
                              isToday ? 'bg-amber-500/[0.03]' : ''
                            }`}
                          >
                            <button
                              onClick={() => handleToggle(habit._id, date)}
                              className="inline-flex items-center justify-center p-1 rounded-2xl cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 group/btn focus:outline-none"
                            >
                              {completed ? (
                                <div
                                  className="w-8 h-8 rounded-xl flex items-center justify-center border transition-all"
                                  style={{
                                    backgroundColor: `${habit.color}20`,
                                    borderColor: `${habit.color}60`,
                                    boxShadow: `0 0 18px ${habit.color}40`,
                                  }}
                                >
                                  <CheckCircle2
                                    className="w-5 h-5"
                                    style={{ color: habit.color }}
                                  />
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center border border-zinc-800 bg-zinc-900/40 group-hover/btn:border-zinc-600 transition-all">
                                  <Circle className="w-4 h-4 text-zinc-700 group-hover/btn:text-zinc-500" />
                                </div>
                              )}
                            </button>
                          </td>
                        );
                      })}

                      {/* Weekly Score Gauge */}
                      <td className="py-4 px-4 text-center border-l border-zinc-900/60">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-xs font-mono font-bold text-zinc-300">
                            {completedDays}/7
                          </span>
                          <div className="w-12 h-1.5 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${weekScorePercent}%`,
                                backgroundColor: habit.color,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      ) : (
        <GlassPanel
          className="p-12 text-center py-20 !rounded-3xl !bg-[#0c0c14]/90 !border-zinc-800/80 shadow-[0_15px_40px_rgba(0,0,0,0.5)]"
          hoverable={false}
        >
          <div className="w-16 h-16 rounded-3xl mx-auto flex items-center justify-center mb-4 bg-gradient-to-tr from-amber-500/20 to-orange-500/10 border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            <Calendar className="w-8 h-8 text-amber-400" />
          </div>
          <h3 className="text-xl font-mono font-black uppercase text-white tracking-tight">
            No Habit Protocols Found
          </h3>
          <p className="text-sm font-medium text-zinc-400 mt-2 max-w-sm mx-auto">
            Initialize habit routines on the Dashboard to populate your weekly tracking grid.
          </p>
        </GlassPanel>
      )}
    </div>
  );
};

export default WeeklyGrid;