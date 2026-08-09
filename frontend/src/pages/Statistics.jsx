import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, Calendar, CheckCircle2, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import useStats from '../hooks/useStats';
import GlassPanel from '../components/ui/GlassPanel';

// Sleek chart colors matching brand palette
const COLORS = ['#f59e0b', '#a855f7', '#34d399', '#fb7185', '#38bdf8'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-900/90 border p-3.5 rounded-xl shadow-xl backdrop-blur-md" style={{ borderColor: 'var(--glass-border)' }}>
        <p className="text-xs font-bold text-neutral-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-extrabold mt-1" style={{ color: 'var(--color-amber-glow)' }}>
          {payload[0].value} check-ins
        </p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-900/90 border p-3 rounded-xl shadow-xl backdrop-blur-md" style={{ borderColor: 'var(--glass-border)' }}>
        <p className="text-xs font-bold text-neutral-400 uppercase tracking-wide">{payload[0].name}</p>
        <p className="text-sm font-extrabold mt-1 text-white">
          {payload[0].value} habit{payload[0].value !== 1 ? 's' : ''}
        </p>
      </div>
    );
  }
  return null;
};

const Statistics = () => {
  const { overview, monthly, categoryBreakdown, performance, isLoading, isError } = useStats();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        <p className="text-sm text-neutral-400">Aggregating statistics...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <GlassPanel className="p-8 text-center" hoverable={false}>
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold">Failed to load statistics</h3>
        <p className="text-sm text-neutral-400 mt-1">Please try again later.</p>
      </GlassPanel>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
          Statistics
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Deep-dive analysis of your habits and streak history.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <GlassPanel className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-500/10 shrink-0">
            <Trophy className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">{overview.bestStreak || 0} days</p>
            <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mt-0.5">Best Streak</p>
          </div>
        </GlassPanel>

        <GlassPanel className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-500/10 shrink-0">
            <Calendar className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">{overview.longestStreak || 0} days</p>
            <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mt-0.5">Longest Run</p>
          </div>
        </GlassPanel>

        <GlassPanel className="p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-500/10 shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">{overview.completionRate || 0}%</p>
            <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wider mt-0.5">30-Day Completion Rate</p>
          </div>
        </GlassPanel>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly completions chart */}
        <GlassPanel className="p-5" hoverable={false}>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-4">
            Monthly Log Volume
          </h3>
          <div className="h-64">
            {monthly.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                  <XAxis dataKey="month" stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--text-tertiary)" fontSize={11} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <Bar dataKey="completions" fill="var(--color-amber-glow)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-neutral-400">
                No check-in logs to chart yet.
              </div>
            )}
          </div>
        </GlassPanel>

        {/* Category Breakdown Donut */}
        <GlassPanel className="p-5" hoverable={false}>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-4">
            Category Distribution
          </h3>
          <div className="h-64 flex items-center justify-center">
            {categoryBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip content={<CustomPieTooltip />} />
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-neutral-400">
                No active habits to distribute yet.
              </div>
            )}
          </div>
        </GlassPanel>
      </div>

      {/* Per-habit performance list */}
      <GlassPanel className="p-5" hoverable={false}>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-neutral-400 mb-4">
          Habit Execution Leaderboard
        </h3>
        
        {performance.length > 0 ? (
          <div className="space-y-4">
            {performance.map((habit) => (
              <div key={habit._id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                      {habit.name}
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      ({habit.completions} completions)
                    </span>
                  </div>
                  <span className="font-bold" style={{ color: habit.color }}>
                    {habit.completionRate}%
                  </span>
                </div>
                {/* Visual Progress Bar */}
                <div className="h-2 w-full rounded-full bg-neutral-900 overflow-hidden border" style={{ borderColor: 'var(--glass-border)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${habit.completionRate}%`,
                      backgroundColor: habit.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-xs text-neutral-400 py-8">
            Create habits to track execution rates here.
          </p>
        )}
      </GlassPanel>
    </div>
  );
};

export default Statistics;
