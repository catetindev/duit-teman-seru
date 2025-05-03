
import { useState, useEffect } from 'react';
import { Goal } from './types';
import { useGoalApi } from './goalApi';
import { useCollaboratorApi } from './collaboratorApi';
import { formatCurrency, calculateProgress } from './utils';

export function useGoals(userId: string) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  
  const goalApi = useGoalApi();
  const collaboratorApi = useCollaboratorApi();

  // Wrapper for fetchGoals that updates state
  const fetchGoals = async () => {
    setLoading(true);
    const fetchedGoals = await goalApi.fetchGoals(userId);
    setGoals(fetchedGoals);
    setLoading(false);
  };

  // Add a new goal and update state if successful
  const addGoal = async (goal: Omit<Goal, 'id'>): Promise<Goal | null> => {
    const newGoal = await goalApi.addGoal(goal);
    if (newGoal) {
      setGoals(prev => [...prev, newGoal]);
    }
    return newGoal;
  };

  // Wrapper for deleteGoal that updates state if successful
  const deleteGoal = async (goalId: string): Promise<void> => {
    const success = await goalApi.deleteGoal(goalId);
    if (success) {
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
    }
  };

  useEffect(() => {
    if (userId) {
      fetchGoals();
    }
  }, [userId]);

  return {
    goals,
    loading,
    fetchGoals,
    addGoal,
    deleteGoal,
    formatCurrency,
    calculateProgress,
    ...collaboratorApi
  };
}
