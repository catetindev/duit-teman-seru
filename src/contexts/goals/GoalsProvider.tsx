
import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { toast } from 'sonner';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

import { Goal } from '@/hooks/goals/types';
import { GoalFormData } from '@/components/goals/AddGoalDialog';
import { GoalsContextType, SortBy, SortDirection, FilterBy } from './types';
import { useGoalsState } from './state/useGoalsState';

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const GoalsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isPremium, user } = useAuth();
  const location = useLocation();
  
  // Only fetch goals if we're on the goals page
  const shouldFetchGoals = location.pathname === '/goals';
  
  // Get all state and operations from our modular hooks
  const {
    // State
    loading,
    error,
    goals,
    filteredAndSortedGoals,
    selectedGoal,
    goalCollaborators,
    isSubmitting,
    sortBy,
    sortDirection,
    filterBy,
    isAddDialogOpen,
    isEditDialogOpen,
    isCollaborateDialogOpen,
    isDeleteDialogOpen,
    
    // Actions and operations
    fetchGoals,
    setSelectedGoal,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsCollaborateDialogOpen,
    setIsDeleteDialogOpen,
    setSortBy,
    setSortDirection,
    setFilterBy,
    formatCurrency,
    calculateProgress,
    handleEditGoal,
    handleDeleteGoal,
    confirmDeleteGoal,
    openCollaborationDialog,
    addGoal: handleAddGoal,
    updateGoal: updateGoalHandler,
    handleInviteCollaborator,
    handleRemoveCollaborator
  } = useGoalsState();

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo((): GoalsContextType => ({
    goals,
    loading,
    error,
    selectedGoal,
    isSubmitting,
    sortBy: sortBy as SortBy,
    sortDirection: sortDirection as SortDirection,
    filterBy: filterBy as FilterBy,
    goalCollaborators,
    filteredAndSortedGoals,
    isAddDialogOpen,
    isEditDialogOpen,
    isCollaborateDialogOpen,
    isDeleteDialogOpen,
    fetchGoals,
    setSelectedGoal,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsCollaborateDialogOpen,
    setIsDeleteDialogOpen,
    setSortBy,
    setSortDirection,
    setFilterBy,
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
    selectedGoal,
    isSubmitting,
    sortBy,
    sortDirection,
    filterBy,
    goalCollaborators,
    filteredAndSortedGoals,
    isAddDialogOpen,
    isEditDialogOpen,
    isCollaborateDialogOpen,
    isDeleteDialogOpen,
    fetchGoals,
    setSelectedGoal,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsCollaborateDialogOpen,
    setIsDeleteDialogOpen,
    setSortBy,
    setSortDirection,
    setFilterBy,
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
