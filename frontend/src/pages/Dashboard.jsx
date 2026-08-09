import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Target, TrendingUp, Plus } from 'lucide-react';
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

/**
 * Dashboard — main page displaying active habits list, stats overview,
 * today's progress ring, and quick-add actions.
 */
const Dashboard = () => {
  const { user } = useAuth();
  const {
    habits,
    isLoading: habitsLoading,
    createHabit,
    updateHabit,
    archiveHabit,
    deleteHabit,
  } = useHabits(false); // archived = false

  const {
    weekDates,
    grid,
    isLoading: logsLoading,
    toggleLog,
  } = useLogs(0); // Current week logs

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);

  // 1. Resolve local YYYY-MM-DD string for today relative to user timezone
  const todayStr = new Date().toLocaleDateString('en-CA');

  // 2. Identify check-in status mapping
  const completedMap = {};
  grid.forEach((row) => {
    const matchingToday = row.completions.find((c) => c.date === todayStr);
    completedMap[row.habit._id] = !!(matchingToday && matchingToday.completed);
  });

  // 3. Compute actual stats based on real logs
  const totalHabits = habits.length;
  const completedTodayCount = habits.filter((h) => completedMap[h._id]).length;
  const progressPercent = totalHabits > 0 ? completedTodayCount / totalHabits : 0;

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
        await updateHabit({ id: editingHabit._id, habitData: formData });
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
      await toggleLog({ habitId, date: todayStr });
    } catch (err) {
      console.error('Error toggling check-in:', err);
    }
  };

  const stats = [
    {
      icon: Flame,
      label: 'Active Streaks',
      value: habits.reduce((acc, curr) => acc + (curr.currentStreak || 0), 0) || '0',
      color: '#f59e0b',
    },
    {
      // Custom render progress ring
      isProgressRing: true,
      label: "Today's Progress",
      color: '#34d399',
    },
    {
      icon: TrendingUp,
      label: 'Active Habits',
      value: totalHabits || '0',
      color: '#a855f7',
    },
    {
      icon: Sparkles,
      label: 'Best Streak',
      value: Math.max(...habits.map((h) => h.longestStreak || 0), 0) || '0',
      color: '#fb7185',
    },
  ];

  const isLoading = habitsLoading || logsLoading;

  return (
    <div className="space-y-6">
      {/* Greeting and Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1
            className="text-3xl md:text-4xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Good{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {getGreetingTime()}
            </span>
            , {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Let&apos;s build some momentum today.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Button
            variant="primary"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 font-bold px-6 py-3 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Habit</span>
          </Button>
        </motion.div>
      </div>

      {/* Morning Motivation Quote Banner */}
      <MorningMotivation />

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <GlassPanel
            key={stat.label}
            className="p-5 flex flex-col gap-3"
            hoverable
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.2 }}
              className="flex flex-col h-full justify-between"
            >
              {stat.isProgressRing ? (
                <div className="flex items-center gap-4">
                  <ProgressRing size={52} strokeWidth={5} progress={progressPercent} color={stat.color} />
                  <div>
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      {completedTodayCount}/{totalHabits} Done
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">{stat.label}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                    style={{ background: `${stat.color}20` }}
                  >
                    <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {stat.value}
                    </p>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                      {stat.label}
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </GlassPanel>
        ))}
      </div>

      {/* Aggregated Heatmap Consistency Map */}
      {habits.length > 0 && (
        <GlassPanel className="p-6" hoverable={false}>
          <Heatmap90Day />
        </GlassPanel>
      )}

      {/* Habits Grid / Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <GlassPanel key={n} className="p-6 h-48 animate-pulse flex flex-col justify-between" hoverable={false}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-neutral-800" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-neutral-800 rounded w-2/3" />
                  <div className="h-3 bg-neutral-800 rounded w-1/3" />
                </div>
              </div>
              <div className="h-10 bg-neutral-800 rounded-xl w-full" />
            </GlassPanel>
          ))}
        </div>
      ) : habits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            className="max-w-md mx-auto"
          >
            <div
              className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(168,85,247,0.2))',
              }}
            >
              <Sparkles className="w-8 h-8" style={{ color: '#f59e0b' }} />
            </div>
            <h2
              className="text-xl font-bold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Ready to start tracking?
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
              Create your first habit to begin building your streak. Google Gemini will start coaching you once you have check-in data.
            </p>
            <Button
              variant="primary"
              onClick={handleOpenCreate}
              className="font-bold px-6 py-3"
            >
              Create Your First Habit
            </Button>
          </motion.div>
        </GlassPanel>
      )}

      {/* Habit Form Modal */}
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

/** Returns time-of-day greeting word */
function getGreetingTime() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  if (hour < 21) return 'Evening';
  return 'Night';
}

export default Dashboard;
