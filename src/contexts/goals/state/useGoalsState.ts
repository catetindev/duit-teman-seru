import { useReducer, useCallback } from 'react';
import { Goal } from '@/hooks/goals/types';
import { SortBy, SortDirection, FilterBy } from '../types';
import { goalReducer } from './goalReducer';
import { GoalsState } from './types';
import { useGoalsQuery } from './useGoalsQuery';
import { useGoalsFiltering } from './useGoalsFiltering';
import { useGoalsActions } from './useGoalsActions';
import { useGoalStateModifiers } from './useGoalStateModifiers';

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
  
  // Get state modifiers (setters)
  const stateModifiers = useGoalStateModifiers(dispatch);

  // Get actions that interact with the goals
  const {
    formatCurrency,
    calculateProgress,
    addGoal: handleAddGoal,
    updateGoal: updateGoalHandler,
    handleEditGoal,
    handleDeleteGoal,
    confirmDeleteGoal,
    openCollaborationDialog,
    handleInviteCollaborator,
    handleRemoveCollaborator
  } = useGoalsActions({
    goals: state.goals,
    selectedGoal: state.selectedGoal,
    goalCollaborators: state.goalCollaborators,
    setGoals,
    fetchGoals,
    ...stateModifiers
  });

  // Set loading state
  useGoalsStateEffects({
    loading,
    error,
    goals,
    filterBy: state.filterBy,
    dispatch,
    applyFilters
  });

  // Get filtered and sorted goals
  const filteredAndSortedGoals = sortGoals(state.filteredGoals, state.sortBy, state.sortDirection);

  return {
    ...state,
    filteredAndSortedGoals,
    setGoals,
    ...stateModifiers,
    fetchGoals,
    formatCurrency,
    calculateProgress,
    handleEditGoal,
    handleDeleteGoal,
    openCollaborationDialog,
    addGoal: handleAddGoal,
    updateGoal: updateGoalHandler,
    handleInviteCollaborator,
    handleRemoveCollaborator,
    confirmDeleteGoal,
    handleAddGoal,
    updateGoalHandler
  };
}

// Extract effects to a separate function to keep the main hook clean
function useGoalsStateEffects({ loading, error, goals, filterBy, dispatch, applyFilters }) {
  // Import and use useEffect
  const { useEffect } = require('react');

  // Set loading state
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, [loading, dispatch]);

  // Set error state
  useEffect(() => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, [error, dispatch]);

  // Set goals state
  useEffect(() => {
    dispatch({ type: 'SET_GOALS', payload: goals });
    const filtered = applyFilters(goals, filterBy);
    dispatch({ type: 'SET_FILTERED_GOALS', payload: filtered });
  }, [goals, applyFilters, filterBy, dispatch]);

  // Watch for filter changes
  useEffect(() => {
    const filtered = applyFilters(goals, filterBy);
    dispatch({ type: 'SET_FILTERED_GOALS', payload: filtered });
  }, [filterBy, goals, applyFilters, dispatch]);
}
