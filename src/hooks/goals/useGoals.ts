
import { useState, useEffect, useRef, useCallback } from 'react';
import { Goal, Collaborator } from './types';
import { useGoalApi } from './goalApi';
import { useCollaboratorApi } from './collaboratorApi';
import { formatCurrency, calculateProgress } from '@/utils/formatUtils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useGoals(userId: string | undefined, shouldFetch: boolean = true) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Add ref to track mounted state
  const isMounted = useRef(true);
  
  const { toast } = useToast();
  const goalApi = useGoalApi();
  const collaboratorApi = useCollaboratorApi();

  // Cleanup function to prevent state updates after unmounting
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Fetch goals function with comprehensive error handling
  const fetchGoals = useCallback(async () => {
    if (!userId) {
      console.warn('No userId provided to useGoals.fetchGoals');
      if (isMounted.current) {
        setLoading(false);
        setError('User ID is required to fetch goals');
      }
      return;
    }
    
    console.log('Fetching goals for user:', userId);
    if (isMounted.current) {
      setLoading(true);
      setError(null);
    }
    
    try {
      const fetchedGoals = await goalApi.fetchGoals(userId);
      console.log('Fetched goals:', fetchedGoals);
      if (isMounted.current) {
        setGoals(fetchedGoals);
      }
    } catch (error: any) {
      console.error('Error in useGoals.fetchGoals:', error);
      if (isMounted.current) {
        setError(error.message || 'Failed to load goals');
        toast({
          title: "Error",
          description: error.message || 'Failed to load goals',
          variant: "destructive"
        });
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [userId, toast, goalApi]);

  // Add a new goal 
  const addGoal = useCallback(async (goal: Omit<Goal, 'id'>): Promise<Goal | null> => {
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
      if (newGoal && isMounted.current) {
        // Fetch all goals to ensure consistency rather than manual state updates
        await fetchGoals();
        setError(null);
      }
      return newGoal;
    } catch (error: any) {
      console.error('Error in useGoals.addGoal:', error);
      if (isMounted.current) {
        setError(error.message || 'Failed to add goal');
        toast({
          title: "Error",
          description: error.message || 'Failed to add goal',
          variant: "destructive"
        });
      }
      return null;
    }
  }, [goalApi, fetchGoals, toast]);

  // Delete a goal
  const deleteGoal = useCallback(async (goalId: string): Promise<void> => {
    try {
      console.log('Deleting goal:', goalId);
      const success = await goalApi.deleteGoal(goalId);
      if (success && isMounted.current) {
        // Fetch all goals to ensure consistency rather than manual state updates
        await fetchGoals();
        setError(null);
        
        toast({
          title: "Success",
          description: "Goal deleted successfully",
        });
      }
    } catch (error: any) {
      console.error('Error in useGoals.deleteGoal:', error);
      if (isMounted.current) {
        setError(error.message || 'Failed to delete goal');
        toast({
          title: "Error",
          description: error.message || 'Failed to delete goal',
          variant: "destructive"
        });
      }
      throw error; // Re-throw to allow handling in calling components
    }
  }, [goalApi, fetchGoals, toast]);

  // Set up real-time subscription for goals
  useEffect(() => {
    if (!userId) return;

    console.log('Setting up real-time subscription for goals');
    
    const channel = supabase
      .channel('public:savings_goals')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'savings_goals',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Goals change detected:', payload);
          fetchGoals();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'goal_collaborators',
        },
        (payload) => {
          console.log('Collaborators change detected:', payload);
          fetchGoals();
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      console.log('Cleaning up goals subscription');
      supabase.removeChannel(channel);
    };
  }, [userId, fetchGoals]);

  // Initial fetch when component mounts
  useEffect(() => {
    if (shouldFetch && userId) {
      fetchGoals();
    } else if (!userId) {
      setLoading(false);
    }
  }, [shouldFetch, userId, fetchGoals]);

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
    addCollaborator: collaboratorApi.inviteCollaborator,
    removeCollaborator: collaboratorApi.removeCollaborator
  };
}
