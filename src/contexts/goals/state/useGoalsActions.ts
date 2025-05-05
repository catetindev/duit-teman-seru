
import { useCallback } from 'react';
import { Goal, Collaborator } from '@/hooks/goals/types';
import { useGoalOperations } from './useGoalOperations';
import { useGoalsCollaborationOperations } from './useGoalsCollaborationOperations';
import { useGoalsOperations } from './useGoalsOperations';

// Define props interface for the hook
interface UseGoalsActionsProps {
  goals: Goal[];
  selectedGoal: Goal | null;
  goalCollaborators: Collaborator[];
  setGoals: (goals: Goal[]) => void;
  setSelectedGoal: (goal: Goal | null) => void;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  setIsCollaborateDialogOpen: (isOpen: boolean) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  setGoalCollaborators: (collaborators: Collaborator[] | ((prev: Collaborator[]) => Collaborator[])) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  fetchGoals: () => Promise<void>;
}

export function useGoalsActions(props: UseGoalsActionsProps) {
  const { 
    goals, 
    selectedGoal, 
    goalCollaborators,
    setGoals,
    setSelectedGoal,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsCollaborateDialogOpen,
    setIsDeleteDialogOpen,
    setGoalCollaborators,
    setIsSubmitting,
    fetchGoals
  } = props;

  // Get utility functions from individual hooks
  const { formatCurrency, calculateProgress } = useGoalOperations();
  const { 
    handleAddGoal,
    updateGoalHandler,
    handleEditGoal,
    handleDeleteGoal,
    confirmDeleteGoal
  } = useGoalsOperations();
  
  const { 
    openCollaborationDialog, 
    handleInviteCollaborator, 
    handleRemoveCollaborator 
  } = useGoalsCollaborationOperations();

  // Wrap the extracted operations with state context
  const handleAddGoalWithState = useCallback(async (values: any) => {
    await handleAddGoal(values, goals, setGoals, () => setIsAddDialogOpen(false));
  }, [handleAddGoal, goals, setGoals, setIsAddDialogOpen]);

  const updateGoalHandlerWithState = useCallback(async (values: any) => {
    await updateGoalHandler(values, selectedGoal, goals, setGoals, () => setIsEditDialogOpen(false));
  }, [updateGoalHandler, selectedGoal, goals, setGoals, setIsEditDialogOpen]);

  const handleEditGoalWithState = useCallback((goal: Goal) => {
    handleEditGoal(goal, setSelectedGoal, setIsEditDialogOpen);
  }, [handleEditGoal, setSelectedGoal, setIsEditDialogOpen]);

  const handleDeleteGoalWithState = useCallback(async (goalId: string) => {
    await handleDeleteGoal(goalId, goals, setGoals);
  }, [handleDeleteGoal, goals, setGoals]);

  const confirmDeleteGoalWithState = useCallback(async () => {
    await confirmDeleteGoal(selectedGoal, goals, setGoals, setIsDeleteDialogOpen, setSelectedGoal);
  }, [confirmDeleteGoal, selectedGoal, goals, setGoals, setIsDeleteDialogOpen, setSelectedGoal]);

  const openCollaborationDialogWithState = useCallback(async (goal: Goal) => {
    await openCollaborationDialog(goal, setSelectedGoal, setIsCollaborateDialogOpen, setGoalCollaborators);
  }, [openCollaborationDialog, setSelectedGoal, setIsCollaborateDialogOpen, setGoalCollaborators]);

  const handleInviteCollaboratorWithState = useCallback(async (email: string) => {
    await handleInviteCollaborator(
      email, 
      selectedGoal, 
      goals, 
      setGoals, 
      goalCollaborators, 
      setGoalCollaborators,
      setIsSubmitting
    );
  }, [
    handleInviteCollaborator, 
    selectedGoal, 
    goals, 
    setGoals, 
    goalCollaborators, 
    setGoalCollaborators,
    setIsSubmitting
  ]);

  const handleRemoveCollaboratorWithState = useCallback(async (userId: string) => {
    await handleRemoveCollaborator(
      userId, 
      selectedGoal, 
      goals, 
      setGoals, 
      goalCollaborators, 
      setGoalCollaborators,
      setIsSubmitting
    );
  }, [
    handleRemoveCollaborator, 
    selectedGoal, 
    goals, 
    setGoals, 
    goalCollaborators, 
    setGoalCollaborators,
    setIsSubmitting
  ]);

  return {
    formatCurrency,
    calculateProgress,
    handleEditGoal: handleEditGoalWithState,
    handleDeleteGoal: handleDeleteGoalWithState,
    openCollaborationDialog: openCollaborationDialogWithState,
    addGoal: handleAddGoalWithState,
    updateGoal: updateGoalHandlerWithState,
    handleInviteCollaborator: handleInviteCollaboratorWithState,
    handleRemoveCollaborator: handleRemoveCollaboratorWithState,
    confirmDeleteGoal: confirmDeleteGoalWithState
  };
}
