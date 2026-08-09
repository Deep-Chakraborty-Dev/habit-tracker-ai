import { useQuery } from '@tanstack/react-query';
import * as logsApi from '../../api/logs';
import { Sparkles, Loader2 } from 'lucide-react';

/**
 * Heatmap90Day — GitHub-style 90-day consistency heatmap.
 * Uses a grid of color-intensity boxes mapped to completion counts.
 *
 * @param {string} habitId - Optional habit ID. If null, aggregates all habits.
 */
const Heatmap90Day = ({ habitId = null }) => {
  const { data: heatmap = [], isLoading } = useQuery({
    queryKey: ['heatmap', { habitId }],
    queryFn: () => logsApi.getHeatmapLogs(habitId),
    select: (res) => res.data || [],
  });

  // Color mapping based on completion counts
  const getColorClass = (count) => {
    if (count === 0) return 'var(--heatmap-empty)';
    if (count === 1) return 'rgba(245, 158, 11, 0.25)'; // Muted Amber
    if (count === 2) return 'rgba(245, 158, 11, 0.5)';  // Medium Amber
    if (count === 3) return 'rgba(245, 158, 11, 0.75)'; // Strong Amber
    return 'var(--color-amber-glow)';                   // Full Amber Glow
  };

  const formatDate = (dateStr) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', options);
  };

  if (isLoading) {
    return (
      <div className="h-32 flex items-center justify-center gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-neutral-400" />
        <span className="text-xs text-neutral-400">Loading consistency map...</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span className="font-semibold uppercase tracking-wider">90-Day Heatmap</span>
        <div className="flex items-center gap-1">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: 'var(--heatmap-empty)' }} />
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: 'rgba(245, 158, 11, 0.25)' }} />
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: 'rgba(245, 158, 11, 0.5)' }} />
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: 'rgba(245, 158, 11, 0.75)' }} />
          <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: 'var(--color-amber-glow)' }} />
          <span>More</span>
        </div>
      </div>

      {/* Grid Container */}
      <div className="overflow-x-auto pb-2 scrollbar-none">
        <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[640px]">
          {heatmap.map((day) => (
            <div
              key={day.date}
              className="w-4 h-4 rounded-[4px] transition-all duration-200 hover:scale-115 cursor-pointer relative group"
              style={{ backgroundColor: getColorClass(day.count) }}
            >
              {/* Custom tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 pointer-events-none">
                <div className="bg-neutral-900 border text-white text-[10px] px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl" style={{ borderColor: 'var(--glass-border)' }}>
                  <p className="font-bold">{day.count} completion{day.count !== 1 ? 's' : ''}</p>
                  <p className="text-neutral-400 mt-0.5">{formatDate(day.date)}</p>
                </div>
                {/* Arrow */}
                <div className="w-1.5 h-1.5 bg-neutral-900 border-r border-b border-white/10 rotate-45 absolute top-full left-1/2 -translate-x-1/2 -translate-y-[4px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Heatmap90Day;
