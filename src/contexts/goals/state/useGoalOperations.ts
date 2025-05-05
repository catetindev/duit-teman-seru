
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { Goal, Collaborator } from '@/hooks/goals/types';
import { GoalFormData } from '@/components/goals/AddGoalDialog';

export function useGoalOperations() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Function to format currency
  const formatCurrency = useCallback((amount: number, currency: 'IDR' | 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  }, []);

  // Function to calculate progress
  const calculateProgress = useCallback((goal: Goal) => {
    const progress = Math.min(Math.round((goal.saved_amount / goal.target_amount) * 100), 100);
    return progress;
  }, []);

  // Function to add a new goal
  const addGoal = useCallback(async (values: GoalFormData & { user_id: string }) => {
    try {
      setIsSubmitting(true);
      const { data, error } = await supabase
        .from('savings_goals')
        .insert({
          id: uuidv4(),
          title: values.title,
          target_amount: values.target_amount,
          saved_amount: values.saved_amount || 0,
          target_date: values.target_date || null,
          currency: values.currency,
          emoji: values.emoji || '🎯',
          user_id: values.user_id
        })
        .select();

      if (error) {
        throw error;
      }

      // Convert the inserted data to the Goal type
      const newGoal: Goal = {
        id: data[0].id,
        title: data[0].title,
        target_amount: data[0].target_amount,
        saved_amount: data[0].saved_amount,
        target_date: data[0].target_date,
        currency: data[0].currency as 'IDR' | 'USD',
        user_id: data[0].user_id,
        emoji: data[0].emoji
      };

      toast("Goal added successfully");
      return newGoal;
    } catch (error: any) {
      console.error('Error adding goal:', error);
      toast(error.message || "Failed to add goal");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Function to update an existing goal
  const updateGoal = useCallback(async (goalId: string, values: GoalFormValues) => {
    try {
      setIsSubmitting(true);
      const { data, error } = await supabase
        .from('savings_goals')
        .update({
          title: values.title,
          target_amount: values.target_amount,
          saved_amount: values.saved_amount || 0,
          target_date: values.target_date || null,
          currency: values.currency,
          emoji: values.emoji
        })
        .eq('id', goalId)
        .select();

      if (error) {
        throw error;
      }

      // Convert the updated data to the Goal type
      const updatedGoal: Goal = {
        id: data[0].id,
        title: data[0].title,
        target_amount: data[0].target_amount,
        saved_amount: data[0].saved_amount,
        target_date: data[0].target_date,
        currency: data[0].currency as 'IDR' | 'USD',
        user_id: data[0].user_id,
        emoji: data[0].emoji
      };

      toast("Goal updated successfully");
      return updatedGoal;
    } catch (error: any) {
      console.error('Error updating goal:', error);
      toast(error.message || "Failed to update goal");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Function to delete a goal
  const deleteGoal = useCallback(async (goalId: string) => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('savings_goals')
        .delete()
        .eq('id', goalId);

      if (error) {
        throw error;
      }
      
      toast("Goal deleted successfully");
      return true;
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      toast(error.message || "Failed to delete goal");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    isSubmitting,
    setIsSubmitting,
    formatCurrency,
    calculateProgress,
    addGoal,
    updateGoal,
    deleteGoal
  };
}
