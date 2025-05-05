
import { useState, useEffect, useReducer, useCallback } from 'react';
import { Goal, Collaborator } from '@/hooks/goals/types';
import { SortBy, SortDirection, FilterBy } from '../types';
import { useGoalOperations } from './useGoalOperations';
import { useGoalsQuery } from './useGoalsQuery';
import { useCollaboratorOperations } from './useCollaboratorOperations';
import { goalReducer } from './goalReducer';
import { GoalsState } from './types';

// Define initial state
const initialState: GoalsState = {
  loading: true,
  error: null,
  goals: [],
  filteredGoals: [],
  isAddDialogOpen: false,
  isEditDialogOpen: false,
  isCollaborateDialogOpen: false,
  isDeleteDialogOpen: false,
  selectedGoal: null,
  goalCollaborators: [],
  isSubmitting: false,
  sortBy: 'target_date',
  sortDirection: 'asc',
  filterBy: 'all'
};

// Define a custom hook to manage goals state
export function useGoalsState() {
  const [state, dispatch] = useReducer(goalReducer, initialState);
  const { goals, loading, error, fetchGoals, setGoals } = useGoalsQuery();
  const { isSubmitting, setIsSubmitting, formatCurrency, calculateProgress, addGoal, updateGoal, deleteGoal } = useGoalOperations();
  const { fetchCollaborators, inviteCollaborator, removeCollaborator } = useCollaboratorOperations();

  // Set loading state
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, [loading]);

  // Set error state
  useEffect(() => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, [error]);

  // Set goals state
  useEffect(() => {
    dispatch({ type: 'SET_GOALS', payload: goals });
    applyFilters(goals, state.filterBy);
  }, [goals]);

  // Function to filter goals
  const applyFilters = useCallback((goalsToFilter: Goal[], filterBy: FilterBy) => {
    let filtered;
    if (filterBy === 'all') {
      filtered = goalsToFilter;
    } else if (filterBy === 'collaborative') {
      filtered = goalsToFilter.filter((goal) => goal.has_collaborators);
    } else {
      filtered = goalsToFilter.filter((goal) => !goal.has_collaborators);
    }
    dispatch({ type: 'SET_FILTERED_GOALS', payload: filtered });
  }, []);

  // Watch for filter changes
  useEffect(() => {
    applyFilters(state.goals, state.filterBy);
  }, [state.filterBy, state.goals, applyFilters]);

  // Function to sort goals
  const sortGoals = useCallback((goalsToSort: Goal[]) => {
    return [...goalsToSort].sort((a, b) => {
      const aValue = a[state.sortBy as keyof Goal];
      const bValue = b[state.sortBy as keyof Goal];

      if (aValue < bValue) {
        return state.sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return state.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [state.sortBy, state.sortDirection]);

  // Get filtered and sorted goals
  const filteredAndSortedGoals = sortGoals(state.filteredGoals);

  // Create action dispatchers
  const setSelectedGoal = useCallback((goal: Goal | null) => {
    dispatch({ type: 'SET_SELECTED_GOAL', payload: goal });
  }, []);

  const setIsAddDialogOpen = useCallback((isOpen: boolean) => {
    dispatch({ type: 'SET_ADD_DIALOG_OPEN', payload: isOpen });
  }, []);

  const setIsEditDialogOpen = useCallback((isOpen: boolean) => {
    dispatch({ type: 'SET_EDIT_DIALOG_OPEN', payload: isOpen });
  }, []);

  const setIsCollaborateDialogOpen = useCallback((isOpen: boolean) => {
    dispatch({ type: 'SET_COLLABORATE_DIALOG_OPEN', payload: isOpen });
  }, []);

  const setIsDeleteDialogOpen = useCallback((isOpen: boolean) => {
    dispatch({ type: 'SET_DELETE_DIALOG_OPEN', payload: isOpen });
  }, []);

  const setGoalCollaborators = useCallback((collaborators: Collaborator[] | ((prev: Collaborator[]) => Collaborator[])) => {
    if (typeof collaborators === 'function') {
      dispatch({ 
        type: 'SET_GOAL_COLLABORATORS', 
        payload: collaborators(state.goalCollaborators) 
      });
    } else {
      dispatch({ type: 'SET_GOAL_COLLABORATORS', payload: collaborators });
    }
  }, [state.goalCollaborators]);

  const setSortBy = useCallback((sortBy: SortBy) => {
    dispatch({ type: 'SET_SORT_BY', payload: sortBy });
  }, []);

  const setSortDirection = useCallback((direction: SortDirection) => {
    dispatch({ type: 'SET_SORT_DIRECTION', payload: direction });
  }, []);

  const setFilterBy = useCallback((filter: FilterBy) => {
    dispatch({ type: 'SET_FILTER_BY', payload: filter });
  }, []);

  // Function to handle adding a new goal
  const handleAddGoal = async (values: any) => {
    const newGoal = await addGoal({ 
      ...values, 
      has_collaborators: false 
    });
    if (newGoal) {
      setGoals([...state.goals, newGoal]);
    }
    setIsAddDialogOpen(false);
  };

  // Function to handle updating a goal
  const updateGoalHandler = async (values: any) => {
    if (state.selectedGoal) {
      const updatedGoal = await updateGoal(state.selectedGoal.id, { 
        ...values, 
        has_collaborators: state.selectedGoal.has_collaborators 
      });
      if (updatedGoal) {
        setGoals(state.goals.map(g => g.id === updatedGoal.id ? updatedGoal : g));
      }
      setIsEditDialogOpen(false);
    }
  };

  // Function to handle opening the edit dialog
  const handleEditGoal = useCallback((goal: Goal) => {
    setSelectedGoal(goal);
    setIsEditDialogOpen(true);
  }, [setSelectedGoal, setIsEditDialogOpen]);

  // Function to handle opening the collaboration dialog
  const openCollaborationDialog = useCallback(async (goal: Goal) => {
    setSelectedGoal(goal);
    setIsCollaborateDialogOpen(true);
    
    try {
      const collaborators = await fetchCollaborators(goal.id);
      setGoalCollaborators(collaborators);
    } catch (error) {
      console.error("Failed to fetch collaborators:", error);
      // toast("Failed to load collaborators");
    }
  }, [setSelectedGoal, setIsCollaborateDialogOpen, fetchCollaborators, setGoalCollaborators]);

  // Function to handle deleting a goal
  const handleDeleteGoal = useCallback(async (goalId: string) => {
    const success = await deleteGoal(goalId);
    if (success) {
      setGoals(state.goals.filter((goal) => goal.id !== goalId));
    }
  }, [deleteGoal, state.goals, setGoals]);

  // Async confirmDeleteGoal for compatibility
  const confirmDeleteGoal = useCallback(async () => {
    if (state.selectedGoal) {
      await handleDeleteGoal(state.selectedGoal.id);
      setIsDeleteDialogOpen(false);
      setSelectedGoal(null);
    }
  }, [state.selectedGoal, handleDeleteGoal, setIsDeleteDialogOpen, setSelectedGoal]);

  // Function to handle inviting a collaborator
  const handleInviteCollaborator = useCallback(async (email: string) => {
    if (!state.selectedGoal) return;
    
    setIsSubmitting(true);
    try {
      const success = await inviteCollaborator(state.selectedGoal.id, email);
      if (success) {
        // Refresh collaborators list
        const collaborators = await fetchCollaborators(state.selectedGoal.id);
        setGoalCollaborators(collaborators);
        
        // Update goal has_collaborators flag in the goals list
        const updatedGoals = state.goals.map(g => 
          g.id === state.selectedGoal?.id 
            ? { ...g, has_collaborators: true } 
            : g
        );
        setGoals(updatedGoals);
      }
    } catch (error) {
      console.error('Error inviting collaborator:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [state.selectedGoal, state.goals, inviteCollaborator, fetchCollaborators, setGoalCollaborators, setGoals, setIsSubmitting]);

  // Function to handle removing a collaborator
  const handleRemoveCollaborator = useCallback(async (userId: string) => {
    if (!state.selectedGoal) return;
    
    setIsSubmitting(true);
    try {
      const success = await removeCollaborator(state.selectedGoal.id, userId);
      if (success) {
        // Use functional update to filter out the removed collaborator
        setGoalCollaborators((prev) => prev.filter(c => c.user_id !== userId));
        
        // Check if this was the last collaborator
        const updatedCollaborators = state.goalCollaborators.filter(c => c.user_id !== userId);
        if (updatedCollaborators.length === 0) {
          // Update goal has_collaborators flag in the goals list
          const updatedGoals = state.goals.map(g => 
            g.id === state.selectedGoal?.id 
              ? { ...g, has_collaborators: false } 
              : g
          );
          setGoals(updatedGoals);
        }
      }
    } catch (error) {
      console.error('Error removing collaborator:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [state.selectedGoal, state.goals, state.goalCollaborators, removeCollaborator, setGoalCollaborators, setGoals, setIsSubmitting]);

  return {
    ...state,
    filteredAndSortedGoals,
    setGoals,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsCollaborateDialogOpen,
    setIsDeleteDialogOpen,
    setSelectedGoal,
    setGoalCollaborators,
    setIsSubmitting,
    setSortBy,
    setSortDirection,
    setFilterBy,
    fetchGoals,
    formatCurrency,
    calculateProgress,
    handleEditGoal,
    handleDeleteGoal,
    openCollaborationDialog,
    addGoal,
    updateGoal,
    handleInviteCollaborator,
    handleRemoveCollaborator,
    confirmDeleteGoal,
    handleAddGoal,
    updateGoalHandler
  };
}
