import { useQuery } from '@tanstack/react-query';
import * as statsApi from '../api/stats';

/**
 * Custom hook to fetch all habit performance statistics.
 */
export const useStats = () => {
  const overviewQuery = useQuery({
    queryKey: ['stats', 'overview'],
    queryFn: statsApi.getOverview,
    select: (res) => res.data || {},
  });

  const monthlyQuery = useQuery({
    queryKey: ['stats', 'monthly'],
    queryFn: statsApi.getMonthly,
    select: (res) => res.data || [],
  });

  const categoryQuery = useQuery({
    queryKey: ['stats', 'category'],
    queryFn: statsApi.getCategoryBreakdown,
    select: (res) => res.data || [],
  });

  const performanceQuery = useQuery({
    queryKey: ['stats', 'performance'],
    queryFn: statsApi.getPerHabitPerformance,
    select: (res) => res.data || [],
  });

  return {
    overview: overviewQuery.data || {},
    monthly: monthlyQuery.data || [],
    categoryBreakdown: categoryQuery.data || [],
    performance: performanceQuery.data || [],
    isLoading:
      overviewQuery.isLoading ||
      monthlyQuery.isLoading ||
      categoryQuery.isLoading ||
      performanceQuery.isLoading,
    isError:
      overviewQuery.isError ||
      monthlyQuery.isError ||
      categoryQuery.isError ||
      performanceQuery.isError,
  };
};

export default useStats;
