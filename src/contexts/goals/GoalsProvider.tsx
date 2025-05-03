
import React, { createContext, useContext, ReactNode, useMemo, useCallback, useEffect } from 'react';
import { Goal } from '@/hooks/goals/types';
import { useGoals } from '@/hooks/goals/useGoals';
import { useAuth } from '@/contexts/AuthContext';
import { GoalFormData } from '@/components/goals/AddGoalDialog';
import { useToast } from '@/hooks/use-toast';
import { GoalsContextType } from './types';
import { filterAndSortGoals } from './goalsUtils';
import { useGoalOperations } from './goalOperations';
import { useLocation } from 'react-router-dom';
import { useGoalsState } from './useGoalsState';

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const GoalsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isPremium, user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  
  // Only fetch goals if we're on the goals page
  const shouldFetchGoals = location.pathname === '/goals';
  
  // Get all state from the hook
  const state = useGoalsState();
  
  const { 
    goals, 
    loading, 
    error,
    fetchGoals,
    addGoal,
    deleteGoal, 
    fetchCollaborators, 
    addCollaborator,
    removeCollaborator,
    formatCurrency,
    calculateProgress
  } = useGoals(user?.id, shouldFetchGoals);

  // Memoize the filtered goals to prevent render loops
  const filteredAndSortedGoals = useMemo(() => {
    return filterAndSortGoals(goals || [], state.filterBy, state.sortBy, state.sortDirection, calculateProgress);
  }, [goals, state.filterBy, state.sortBy, state.sortDirection, calculateProgress]);
  
  // Get goal operations
  const {
    handleEditGoal,
    handleDeleteGoal,
    confirmDeleteGoal,
    openCollaborationDialog,
    updateGoalHandler,
    handleInviteCollaborator,
    handleRemoveCollaborator
  } = useGoalOperations({
    selectedGoal: state.selectedGoal,
    setIsEditDialogOpen: state.setIsEditDialogOpen,
    setIsDeleteDialogOpen: state.setIsDeleteDialogOpen,
    setSelectedGoal: state.setSelectedGoal,
    setGoalToDelete: state.setGoalToDelete,
    setIsCollaborateDialogOpen: state.setIsCollaborateDialogOpen,
    setGoalCollaborators: state.setGoalCollaborators,
    fetchGoals,
    deleteGoal,
    fetchCollaborators,
    addCollaborator,
    removeCollaborator,
    setIsSubmitting: state.setIsSubmitting,
    toast
  });

  // Handle adding a goal
  const handleAddGoal = useCallback(async (goalData: GoalFormData) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to add a goal",
        variant: "destructive",
      });
      return;
    }

    state.setIsSubmitting(true);
    
    try {      
      console.log('Adding new goal with data:', goalData);
      
      // Ensure all values are properly converted to their expected types
      const goalToAdd = {
        title: goalData.title,
        target_amount: parseFloat(goalData.target_amount),
        saved_amount: goalData.saved_amount ? parseFloat(goalData.saved_amount) : 0,
        target_date: goalData.target_date || null,
        emoji: goalData.emoji || '🎯',
        user_id: user.id,
        currency: 'IDR' as const
      };
      
      const newGoal = await addGoal(goalToAdd);
      
      if (newGoal) {
        toast({
          title: "Success!",
          description: "Savings goal has been added.",
        });
        
        state.setIsAddDialogOpen(false);
      }
      
    } catch (error: any) {
      console.error('Error adding goal:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add goal",
        variant: "destructive",
      });
    } finally {
      state.setIsSubmitting(false);
    }
  }, [user, addGoal, toast, state]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    goals,
    loading,
    error,
    selectedGoal: state.selectedGoal,
    goalToDelete: state.goalToDelete,
    isSubmitting: state.isSubmitting,
    sortBy: state.sortBy,
    sortDirection: state.sortDirection,
    filterBy: state.filterBy,
    goalCollaborators: state.goalCollaborators,
    filteredAndSortedGoals,
    isAddDialogOpen: state.isAddDialogOpen,
    isEditDialogOpen: state.isEditDialogOpen,
    isCollaborateDialogOpen: state.isCollaborateDialogOpen,
    isDeleteDialogOpen: state.isDeleteDialogOpen,
    fetchGoals,
    setSelectedGoal: state.setSelectedGoal,
    setIsAddDialogOpen: state.setIsAddDialogOpen,
    setIsEditDialogOpen: state.setIsEditDialogOpen,
    setIsCollaborateDialogOpen: state.setIsCollaborateDialogOpen,
    setIsDeleteDialogOpen: state.setIsDeleteDialogOpen,
    setGoalToDelete: state.setGoalToDelete,
    setSortBy: state.setSortBy,
    setSortDirection: state.setSortDirection,
    setFilterBy: state.setFilterBy,
    handleAddGoal,
    handleEditGoal,
    handleDeleteGoal,
    confirmDeleteGoal,
    updateGoalHandler,
    openCollaborationDialog,
    handleInviteCollaborator,
    handleRemoveCollaborator,
    formatCurrency,
    calculateProgress
  }), [
    goals,
    loading,
    error,
    state,
    filteredAndSortedGoals,
    fetchGoals,
    handleAddGoal,
    handleEditGoal,
    handleDeleteGoal,
    confirmDeleteGoal,
    updateGoalHandler,
    openCollaborationDialog,
    handleInviteCollaborator,
    handleRemoveCollaborator,
    formatCurrency,
    calculateProgress
  ]);
  
  return <GoalsContext.Provider value={contextValue}>{children}</GoalsContext.Provider>;
};

export const useGoalsContext = (): GoalsContextType => {
  const context = useContext(GoalsContext);
  if (context === undefined) {
    throw new Error('useGoalsContext must be used within a GoalsProvider');
  }
  return context;
};
