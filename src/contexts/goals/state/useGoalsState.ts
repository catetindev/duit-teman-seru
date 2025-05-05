
import { useState, useEffect, useReducer, useCallback } from 'react';
import { Goal, Collaborator } from '@/hooks/goals/types';
import { SortBy, SortDirection, FilterBy } from '../types';
import { goalReducer } from './goalReducer';
import { GoalsState } from './types';
import { useGoalsQuery } from './useGoalsQuery';
import { useGoalsFiltering } from './useGoalsFiltering';
import { useGoalsOperations } from './useGoalsOperations';
import { useGoalsCollaborationOperations } from './useGoalsCollaborationOperations';

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
  const { applyFilters, sortGoals } = useGoalsFiltering();
  const { 
    setIsSubmitting, 
    formatCurrency, 
    calculateProgress, 
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
    const filtered = applyFilters(goals, state.filterBy);
    dispatch({ type: 'SET_FILTERED_GOALS', payload: filtered });
  }, [goals, applyFilters, state.filterBy]);

  // Watch for filter changes
  useEffect(() => {
    const filtered = applyFilters(state.goals, state.filterBy);
    dispatch({ type: 'SET_FILTERED_GOALS', payload: filtered });
  }, [state.filterBy, state.goals, applyFilters]);

  // Get filtered and sorted goals
  const filteredAndSortedGoals = sortGoals(state.filteredGoals, state.sortBy, state.sortDirection);

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

  // Wrap the extracted operations with state context
  const handleAddGoalWithState = useCallback(async (values: any) => {
    await handleAddGoal(values, state.goals, setGoals, () => setIsAddDialogOpen(false));
  }, [handleAddGoal, state.goals, setGoals, setIsAddDialogOpen]);

  const updateGoalHandlerWithState = useCallback(async (values: any) => {
    await updateGoalHandler(values, state.selectedGoal, state.goals, setGoals, () => setIsEditDialogOpen(false));
  }, [updateGoalHandler, state.selectedGoal, state.goals, setGoals, setIsEditDialogOpen]);

  const handleEditGoalWithState = useCallback((goal: Goal) => {
    handleEditGoal(goal, setSelectedGoal, setIsEditDialogOpen);
  }, [handleEditGoal, setSelectedGoal, setIsEditDialogOpen]);

  const handleDeleteGoalWithState = useCallback(async (goalId: string) => {
    await handleDeleteGoal(goalId, state.goals, setGoals);
  }, [handleDeleteGoal, state.goals, setGoals]);

  const confirmDeleteGoalWithState = useCallback(async () => {
    await confirmDeleteGoal(state.selectedGoal, state.goals, setGoals, setIsDeleteDialogOpen, setSelectedGoal);
  }, [confirmDeleteGoal, state.selectedGoal, state.goals, setGoals, setIsDeleteDialogOpen, setSelectedGoal]);

  const openCollaborationDialogWithState = useCallback(async (goal: Goal) => {
    await openCollaborationDialog(goal, setSelectedGoal, setIsCollaborateDialogOpen, setGoalCollaborators);
  }, [openCollaborationDialog, setSelectedGoal, setIsCollaborateDialogOpen, setGoalCollaborators]);

  const handleInviteCollaboratorWithState = useCallback(async (email: string) => {
    await handleInviteCollaborator(
      email, 
      state.selectedGoal, 
      state.goals, 
      setGoals, 
      state.goalCollaborators, 
      setGoalCollaborators,
      setIsSubmitting
    );
  }, [
    handleInviteCollaborator, 
    state.selectedGoal, 
    state.goals, 
    setGoals, 
    state.goalCollaborators, 
    setGoalCollaborators,
    setIsSubmitting
  ]);

  const handleRemoveCollaboratorWithState = useCallback(async (userId: string) => {
    await handleRemoveCollaborator(
      userId, 
      state.selectedGoal, 
      state.goals, 
      setGoals, 
      state.goalCollaborators, 
      setGoalCollaborators,
      setIsSubmitting
    );
  }, [
    handleRemoveCollaborator, 
    state.selectedGoal, 
    state.goals, 
    setGoals, 
    state.goalCollaborators, 
    setGoalCollaborators,
    setIsSubmitting
  ]);

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
    handleEditGoal: handleEditGoalWithState,
    handleDeleteGoal: handleDeleteGoalWithState,
    openCollaborationDialog: openCollaborationDialogWithState,
    addGoal: handleAddGoal,
    updateGoal: updateGoalHandler,
    handleInviteCollaborator: handleInviteCollaboratorWithState,
    handleRemoveCollaborator: handleRemoveCollaboratorWithState,
    confirmDeleteGoal: confirmDeleteGoalWithState,
    handleAddGoal: handleAddGoalWithState,
    updateGoalHandler: updateGoalHandlerWithState
  };
}
