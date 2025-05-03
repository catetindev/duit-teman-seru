
import { supabase } from '@/integrations/supabase/client';
import { Goal } from './types';
import { validateCurrency } from './utils';
import { useToast } from '@/hooks/use-toast';

export const useGoalApi = () => {
  const { toast } = useToast();

  // Fetch all goals
  const fetchGoals = async (userId: string): Promise<Goal[]> => {
    try {
      // First get user's own goals
      const { data: ownGoals, error: ownError } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', userId);
      
      if (ownError) throw ownError;
      
      // Then get goals where user is a collaborator
      const { data: collaborations, error: collabError } = await supabase
        .from('goal_collaborators')
        .select('goal_id')
        .eq('user_id', userId);
      
      if (collabError) throw collabError;
      
      let sharedGoals: Goal[] = [];
      
      if (collaborations && collaborations.length > 0) {
        const goalIds = collaborations.map(c => c.goal_id);
        
        const { data: collabGoals, error: fetchError } = await supabase
          .from('savings_goals')
          .select('*')
          .in('id', goalIds);
        
        if (fetchError) throw fetchError;
        
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
      
      return [...typedOwnGoals, ...sharedGoals];
      
    } catch (error: any) {
      console.error('Error fetching goals:', error);
      toast({
        title: "Error",
        description: "Failed to load goals",
        variant: "destructive"
      });
      return [];
    }
  };

  // Delete a goal
  const deleteGoal = async (goalId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('savings_goals')
        .delete()
        .eq('id', goalId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Goal has been deleted",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      toast({
        title: "Error",
        description: "Failed to delete goal",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    fetchGoals,
    deleteGoal
  };
};
