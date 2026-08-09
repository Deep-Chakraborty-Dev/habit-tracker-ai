import { useQuery, useMutation } from '@tanstack/react-query';
import * as aiApi from '../api/ai';
import { useState } from 'react';
import toast from '../components/ui/Toast';

/**
 * Hook to retrieve weekly AI coaching reports.
 */
export const useWeeklyReport = () => {
  return useQuery({
    queryKey: ['ai', 'weeklyReport'],
    queryFn: aiApi.getWeeklyReport,
    select: (res) => res.data || null,
    enabled: false, // Explicitly manual trigger by clicking "Generate Report"
  });
};

/**
 * Hook to retrieve cached morning motivation.
 */
export const useMorningMotivation = () => {
  return useQuery({
    queryKey: ['ai', 'morningMotivation'],
    queryFn: aiApi.getMorningMotivation,
    select: (res) => res.data || null,
    staleTime: 1000 * 60 * 60 * 4, // 4 hours
  });
};

/**
 * Hook to manage habit suggestions wizard.
 */
export const useSuggestions = () => {
  const mutation = useMutation({
    mutationFn: ({ goals, productiveTime, pastStruggles }) =>
      aiApi.getSuggestions(goals, productiveTime, pastStruggles),
    onError: (err) => {
      const msg = err.response?.data?.error || err.message || 'Failed to suggest habits';
      toast.error(msg);
    },
  });

  return {
    generateSuggestions: mutation.mutateAsync,
    suggestions: mutation.data?.data?.suggestions || [],
    isLoading: mutation.isPending,
  };
};

/**
 * Hook to retrieve comeback plan for a habit.
 */
export const useRecoveryPlan = (habitId) => {
  return useQuery({
    queryKey: ['ai', 'recoveryPlan', habitId],
    queryFn: () => aiApi.getRecoveryPlan(habitId),
    select: (res) => res.data || null,
    enabled: !!habitId,
  });
};

/**
 * State hook to manage rolling chat Q&A interactions.
 */
export const useHabitChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const askQuestion = async (text) => {
    if (!text.trim()) return;

    const userMessage = { role: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Map history format: [{ role: 'user'|'model', parts: [{ text: string }] }]
      const formattedHistory = messages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

      const res = await aiApi.askChat(text, formattedHistory);

      if (res.success && res.data) {
        const aiMessage = { role: 'model', text: res.data.reply };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        toast.error('Failed to get AI assistant reply');
      }
    } catch (error) {
      const msg = error.response?.data?.error || error.message || 'Failed to connect to AI';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    askQuestion,
    isLoading,
    clearChat: () => setMessages([]),
  };
};
