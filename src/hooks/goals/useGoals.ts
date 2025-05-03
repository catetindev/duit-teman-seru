
import { useState, useEffect } from 'react';
import { Goal, Collaborator } from './types';
import { useGoalApi } from './goalApi';
import { useCollaboratorApi } from './collaboratorApi';
import { formatCurrency, calculateProgress } from '@/utils/formatUtils';
import { useToast } from '@/hooks/use-toast';

export function useGoals(userId: string | undefined, shouldFetch: boolean = true) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { toast } = useToast();
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
    
    console.log('Fetching goals for user:', userId);
    setLoading(true);
    setError(null);
    try {
      const fetchedGoals = await goalApi.fetchGoals(userId);
      console.log('Fetched goals:', fetchedGoals);
      setGoals(fetchedGoals);
    } catch (error: any) {
      console.error('Error in useGoals.fetchGoals:', error);
      setError(error.message || 'Failed to load goals');
      toast({
        title: "Error",
        description: error.message || 'Failed to load goals',
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Add a new goal and update state if successful
  const addGoal = async (goal: Omit<Goal, 'id'>): Promise<Goal | null> => {
    console.log('Adding goal in useGoals:', goal);
    // Make sure user_id is set
    if (!goal.user_id) {
      console.error('No user_id provided to useGoals.addGoal');
      setError('User ID is required to add a goal');
      toast({
        title: "Error",
        description: 'User ID is required to add a goal',
        variant: "destructive"
      });
      return null;
    }
    
    try {
      const newGoal = await goalApi.addGoal(goal);
      console.log('New goal created:', newGoal);
      if (newGoal) {
        setGoals(prev => [...prev, newGoal]);
        // Clear any previous errors
        setError(null);
      }
      return newGoal;
    } catch (error: any) {
      console.error('Error in useGoals.addGoal:', error);
      setError(error.message || 'Failed to add goal');
      toast({
        title: "Error",
        description: error.message || 'Failed to add goal',
        variant: "destructive"
      });
      return null;
    }
  };

  // Wrapper for deleteGoal that updates state if successful
  const deleteGoal = async (goalId: string): Promise<void> => {
    try {
      console.log('Deleting goal:', goalId);
      const success = await goalApi.deleteGoal(goalId);
      if (success) {
        setGoals(prev => prev.filter(goal => goal.id !== goalId));
        // Clear any previous errors
        setError(null);
        
        toast({
          title: "Success",
          description: "Goal deleted successfully",
        });
      }
    } catch (error: any) {
      console.error('Error in useGoals.deleteGoal:', error);
      setError(error.message || 'Failed to delete goal');
      toast({
        title: "Error",
        description: error.message || 'Failed to delete goal',
        variant: "destructive"
      });
      throw error; // Re-throw to allow handling in calling components
    }
  };

  // Use useEffect to fetch goals when component mounts
  useEffect(() => {
    if (shouldFetch && userId) {
      fetchGoals();
    } else if (!userId) {
      setLoading(false);
    }
  }, [shouldFetch, userId]); // Remove 'loading' from dependency array to avoid loops

  return {
    goals,
    loading,
    error,
    fetchGoals,
    addGoal,
    deleteGoal,
    formatCurrency,
    calculateProgress,
    fetchCollaborators: collaboratorApi.fetchCollaborators,
    addCollaborator: collaboratorApi.addCollaborator,
    removeCollaborator: collaboratorApi.removeCollaborator
  };
}
