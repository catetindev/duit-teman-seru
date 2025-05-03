
import { supabase } from '@/integrations/supabase/client';
import { Goal } from './types';

export function useGoalApi() {
  const fetchGoals = async (userId: string): Promise<Goal[]> => {
    try {
      if (!userId) {
        throw new Error('User ID is required to fetch goals');
      }
      
      // Fetch both owned goals and collaborated goals
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .or(`user_id.eq.${userId}`);
      
      if (error) throw error;
      
      return data as Goal[];
    } catch (error) {
      console.error('Error in fetchGoals:', error);
      throw error;
    }
  };

  const addGoal = async (goal: Omit<Goal, 'id'>): Promise<Goal> => {
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .insert(goal)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error in addGoal:', error);
      throw error;
    }
  };

  const updateGoal = async (id: string, goal: Partial<Omit<Goal, 'id'>>): Promise<Goal> => {
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .update(goal)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error in updateGoal:', error);
      throw error;
    }
  };

  const deleteGoal = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('savings_goals')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
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
