
import { Goal, Collaborator } from '@/hooks/goals/types';
import { GoalFormData } from '@/components/goals/AddGoalDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useGoalOperations = (
  selectedGoal: Goal | null, 
  setIsEditDialogOpen: (isOpen: boolean) => void,
  setIsDeleteDialogOpen: (isOpen: boolean) => void,
  setSelectedGoal: (goal: Goal | null) => void,
  setGoalToDelete: (goalId: string | null) => void,
  setIsCollaborateDialogOpen: (isOpen: boolean) => void,
  setGoalCollaborators: (collaborators: Collaborator[]) => void,
  fetchGoals: () => Promise<void>,
  deleteGoal: (goalId: string) => Promise<void>,
  fetchCollaborators: (goalId: string) => Promise<Collaborator[]>,
  addCollaborator: (goalId: string, email: string) => Promise<boolean>,
  removeCollaborator: (goalId: string, userId: string) => Promise<boolean>,
  setIsSubmitting: (isSubmitting: boolean) => void
) => {
  const { toast } = useToast();

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteGoal = (id: string) => {
    setGoalToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteGoal = async () => {
    const goalToDeleteId = selectedGoal?.id || null;
    if (goalToDeleteId) {
      await deleteGoal(goalToDeleteId);
      setGoalToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openCollaborationDialog = async (goal: Goal) => {
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
  };

  const updateGoalHandler = async (goalData: GoalFormData) => {
    if (!selectedGoal) return;
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('savings_goals')
        .update({
          title: goalData.title,
          target_amount: parseFloat(goalData.target_amount),
          saved_amount: parseFloat(goalData.saved_amount || '0'),
          target_date: goalData.target_date || null,
          emoji: goalData.emoji
        })
        .eq('id', selectedGoal.id);
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Goal has been updated successfully.",
      });
      
      setIsEditDialogOpen(false);
      fetchGoals();
      
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
  };

  const handleInviteCollaborator = async (email: string) => {
    if (!selectedGoal) return;
    setIsSubmitting(true);
    
    try {
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
  };

  const handleRemoveCollaborator = async (userId: string) => {
    if (!selectedGoal) return;
    setIsSubmitting(true);
    
    try {
      const success = await removeCollaborator(selectedGoal.id, userId);
      
      if (success) {
        toast({
          title: "Success!",
          description: "Collaborator has been removed",
        });
        
        // Update the collaborators list
        setGoalCollaborators(prev => prev.filter(c => c.user_id !== userId));
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
  };

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
