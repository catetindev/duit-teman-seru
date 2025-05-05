
import { useCallback } from 'react';
import { Goal, Collaborator } from '@/hooks/goals/types';
import { useCollaboratorOperations } from './useCollaboratorOperations';

export function useGoalsCollaborationOperations() {
  const { fetchCollaborators, inviteCollaborator, removeCollaborator } = useCollaboratorOperations();

  // Function to handle opening the collaboration dialog
  const openCollaborationDialog = useCallback(async (
    goal: Goal,
    setSelectedGoal: (goal: Goal | null) => void,
    setIsCollaborateDialogOpen: (isOpen: boolean) => void,
    setGoalCollaborators: (collaborators: Collaborator[] | ((prev: Collaborator[]) => Collaborator[])) => void
  ) => {
    setSelectedGoal(goal);
    setIsCollaborateDialogOpen(true);
    
    try {
      const collaborators = await fetchCollaborators(goal.id);
      setGoalCollaborators(collaborators);
    } catch (error) {
      console.error("Failed to fetch collaborators:", error);
      // toast("Failed to load collaborators");
    }
  }, [fetchCollaborators]);

  // Function to handle inviting a collaborator
  const handleInviteCollaborator = useCallback(async (
    email: string,
    selectedGoal: Goal | null,
    goals: Goal[],
    setGoals: (goals: Goal[]) => void,
    goalCollaborators: Collaborator[],
    setGoalCollaborators: (collaborators: Collaborator[] | ((prev: Collaborator[]) => Collaborator[])) => void,
    setIsSubmitting: (isSubmitting: boolean) => void
  ) => {
    if (!selectedGoal) return;
    
    setIsSubmitting(true);
    try {
      const success = await inviteCollaborator(selectedGoal.id, email);
      if (success) {
        // Refresh collaborators list
        const collaborators = await fetchCollaborators(selectedGoal.id);
        setGoalCollaborators(collaborators);
      }
    } catch (error) {
      console.error('Error inviting collaborator:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [inviteCollaborator, fetchCollaborators]);

  // Function to handle removing a collaborator
  const handleRemoveCollaborator = useCallback(async (
    userId: string,
    selectedGoal: Goal | null,
    goals: Goal[],
    setGoals: (goals: Goal[]) => void,
    goalCollaborators: Collaborator[],
    setGoalCollaborators: (collaborators: Collaborator[] | ((prev: Collaborator[]) => Collaborator[])) => void,
    setIsSubmitting: (isSubmitting: boolean) => void
  ) => {
    if (!selectedGoal) return;
    
    setIsSubmitting(true);
    try {
      const success = await removeCollaborator(selectedGoal.id, userId);
      if (success) {
        // Use functional update to filter out the removed collaborator
        setGoalCollaborators((prev: Collaborator[]) => prev.filter(c => c.user_id !== userId));
      }
    } catch (error) {
      console.error('Error removing collaborator:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [removeCollaborator]);

  return {
    openCollaborationDialog,
    handleInviteCollaborator,
    handleRemoveCollaborator
  };
}
