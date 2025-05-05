
import { useCallback } from 'react';
import { Goal, Collaborator } from '@/hooks/goals/types';
import { SortBy, SortDirection, FilterBy } from '../types';
import { GoalsStateAction } from './types';

export function useGoalStateModifiers(dispatch: React.Dispatch<GoalsStateAction>) {
  const setSelectedGoal = useCallback((goal: Goal | null) => {
    dispatch({ type: 'SET_SELECTED_GOAL', payload: goal });
  }, [dispatch]);

  const setIsAddDialogOpen = useCallback((isOpen: boolean) => {
    dispatch({ type: 'SET_ADD_DIALOG_OPEN', payload: isOpen });
  }, [dispatch]);

  const setIsEditDialogOpen = useCallback((isOpen: boolean) => {
    dispatch({ type: 'SET_EDIT_DIALOG_OPEN', payload: isOpen });
  }, [dispatch]);

  const setIsCollaborateDialogOpen = useCallback((isOpen: boolean) => {
    dispatch({ type: 'SET_COLLABORATE_DIALOG_OPEN', payload: isOpen });
  }, [dispatch]);

  const setIsDeleteDialogOpen = useCallback((isOpen: boolean) => {
    dispatch({ type: 'SET_DELETE_DIALOG_OPEN', payload: isOpen });
  }, [dispatch]);

  const setGoalCollaborators = useCallback((collaborators: Collaborator[] | ((prev: Collaborator[]) => Collaborator[])) => {
    // Pass the function or array directly to the reducer
    dispatch({ type: 'SET_GOAL_COLLABORATORS', payload: collaborators });
  }, [dispatch]);

  const setIsSubmitting = useCallback((isSubmitting: boolean) => {
    dispatch({ type: 'SET_IS_SUBMITTING', payload: isSubmitting });
  }, [dispatch]);

  const setSortBy = useCallback((sortBy: SortBy) => {
    dispatch({ type: 'SET_SORT_BY', payload: sortBy });
  }, [dispatch]);

  const setSortDirection = useCallback((direction: SortDirection) => {
    dispatch({ type: 'SET_SORT_DIRECTION', payload: direction });
  }, [dispatch]);

  const setFilterBy = useCallback((filter: FilterBy) => {
    dispatch({ type: 'SET_FILTER_BY', payload: filter });
  }, [dispatch]);

  return {
    setSelectedGoal,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsCollaborateDialogOpen,
    setIsDeleteDialogOpen,
    setGoalCollaborators,
    setIsSubmitting,
    setSortBy,
    setSortDirection,
    setFilterBy
  };
}
