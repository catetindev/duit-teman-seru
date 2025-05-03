
import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { Goal, Collaborator } from '@/hooks/goals/types';
import { useGoals } from '@/hooks/goals/useGoals'; // Fixed import path
import { useAuth } from '@/contexts/AuthContext';
import { GoalFormData } from '@/components/goals/AddGoalDialog';
import { useToast } from '@/hooks/use-toast';
import { GoalsContextType, FilterOption, SortDirection, SortOption } from './types';
import { filterAndSortGoals } from './goalsUtils';
import { useGoalOperations } from './goalOperations';
import { useLocation } from 'react-router-dom';

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const GoalsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isPremium, user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  
  // Only fetch goals if we're on the goals page
  const shouldFetchGoals = location.pathname === '/goals';
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCollaborateDialogOpen, setIsCollaborateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // Goal states
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [goalCollaborators, setGoalCollaborators] = useState<Collaborator[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  
  // Sort and filter states
  const [sortBy, setSortBy] = useState<SortOption>('progress');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  
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

  // Fix: Use stable dependencies in useMemo to prevent infinite re-renders
  const filteredAndSortedGoals = useMemo(() => {
    return filterAndSortGoals(goals || [], filterBy, sortBy, sortDirection, calculateProgress);
  }, [goals, filterBy, sortBy, sortDirection, calculateProgress]);
  
  // Pass the correct dependencies to useGoalOperations
  const {
    handleEditGoal,
    handleDeleteGoal,
    confirmDeleteGoal,
    openCollaborationDialog,
    updateGoalHandler,
    handleInviteCollaborator,
    handleRemoveCollaborator
  } = useGoalOperations(
    selectedGoal,
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
    setIsSubmitting
  );

  // Fix: Properly memoize handleAddGoal to prevent it from causing re-renders
  const handleAddGoal = useCallback(async (goalData: GoalFormData) => {
    setIsSubmitting(true);
    
    try {
      if (!user?.id) {
        throw new Error("You must be logged in to add a goal");
      }
      
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
        
        setIsAddDialogOpen(false);
        // Refresh goals list
        await fetchGoals();
      }
      
    } catch (error: any) {
      console.error('Error adding goal:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add goal",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [user, addGoal, toast, fetchGoals]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    goals,
    loading,
    error,
    selectedGoal,
    goalToDelete,
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
    setGoalToDelete,
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
    goalToDelete,
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
