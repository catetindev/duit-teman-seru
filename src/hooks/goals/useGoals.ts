
import { useState, useEffect } from 'react';
import { Goal } from './types';
import { useGoalApi } from './goalApi';
import { useCollaboratorApi } from './collaboratorApi';
import { formatCurrency, calculateProgress } from './utils';

export function useGoals(userId: string) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const goalApi = useGoalApi();
  const collaboratorApi = useCollaboratorApi();

  // Wrapper for fetchGoals that updates state
  const fetchGoals = async () => {
    if (!userId) {
      console.warn('No userId provided to useGoals.fetchGoals');
      setLoading(false);
      setError('User ID is required to fetch goals');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const fetchedGoals = await goalApi.fetchGoals(userId);
      setGoals(fetchedGoals);
    } catch (error: any) {
      console.error('Error in useGoals.fetchGoals:', error);
      setError(error.message || 'Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  // Add a new goal and update state if successful
  const addGoal = async (goal: Omit<Goal, 'id'>): Promise<Goal | null> => {
    // Make sure user_id is set
    if (!goal.user_id) {
      console.error('No user_id provided to useGoals.addGoal');
      setError('User ID is required to add a goal');
      return null;
    }
    
    try {
      const newGoal = await goalApi.addGoal(goal);
      if (newGoal) {
        setGoals(prev => [...prev, newGoal]);
        // Clear any previous errors
        setError(null);
      }
      return newGoal;
    } catch (error: any) {
      console.error('Error in useGoals.addGoal:', error);
      setError(error.message || 'Failed to add goal');
      return null;
    }
  };

  // Wrapper for deleteGoal that updates state if successful
  const deleteGoal = async (goalId: string): Promise<void> => {
    try {
      const success = await goalApi.deleteGoal(goalId);
      if (success) {
        setGoals(prev => prev.filter(goal => goal.id !== goalId));
        // Clear any previous errors
        setError(null);
      }
    } catch (error: any) {
      console.error('Error in useGoals.deleteGoal:', error);
      setError(error.message || 'Failed to delete goal');
    }
  };

  useEffect(() => {
    if (userId) {
      fetchGoals();
    } else {
      setLoading(false);
      setError('User ID is required to fetch goals');
    }
  }, [userId]);

  return {
    goals,
    loading,
    error,
    fetchGoals,
    addGoal,
    deleteGoal,
    formatCurrency,
    calculateProgress,
    ...collaboratorApi
  };
}
