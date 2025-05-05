
import React, { createContext, useContext, ReactNode, useMemo, useCallback } from 'react';
import { Goal } from '@/hooks/goals/types';
import { useGoals } from '@/hooks/goals/useGoals';
import { useAuth } from '@/contexts/AuthContext';
import { GoalFormData } from '@/components/goals/AddGoalDialog';
import { toast } from 'sonner';
import { GoalsContextType, SortBy, SortDirection, FilterBy } from './types';
import { filterAndSortGoals } from './goalsUtils';
import { useGoalOperations } from './goalOperations';
import { useLocation } from 'react-router-dom';
import { useGoalsState } from './useGoalsState';

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const GoalsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isPremium, user } = useAuth();
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
    formatCurrency
  } = useGoals(user?.id, shouldFetchGoals);

  // Define calculateProgress here to ensure it takes a Goal object
  const calculateProgress = useCallback((goal: Goal) => {
    const progress = Math.min(Math.round((goal.saved_amount / goal.target_amount) * 100), 100);
    return progress;
  }, []);

  // Memoize the filtered goals to prevent render loops
  const filteredAndSortedGoals = useMemo(() => {
    return filterAndSortGoals(goals || [], state.filterBy as FilterBy, state.sortBy as SortBy, state.sortDirection as SortDirection, calculateProgress);
  }, [goals, state.filterBy, state.sortBy, state.sortDirection, calculateProgress]);
  
  // Create a dummy function for setGoalToDelete to satisfy the dependency
  const setGoalToDelete = useCallback((goalId: string | null) => {
    if (goalId) {
      const goalToDelete = goals.find(g => g.id === goalId);
      if (goalToDelete) {
        state.setSelectedGoal(goalToDelete);
      }
    } else {
      state.setSelectedGoal(null);
    }
  }, [goals, state]);
  
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
    setGoalToDelete,
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
      toast("You must be logged in to add a goal");
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
        currency: 'IDR' as const,
        has_collaborators: false
      };
      
      const newGoal = await addGoal(goalToAdd);
      
      if (newGoal) {
        toast("Savings goal has been added.");
        
        state.setIsAddDialogOpen(false);
      }
      
    } catch (error: any) {
      console.error('Error adding goal:', error);
      toast(error.message || "Failed to add goal");
    } finally {
      state.setIsSubmitting(false);
    }
  }, [user, addGoal, state]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo((): GoalsContextType => ({
    goals,
    loading,
    error,
    selectedGoal: state.selectedGoal,
    isSubmitting: state.isSubmitting,
    sortBy: state.sortBy as SortBy,
    sortDirection: state.sortDirection as SortDirection,
    filterBy: state.filterBy as FilterBy,
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
