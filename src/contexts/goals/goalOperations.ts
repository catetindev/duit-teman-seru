
import { useCallback } from 'react';
import { Goal } from '@/hooks/goals/types';
import { GoalFormData } from '@/components/goals/AddGoalDialog';
import { supabase } from '@/integrations/supabase/client';
import { GoalOperationsDependencies, GoalOperations } from './types/operationTypes';
import { useToast } from '@/hooks/use-toast';

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
    toast = useToast().toast // Use the hook directly as fallback if not provided
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
      toast({
        title: "Success",
        description: "Goal has been deleted successfully",
      });
      
      // Explicitly fetch goals to refresh the UI
      await fetchGoals();
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete goal",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setGoalToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  }, [selectedGoal, deleteGoal, setGoalToDelete, setIsDeleteDialogOpen, setIsSubmitting, toast, fetchGoals]);

  const openCollaborationDialog = useCallback(async (goal: Goal) => {
    setSelectedGoal(goal);
    setIsCollaborateDialogOpen(true);
    
    try {
      const collaborators = await fetchCollaborators(goal.id);
      setGoalCollaborators(collaborators);
    } catch (error) {
      console.error("Failed to fetch collaborators:", error);
      toast({
        title: "Error",
        description: "Failed to load collaborators",
        variant: "destructive"
      });
    }
  }, [setSelectedGoal, setIsCollaborateDialogOpen, fetchCollaborators, setGoalCollaborators, toast]);

  const updateGoalHandler = useCallback(async (goalData: GoalFormData) => {
    if (!selectedGoal) return;
    setIsSubmitting(true);
    
    try {
      // Ensure all values are properly converted to their expected types
      const updatedGoalData = {
        title: goalData.title,
        target_amount: parseFloat(goalData.target_amount),
        saved_amount: goalData.saved_amount ? parseFloat(goalData.saved_amount) : 0,
        target_date: goalData.target_date || null,
        emoji: goalData.emoji || '🎯'
      };
      
      console.log('Updating goal with data:', updatedGoalData);
      
      const { error } = await supabase
        .from('savings_goals')
        .update(updatedGoalData)
        .eq('id', selectedGoal.id);
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Goal has been updated successfully.",
      });
      
      setIsEditDialogOpen(false);
      
      // Explicitly fetch goals to refresh the UI
      await fetchGoals();
    } catch (error: any) {
      console.error('Error updating goal:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update goal",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedGoal, setIsSubmitting, toast, setIsEditDialogOpen, fetchGoals]);

  const handleInviteCollaborator = useCallback(async (email: string) => {
    if (!selectedGoal) return;
    setIsSubmitting(true);
    
    try {
      // Changed to use inviteCollaborator instead of addCollaborator
      const success = await addCollaborator(selectedGoal.id, email);
      
      if (success) {
        toast({
          title: "Success!",
          description: `Invitation sent to ${email}`,
        });
        
        // Refresh collaborators list
        const collaborators = await fetchCollaborators(selectedGoal.id);
        setGoalCollaborators(collaborators);
      }
    } catch (error: any) {
      console.error('Error inviting collaborator:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to invite collaborator",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedGoal, setIsSubmitting, addCollaborator, toast, fetchCollaborators, setGoalCollaborators]);

  const handleRemoveCollaborator = useCallback(async (userId: string) => {
    if (!selectedGoal) return;
    setIsSubmitting(true);
    
    try {
      const success = await removeCollaborator(selectedGoal.id, userId);
      
      if (success) {
        toast({
          title: "Success!",
          description: "Collaborator has been removed",
        });
        
        // Use functional update to filter out the removed collaborator
        setGoalCollaborators((prev) => prev.filter(c => c.user_id !== userId));
      }
    } catch (error: any) {
      console.error('Error removing collaborator:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove collaborator",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [selectedGoal, setIsSubmitting, removeCollaborator, toast, setGoalCollaborators]);

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
