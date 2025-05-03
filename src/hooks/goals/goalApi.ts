
import { supabase } from '@/integrations/supabase/client';
import { Goal } from './types';
import { validateCurrency } from './utils';
import { useToast } from '@/hooks/use-toast';

export const useGoalApi = () => {
  const { toast } = useToast();

  // Fetch all goals
  const fetchGoals = async (userId: string): Promise<Goal[]> => {
    try {
      if (!userId) {
        console.error('No user ID provided to fetchGoals');
        return [];
      }
      
      console.log('Fetching goals for user ID:', userId);
      
      // First get user's own goals
      const { data: ownGoals, error: ownError } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', userId);
      
      if (ownError) {
        console.error('Error fetching own goals:', ownError);
        throw ownError;
      }
      
      // Then get goals where user is a collaborator
      const { data: collaborations, error: collabError } = await supabase
        .from('goal_collaborators')
        .select('goal_id')
        .eq('user_id', userId);
      
      if (collabError) {
        console.error('Error fetching collaborations:', collabError);
        throw collabError;
      }
      
      let sharedGoals: Goal[] = [];
      
      if (collaborations && collaborations.length > 0) {
        const goalIds = collaborations.map(c => c.goal_id);
        
        const { data: collabGoals, error: fetchError } = await supabase
          .from('savings_goals')
          .select('*')
          .in('id', goalIds);
        
        if (fetchError) {
          console.error('Error fetching collaborative goals:', fetchError);
          throw fetchError;
        }
        
        if (collabGoals) {
          // Convert database records to Goal objects with proper currency type
          sharedGoals = collabGoals.map(goal => ({
            ...goal,
            currency: validateCurrency(goal.currency)
          }));
        }
      }
      
      // Combine both sets of goals, ensuring proper currency type
      const typedOwnGoals = ownGoals ? ownGoals.map(goal => ({
        ...goal,
        currency: validateCurrency(goal.currency)
      })) : [];
      
      console.log('Fetched goals count:', (typedOwnGoals.length + sharedGoals.length));
      return [...typedOwnGoals, ...sharedGoals];
      
    } catch (error: any) {
      console.error('Error fetching goals:', error);
      toast({
        title: "Error",
        description: "Failed to load goals: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
      throw error; // Re-throw to allow handling at the hook level
    }
  };

  // Add a new goal
  const addGoal = async (goal: Omit<Goal, 'id'>): Promise<Goal | null> => {
    try {
      console.log('Adding goal in goalApi:', goal);
      
      // Ensure user_id is present in the goal object before inserting
      if (!goal.user_id) {
        throw new Error("User ID is required to add a goal");
      }
      
      // Make sure all required fields are present and properly formatted
      const goalData = {
        title: goal.title,
        target_amount: goal.target_amount,
        saved_amount: goal.saved_amount || 0,
        target_date: goal.target_date || null,
        emoji: goal.emoji || '🎯',
        user_id: goal.user_id,
        currency: goal.currency || 'IDR'
      };
      
      console.log('Inserting goal data:', goalData);
      
      const { data, error } = await supabase
        .from('savings_goals')
        .insert(goalData)
        .select('*')
        .single();
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      if (!data) throw new Error("No data returned from insert");
      
      console.log('Successfully added goal:', data);
      
      return {
        ...data,
        currency: validateCurrency(data.currency)
      };
      
    } catch (error: any) {
      console.error('Error adding goal:', error);
      throw error; // Re-throw to allow handling at the hook level
    }
  };

  // Delete a goal
  const deleteGoal = async (goalId: string): Promise<boolean> => {
    try {
      console.log('Deleting goal with ID:', goalId);
      
      const { error } = await supabase
        .from('savings_goals')
        .delete()
        .eq('id', goalId);
      
      if (error) throw error;
      
      console.log('Successfully deleted goal with ID:', goalId);
      return true;
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      throw error; // Re-throw to allow handling at the hook level
    }
  };

  return {
    fetchGoals,
    addGoal,
    deleteGoal
  };
};
