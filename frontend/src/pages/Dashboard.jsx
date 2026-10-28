import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, TrendingUp, Plus, Zap, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import useHabits from '../hooks/useHabits';
import useLogs from '../hooks/useLogs';
import GlassPanel from '../components/ui/GlassPanel';
import Button from '../components/ui/Button';
import HabitCard from '../components/habits/HabitCard';
import HabitForm from '../components/habits/HabitForm';
import ProgressRing from '../components/charts/ProgressRing';
import Heatmap90Day from '../components/heatmap/Heatmap90Day';
import MorningMotivation from '../components/ai/MorningMotivation';

const Dashboard = () => {
  const { user } = useAuth();

  const {
    habits,
    isLoading: habitsLoading,
    createHabit,
    updateHabit,
    archiveHabit,
    deleteHabit,
  } = useHabits(false);

  const {
    grid,
    isLoading: logsLoading,
    toggleLog,
  } = useLogs(0);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  const todayStr = new Date().toLocaleDateString('en-CA');

  const completedMap = {};

  grid.forEach((row) => {
    const matchingToday = row.completions.find(
      (c) => c.date === todayStr
    );

    completedMap[row.habit._id] =
      !!(matchingToday && matchingToday.completed);
  });

  const totalHabits = habits.length;

  const completedTodayCount = habits.filter(
    (h) => completedMap[h._id]
  ).length;

  const progressPercent =
    totalHabits > 0
      ? completedTodayCount / totalHabits
      : 0;

  const handleOpenCreate = () => {
    setEditingHabit(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (habit) => {
    setEditingHabit(habit);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingHabit) {
        await updateHabit({
          id: editingHabit._id,
          habitData: formData,
        });
      } else {
        await createHabit(formData);
      }

      setIsFormOpen(false);
      setEditingHabit(null);
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  const handleToggleCheck = async (habitId) => {
    try {
      await toggleLog({
        habitId,
        date: todayStr,
      });
    } catch (err) {
      console.error('Error toggling check-in:', err);
    }
  };

  const stats = [
    {
      icon: Flame,
      label: 'Active Streaks',
      value:
        habits.reduce(
          (acc, curr) => acc + (curr.currentStreak || 0),
          0
        ) || '0',
      color: '#c084fc',
      accentGlow: 'rgba(192, 132, 252, 0.25)',
      tag: 'FIRE'
    },
    {
      isProgressRing: true,
      label: "Today's Target",
      color: '#a855f7',
      accentGlow: 'rgba(168, 85, 247, 0.25)',
      tag: 'DAILY'
    },
    {
      icon: Activity,
      label: 'Total Habits',
      value: totalHabits || '0',
      color: '#e879f9',
      accentGlow: 'rgba(232, 121, 249, 0.25)',
      tag: 'LIVE'
    },
    {
      icon: Zap,
      label: 'Best Streak',
      value:
        Math.max(
          ...habits.map((h) => h.longestStreak || 0),
          0
        ) || '0',
      color: '#818cf8',
      accentGlow: 'rgba(129, 140, 248, 0.25)',
      tag: 'RECORD'
    },
  ];

  const isLoading = habitsLoading || logsLoading;

  return (
    <div className="space-y-8 w-full max-w-full overflow-hidden">

      {/* ═══════════════════════════════════════
          HERO BANNER
      ═══════════════════════════════════════ */}
      <GlassPanel className="p-6 sm:p-8" hoverable={false} glow>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 min-w-0">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="min-w-0 flex-1"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                Performance Matrix
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white break-words">
              Good {getGreetingTime()},{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                {user?.name?.split(' ')[0] || 'Athlete'}
              </span>
            </h1>

            <p className="mt-2 text-sm sm:text-base text-zinc-400 font-medium max-w-xl break-words">
              Lock in your discipline. Every checked rep compounds into momentum.
            </p>
          </motion.div>

          <Button
            variant="primary"
            onClick={handleOpenCreate}
            className="flex items-center justify-center gap-2 self-start md:self-auto shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create New Habit</span>
          </Button>
        </div>
      </GlassPanel>

      {/* ═══════════════════════════════════════
          AI MOTIVATION TERMINAL
      ═══════════════════════════════════════ */}
      <div className="w-full min-w-0 overflow-hidden">
        <MorningMotivation />
      </div>

      {/* ═══════════════════════════════════════
          STATS TILES
      ═══════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full min-w-0">
        {stats.map((stat, i) => (
          <GlassPanel
            key={stat.label}
            className="p-5 sm:p-6 min-h-[140px] flex flex-col justify-between min-w-0"
            hoverable
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="h-full flex flex-col justify-between gap-4 min-w-0"
            >
              <div className="flex items-center justify-between gap-2 min-w-0">
                {stat.isProgressRing ? (
                  <div className="shrink-0">
                    <ProgressRing
                      size={48}
                      strokeWidth={5}
                      progress={progressPercent}
                      color={stat.color}
                    />
                  </div>
                ) : (
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0"
                    style={{
                      background: `${stat.color}15`,
                      borderColor: `${stat.color}40`,
                      boxShadow: `0 0 15px ${stat.accentGlow}`,
                    }}
                  >
                    <stat.icon
                      className="w-5 h-5"
                      style={{ color: stat.color }}
                    />
                  </div>
                )}

                <span 
                  className="text-[10px] font-mono font-black tracking-widest px-2 py-0.5 rounded border shrink-0"
                  style={{
                    color: stat.color,
                    borderColor: `${stat.color}30`,
                    background: `${stat.color}10`
                  }}
                >
                  {stat.tag}
                </span>
              </div>

              <div className="min-w-0">
                {stat.isProgressRing ? (
                  <div>
                    <p className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono truncate">
                      {completedTodayCount}
                      <span className="text-zinc-500 font-sans text-lg font-normal">/{totalHabits}</span>
                    </p>
                    <p className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mt-0.5 truncate">
                      {stat.label}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono truncate">
                      {stat.value}
                    </p>
                    <p className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mt-0.5 truncate">
                      {stat.label}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </GlassPanel>
        ))}
      </div>

      {/* ═══════════════════════════════════════
          HEATMAP CONSISTENCY HUD
      ═══════════════════════════════════════ */}
      {habits.length > 0 && (
        <section className="space-y-4 w-full min-w-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-1.5 h-5 rounded-full bg-emerald-400 shrink-0" />
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white uppercase font-mono truncate">
                Consistency Grid (90 Days)
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-500 shrink-0">Live Telemetry</span>
          </div>

          <GlassPanel className="p-5 sm:p-6 overflow-x-auto min-w-0" hoverable={false}>
            <Heatmap90Day />
          </GlassPanel>
        </section>
      )}

      {/* ═══════════════════════════════════════
          ACTIVE HABITS
      ═══════════════════════════════════════ */}
      <section className="space-y-4 w-full min-w-0">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80 gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-1.5 h-5 rounded-full bg-teal-400 shrink-0" />
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white uppercase font-mono truncate">
              Active Habits
            </h2>
          </div>

          {habits.length > 0 && (
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-emerald-400 shrink-0">
              {completedTodayCount} / {totalHabits} DONE
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-48 rounded-3xl bg-zinc-900/40 border border-zinc-800/60 animate-pulse"
              />
            ))}
          </div>
        ) : habits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full min-w-0">
            {habits.map((habit) => (
              <HabitCard
                key={habit._id}
                habit={habit}
                onEdit={handleOpenEdit}
                onArchive={archiveHabit}
                onDelete={deleteHabit}
                onToggleLog={handleToggleCheck}
                isCompletedToday={!!completedMap[habit._id]}
              />
            ))}
          </div>
        ) : (
          <GlassPanel className="p-8 text-center py-16" glow hoverable={false}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="max-w-md mx-auto flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-emerald-500/10 border border-emerald-500/30">
                <Sparkles className="w-8 h-8 text-emerald-400" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white uppercase font-mono tracking-tight mb-2">
                No Habits Tracked
              </h2>

              <p className="text-sm text-zinc-400 mb-6 font-medium">
                Initialize your daily routine matrix. Start small, maintain discipline, and stack your streak.
              </p>

              <Button
                variant="primary"
                onClick={handleOpenCreate}
              >
                + Initialize First Habit
              </Button>
            </motion.div>
          </GlassPanel>
        )}
      </section>

      {/* ═══════════════════════════════════════
          HABIT FORM MODAL
      ═══════════════════════════════════════ */}
      <HabitForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingHabit(null);
        }}
        onSubmit={handleFormSubmit}
        habit={editingHabit}
      />

    </div>
  );
};

function getGreetingTime() {
  const hour = new Date().getHours();

  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  if (hour < 21) return 'Evening';

  return 'Night';
}

export default Dashboard;