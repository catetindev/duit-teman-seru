
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { Goal, Collaborator } from '@/hooks/goals/types';
import { GoalFormData } from '@/components/goals/AddGoalDialog';
import { GoalFormValues } from '../types';

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
      
      // Prepare the data correctly for Supabase insert
      const goalData = {
        id: uuidv4(),
        title: values.title,
        target_amount: parseFloat(values.target_amount),
        saved_amount: values.saved_amount ? parseFloat(values.saved_amount) : 0,
        target_date: values.target_date || null,
        currency: values.currency || 'IDR',
        emoji: values.emoji || '🎯',
        user_id: values.user_id
      };
      
      console.log('Adding new goal with data:', goalData);
      
      const { data, error } = await supabase
        .from('savings_goals')
        .insert(goalData)
        .select();

      if (error) {
        console.error('Supabase error when adding goal:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error("No data returned after inserting goal");
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

      console.log('Goal added successfully:', newGoal);
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
  const updateGoal = useCallback(async (goalId: string, values: GoalFormData) => {
    try {
      setIsSubmitting(true);
      console.log('Updating goal with ID:', goalId, 'Values:', values);
      
      const { data, error } = await supabase
        .from('savings_goals')
        .update({
          title: values.title,
          target_amount: parseFloat(values.target_amount),
          saved_amount: values.saved_amount ? parseFloat(values.saved_amount) : 0,
          target_date: values.target_date || null,
          currency: values.currency || 'IDR',
          emoji: values.emoji
        })
        .eq('id', goalId)
        .select();

      if (error) {
        console.error('Supabase error when updating goal:', error);
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error("No data returned after updating goal");
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

      console.log('Goal updated successfully:', updatedGoal);
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
      console.log('Deleting goal with ID:', goalId);
      
      const { error } = await supabase
        .from('savings_goals')
        .delete()
        .eq('id', goalId);

      if (error) {
        console.error('Supabase error when deleting goal:', error);
        throw error;
      }
      
      console.log('Goal deleted successfully');
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
