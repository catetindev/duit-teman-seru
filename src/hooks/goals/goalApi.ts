
import { supabase } from '@/integrations/supabase/client';
import { Goal, ValidCurrency } from './types';

export function useGoalApi() {
  const fetchGoals = async (userId: string): Promise<Goal[]> => {
    try {
      if (!userId) {
        throw new Error('User ID is required to fetch goals');
      }
      
      console.log('Using supabase to fetch goals for user:', userId);
      
      // Make a simple query for the user's goals
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Supabase error when fetching goals:', error);
        throw error;
      }
      
      console.log('Fetched goals data from supabase:', data);
      
      if (!data) {
        return [];
      }
      
      // Cast the currency to the valid type
      return data.map(goal => ({
        ...goal,
        currency: (goal.currency === 'USD' ? 'USD' : 'IDR') as ValidCurrency
      })) as Goal[];
    } catch (error) {
      console.error('Error in fetchGoals:', error);
      throw error;
    }
  };

  const addGoal = async (goal: Omit<Goal, 'id'>): Promise<Goal> => {
    try {
      console.log('Using supabase to insert goal:', goal);
      
      const { data, error } = await supabase
        .from('savings_goals')
        .insert(goal)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error when adding goal:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('No data returned from goal insertion');
      }
      
      console.log('Successfully added goal, received data:', data);
      
      // Cast the currency to the valid type
      return {
        ...data,
        currency: (data.currency === 'USD' ? 'USD' : 'IDR') as ValidCurrency
      } as Goal;
    } catch (error) {
      console.error('Error in addGoal:', error);
      throw error;
    }
  };

  const updateGoal = async (id: string, goal: Partial<Omit<Goal, 'id'>>): Promise<Goal> => {
    try {
      console.log('Using supabase to update goal:', id, goal);
      
      const { data, error } = await supabase
        .from('savings_goals')
        .update(goal)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Supabase error when updating goal:', error);
        throw error;
      }
      
      if (!data) {
        throw new Error('No data returned from goal update');
      }
      
      console.log('Successfully updated goal, received data:', data);
      
      // Cast the currency to the valid type
      return {
        ...data,
        currency: (data.currency === 'USD' ? 'USD' : 'IDR') as ValidCurrency
      } as Goal;
    } catch (error) {
      console.error('Error in updateGoal:', error);
      throw error;
    }
  };

  const deleteGoal = async (id: string): Promise<boolean> => {
    try {
      console.log('Using supabase to delete goal:', id);
      
      const { error } = await supabase
        .from('savings_goals')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Supabase error when deleting goal:', error);
        throw error;
      }
      
      console.log('Successfully deleted goal');
      
      return true;
    } catch (error) {
      console.error('Error in deleteGoal:', error);
      throw error;
    }
  };

  return {
    fetchGoals,
    addGoal,
    updateGoal,
    deleteGoal
  };
}
