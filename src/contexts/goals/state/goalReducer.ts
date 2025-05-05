
import { GoalsState, GoalsStateAction } from './types';

/**
 * Reducer for managing goals state
 * Handles various actions to update the goals state
 */
export const goalReducer = (state: GoalsState, action: GoalsStateAction): GoalsState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload };
      
    case 'SET_GOALS':
      return { ...state, goals: action.payload };
      
    case 'SET_FILTERED_GOALS':
      return { ...state, filteredGoals: action.payload };
      
    case 'SET_ADD_DIALOG_OPEN':
      return { ...state, isAddDialogOpen: action.payload };
      
    case 'SET_EDIT_DIALOG_OPEN':
      return { ...state, isEditDialogOpen: action.payload };
      
    case 'SET_COLLABORATE_DIALOG_OPEN':
      return { ...state, isCollaborateDialogOpen: action.payload };
      
    case 'SET_DELETE_DIALOG_OPEN':
      return { ...state, isDeleteDialogOpen: action.payload };
      
    case 'SET_SELECTED_GOAL':
      return { ...state, selectedGoal: action.payload };
      
    case 'SET_GOAL_COLLABORATORS':
      // When using a function to update collaborators, use current state
      if (typeof action.payload === 'function') {
        const updatedCollaborators = action.payload(state.goalCollaborators);
        return { ...state, goalCollaborators: updatedCollaborators };
      }
      return { ...state, goalCollaborators: action.payload };
      
    case 'SET_IS_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
      
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
      
    case 'SET_SORT_DIRECTION':
      return { ...state, sortDirection: action.payload };
      
    case 'SET_FILTER_BY':
      return { ...state, filterBy: action.payload };
      
    default:
      return state;
  }
};
