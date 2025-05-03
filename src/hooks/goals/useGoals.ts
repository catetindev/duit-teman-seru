
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
    if (!userId) {
      console.warn('No userId provided to useGoals.fetchGoals');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const fetchedGoals = await goalApi.fetchGoals(userId);
      setGoals(fetchedGoals);
    } catch (error) {
      console.error('Error in useGoals.fetchGoals:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new goal and update state if successful
  const addGoal = async (goal: Omit<Goal, 'id'>): Promise<Goal | null> => {
    // Make sure user_id is set
    if (!goal.user_id) {
      console.error('No user_id provided to useGoals.addGoal');
      return null;
    }
    
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
    } else {
      setLoading(false);
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
