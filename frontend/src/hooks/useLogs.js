import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as logsApi from '../api/logs';
import toast from '../components/ui/Toast';
import confetti from 'canvas-confetti';

/**
 * Custom hook to manage habit check-in logs queries and mutations using TanStack Query.
 */
export const useLogs = (weekOffset = 0) => {
  const queryClient = useQueryClient();

  // ─── Query: Get Week Grid Logs ──────────────────────────
  const {
    data: weekData = { dates: [], grid: [] },
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['weekGrid', { weekOffset }],
    queryFn: () => logsApi.getWeekGrid(weekOffset),
    select: (res) => res.data || { dates: [], grid: [] },
  });

  // ─── Mutation: Toggle Check-in ──────────────────────────
  const toggleMutation = useMutation({
    mutationFn: ({ habitId, date }) => logsApi.toggleLog(habitId, date),
    onSuccess: (res, variables) => {
      // Invalidate both weekGrid queries and habits queries to update streaks on UI
      queryClient.invalidateQueries({ queryKey: ['weekGrid'] });
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      queryClient.invalidateQueries({ queryKey: ['heatmap'] });
      queryClient.invalidateQueries({ queryKey: ['stats'] });

      // Trigger satisfying confetti burst if user checked off the habit
      if (res.data?.log?.completed) {
        // Play audio or burst confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#a855f7', '#34d399', '#fb7185', '#38bdf8'],
        });
        toast.success(res.message || 'Habit completed!');
      } else {
        toast.info('Habit completion removed');
      }
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to toggle log';
      toast.error(errorMsg);
    },
  });

  return {
    weekDates: weekData.dates,
    grid: weekData.grid,
    isLoading,
    isError,
    refetch,
    toggleLog: toggleMutation.mutateAsync,
    isToggling: toggleMutation.isPending,
  };
};

export default useLogs;
