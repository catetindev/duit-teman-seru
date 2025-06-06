
import { useCallback } from 'react';
import { Goal } from '@/hooks/goals/types';
import { GoalFormData } from '@/components/goals/AddGoalDialog';
import { supabase } from '@/integrations/supabase/client';
import { GoalOperationsDependencies, GoalOperations } from './types/operationTypes';
import { toast } from 'sonner';

export const useGoalOperations = (dependencies: GoalOperationsDependencies): GoalOperations => {
  // Extract dependencies with default values for safety
  const {
    selectedGoal = null,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setSelectedGoal,
    setGoalToDelete,
    setIsCollaborateDialogOpen,
    setGoalCollaborators,
    fetchGoals,
    deleteGoal,
    fetchCollaborators,
    addCollaborator,
    removeCollaborator,
    setIsSubmitting,
    toast: customToast = toast // Use the imported toast as fallback
  } = dependencies || {};

  const handleEditGoal = useCallback((goal: Goal) => {
    setSelectedGoal(goal);
    setIsEditDialogOpen(true);
  }, [setSelectedGoal, setIsEditDialogOpen]);
  
  const handleDeleteGoal = useCallback((id: string) => {
    setGoalToDelete(id);
    setIsDeleteDialogOpen(true);
  }, [setGoalToDelete, setIsDeleteDialogOpen]);

  const confirmDeleteGoal = useCallback(async () => {
    const goalToDeleteId = selectedGoal?.id || null;
    if (!goalToDeleteId) return;
    
    setIsSubmitting(true);
    try {
      console.log('Deleting goal with ID:', goalToDeleteId);
      await deleteGoal(goalToDeleteId);
      toast("Goal has been deleted successfully");
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      toast(error.message || "Failed to delete goal");
    } finally {
      setIsSubmitting(false);
      setGoalToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  }, [selectedGoal, deleteGoal, setGoalToDelete, setIsDeleteDialogOpen, setIsSubmitting]);

  const openCollaborationDialog = useCallback(async (goal: Goal) => {
    setSelectedGoal(goal);
    setIsCollaborateDialogOpen(true);
    
    try {
      const collaborators = await fetchCollaborators(goal.id);
      setGoalCollaborators(collaborators);
    } catch (error) {
      console.error("Failed to fetch collaborators:", error);
      toast("Failed to load collaborators");
    }
  }, [setSelectedGoal, setIsCollaborateDialogOpen, fetchCollaborators, setGoalCollaborators]);

  const updateGoalHandler = useCallback(async (goalData: GoalFormData) => {
    if (!selectedGoal) return;
    setIsSubmitting(true);
    
    try {
      // Ensure all values are properly converted to their expected types
      const updatedGoalData = {
        title: goalData.title,
        target_amount: parseFloat(String(goalData.target_amount)),
        saved_amount: goalData.saved_amount ? parseFloat(String(goalData.saved_amount)) : 0,
        target_date: goalData.target_date ? (goalData.target_date instanceof Date ? 
          goalData.target_date.toISOString().split('T')[0] : 
          String(goalData.target_date)) : null,
        emoji: goalData.emoji || '🎯'
      };
      
      console.log('Updating goal with data:', updatedGoalData);
      
      const { error } = await supabase
        .from('savings_goals')
        .update(updatedGoalData)
        .eq('id', selectedGoal.id);
      
      if (error) throw error;
      
      toast("Goal has been updated successfully.");
      
      setIsEditDialogOpen(false);
      await fetchGoals();
      
    } catch (error: any) {
      console.error('Error updating goal:', error);
      toast(error.message || "Failed to update goal");
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedGoal, setIsSubmitting, setIsEditDialogOpen, fetchGoals]);

  const handleInviteCollaborator = useCallback(async (email: string) => {
    if (!selectedGoal) return;
    setIsSubmitting(true);
    
    try {
      // Changed to use inviteCollaborator instead of addCollaborator
      const success = await addCollaborator(selectedGoal.id, email);
      
      if (success) {
        toast(`Invitation sent to ${email}`);
        
        // Refresh collaborators list
        const collaborators = await fetchCollaborators(selectedGoal.id);
        setGoalCollaborators(collaborators);
      }
    } catch (error: any) {
      console.error('Error inviting collaborator:', error);
      toast(error.message || "Failed to invite collaborator");
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedGoal, setIsSubmitting, addCollaborator, fetchCollaborators, setGoalCollaborators]);

  const handleRemoveCollaborator = useCallback(async (userId: string) => {
    if (!selectedGoal) return;
    setIsSubmitting(true);
    
    try {
      const success = await removeCollaborator(selectedGoal.id, userId);
      
      if (success) {
        toast("Collaborator has been removed");
        
        // Use functional update to filter out the removed collaborator
        setGoalCollaborators((prev) => prev.filter(c => c.user_id !== userId));
      }
    } catch (error: any) {
      console.error('Error removing collaborator:', error);
      toast(error.message || "Failed to remove collaborator");
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedGoal, setIsSubmitting, removeCollaborator, setGoalCollaborators]);

  return {
    handleEditGoal,
    handleDeleteGoal,
    confirmDeleteGoal,
    openCollaborationDialog,
    updateGoalHandler,
    handleInviteCollaborator,
    handleRemoveCollaborator
  };
};
