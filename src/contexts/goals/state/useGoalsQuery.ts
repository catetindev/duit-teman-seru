
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Goal } from '@/hooks/goals/types';
import { SortBy, SortDirection } from '../types';

export function useGoalsQuery() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);

  // Function to fetch goals from Supabase
  const fetchGoals = useCallback(async (sortBy: SortBy = 'target_date', sortDirection: SortDirection = 'asc') => {
    setLoading(true);
    try {
      // Use savings_goals table instead of goals
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .order(sortBy, { ascending: sortDirection === 'asc' });

      if (error) throw error;
      
      // Convert the data to the Goal type
      const fetchedGoals: Goal[] = data.map(goal => ({
        id: goal.id,
        title: goal.title,
        target_amount: goal.target_amount,
        saved_amount: goal.saved_amount,
        target_date: goal.target_date,
        currency: goal.currency as 'IDR' | 'USD',
        user_id: goal.user_id,
        emoji: goal.emoji,
        has_collaborators: goal.has_collaborators || false
      }));

      setGoals(fetchedGoals);
      setError(null);
    } catch (error: any) {
      setError(error);
      toast(error.message || "Failed to fetch goals");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    goals,
    setGoals,
    loading,
    error,
    fetchGoals
  };
}
