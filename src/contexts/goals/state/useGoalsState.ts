
import { useReducer } from 'react';
import { Goal } from '@/hooks/goals/types';
import { SortBy, SortDirection, FilterBy } from '../types';
import { goalReducer } from './goalReducer';
import { GoalsState } from './types';
import { useGoalsQuery } from './useGoalsQuery';
import { useGoalsFiltering } from './useGoalsFiltering';
import { useGoalsActions } from './useGoalsActions';
import { useGoalStateModifiers } from './useGoalStateModifiers';
import { useEffect } from 'react';

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

/**
 * Custom hook that manages the goals state and related functionality
 */
export function useGoalsState() {
  const [state, dispatch] = useReducer(goalReducer, initialState);
  
  // Get query-related functionality
  const { goals, loading, error, fetchGoals, setGoals } = useGoalsQuery();
  
  // Get filtering and sorting functionality
  const { applyFilters, sortGoals } = useGoalsFiltering();
  
  // Get state modifiers
  const stateModifiers = useGoalStateModifiers(dispatch);
  
  // Get goal operations and actions
  const goalActions = useGoalsActions({
    goals: state.goals,
    selectedGoal: state.selectedGoal,
    goalCollaborators: state.goalCollaborators,
    setGoals,
    fetchGoals,
    ...stateModifiers
  });

  // Update loading state
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, [loading]);

  // Update error state
  useEffect(() => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, [error]);

  // Update goals state
  useEffect(() => {
    dispatch({ type: 'SET_GOALS', payload: goals });
    const filtered = applyFilters(goals, state.filterBy);
    dispatch({ type: 'SET_FILTERED_GOALS', payload: filtered });
  }, [goals, applyFilters, state.filterBy]);

  // Update filtered goals when filter changes
  useEffect(() => {
    const filtered = applyFilters(goals, state.filterBy);
    dispatch({ type: 'SET_FILTERED_GOALS', payload: filtered });
  }, [state.filterBy, goals, applyFilters]);

  // Get filtered and sorted goals
  const filteredAndSortedGoals = sortGoals(state.filteredGoals, state.sortBy, state.sortDirection);

  return {
    ...state,
    filteredAndSortedGoals,
    setGoals,
    fetchGoals,
    ...stateModifiers,
    ...goalActions
  };
}
