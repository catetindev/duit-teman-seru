
import { useCallback } from 'react';
import { Goal } from '@/hooks/goals/types';
import { useGoalOperations } from './useGoalOperations';

export function useGoalsOperations() {
  const { formatCurrency, calculateProgress, addGoal, updateGoal, deleteGoal, setIsSubmitting } = useGoalOperations();

  // Function to handle adding a new goal
  const handleAddGoal = useCallback(async (values: any, goals: Goal[], setGoals: (goals: Goal[]) => void, closeDialog: () => void) => {
    const newGoal = await addGoal({ 
      ...values
    });
    if (newGoal) {
      setGoals([...goals, newGoal]);
    }
    closeDialog();
  }, [addGoal]);

  // Function to handle updating a goal
  const updateGoalHandler = useCallback(async (values: any, selectedGoal: Goal | null, goals: Goal[], setGoals: (goals: Goal[]) => void, closeDialog: () => void) => {
    if (selectedGoal) {
      const updatedGoal = await updateGoal(selectedGoal.id, values);
      if (updatedGoal) {
        setGoals(goals.map(g => g.id === updatedGoal.id ? updatedGoal : g));
      }
      closeDialog();
    }
  }, [updateGoal]);

  // Function to handle opening the edit dialog
  const handleEditGoal = useCallback((goal: Goal, setSelectedGoal: (goal: Goal | null) => void, setIsEditDialogOpen: (isOpen: boolean) => void) => {
    setSelectedGoal(goal);
    setIsEditDialogOpen(true);
  }, []);

  // Function to handle deleting a goal
  const handleDeleteGoal = useCallback(async (goalId: string, goals: Goal[], setGoals: (goals: Goal[]) => void) => {
    const success = await deleteGoal(goalId);
    if (success) {
      setGoals(goals.filter((goal) => goal.id !== goalId));
    }
  }, [deleteGoal]);

  // Function to confirm delete goal
  const confirmDeleteGoal = useCallback(async (selectedGoal: Goal | null, goals: Goal[], setGoals: (goals: Goal[]) => void, setIsDeleteDialogOpen: (isOpen: boolean) => void, setSelectedGoal: (goal: Goal | null) => void) => {
    if (selectedGoal) {
      await handleDeleteGoal(selectedGoal.id, goals, setGoals);
      setIsDeleteDialogOpen(false);
      setSelectedGoal(null);
    }
  }, [handleDeleteGoal]);

  return {
    setIsSubmitting,
    formatCurrency,
    calculateProgress,
    handleAddGoal,
    updateGoalHandler,
    handleEditGoal,
    handleDeleteGoal,
    confirmDeleteGoal
  };
}
