import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as habitsApi from '../api/habits';
import toast from '../components/ui/Toast';

/**
 * Custom hook to manage habit CRUD querying and mutation hooks with TanStack Query.
 */
export const useHabits = (archived = false) => {
  const queryClient = useQueryClient();

  // ─── Query: Get Habits ──────────────────────────────────
  const {
    data: habits = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['habits', { archived }],
    queryFn: () => habitsApi.getHabits(archived),
    select: (res) => res.data || [],
  });

  // ─── Mutation: Create Habit ─────────────────────────────
  const createMutation = useMutation({
    mutationFn: habitsApi.createHabit,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast.success(res.message || 'Habit created successfully');
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to create habit';
      toast.error(errorMsg);
    },
  });

  // ─── Mutation: Update Habit ─────────────────────────────
  const updateMutation = useMutation({
    mutationFn: ({ id, habitData }) => habitsApi.updateHabit(id, habitData),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast.success(res.message || 'Habit updated successfully');
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to update habit';
      toast.error(errorMsg);
    },
  });

  // ─── Mutation: Archive Habit ────────────────────────────
  const archiveMutation = useMutation({
    mutationFn: habitsApi.toggleArchiveHabit,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast.success(res.message || 'Habit archiving updated');
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to archive habit';
      toast.error(errorMsg);
    },
  });

  // ─── Mutation: Delete Habit ─────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: habitsApi.deleteHabit,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['habits'] });
      toast.success(res.message || 'Habit deleted successfully');
    },
    onError: (err) => {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to delete habit';
      toast.error(errorMsg);
    },
  });

  return {
    habits,
    isLoading,
    isError,
    error,
    refetch,
    createHabit: createMutation.mutateAsync,
    updateHabit: updateMutation.mutateAsync,
    archiveHabit: archiveMutation.mutateAsync,
    deleteHabit: deleteMutation.mutateAsync,
    isMutating:
      createMutation.isPending ||
      updateMutation.isPending ||
      archiveMutation.isPending ||
      deleteMutation.isPending,
  };
};

export default useHabits;
