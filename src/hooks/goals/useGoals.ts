
import { useState, useEffect, useRef } from 'react';
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

  // Wrapper for fetchGoals that updates state
  const fetchGoals = async () => {
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
      if (newGoal && isMounted.current) {
        setGoals(prev => [...prev, newGoal]);
        // Clear any previous errors
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
  };

  // Wrapper for deleteGoal that updates state if successful
  const deleteGoal = async (goalId: string): Promise<void> => {
    try {
      console.log('Deleting goal:', goalId);
      const success = await goalApi.deleteGoal(goalId);
      if (success && isMounted.current) {
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
  };

  // Set up real-time subscription for goals
  useEffect(() => {
    if (!userId) return;

    console.log('Setting up realtime subscriptions for user:', userId);
    
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

    return () => {
      console.log('Removing realtime channel subscription');
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Use useEffect to fetch goals when component mounts
  useEffect(() => {
    if (shouldFetch && userId) {
      console.log('Initial fetch of goals for user:', userId);
      fetchGoals();
    } else if (!userId) {
      console.log('No userId provided, setting loading to false');
      setLoading(false);
    }
    
    // No need to include fetchGoals in dependency array as it would cause refetching
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldFetch, userId]);

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
    addCollaborator: collaboratorApi.inviteCollaborator, // Changed to use inviteCollaborator
    removeCollaborator: collaboratorApi.removeCollaborator
  };
}
