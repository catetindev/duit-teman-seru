
import { Goal, Collaborator } from '@/hooks/goals/types';
import { SortBy, SortDirection, FilterBy } from '../types';

export interface GoalsState {
  loading: boolean;
  error: Error | null;
  goals: Goal[];
  filteredGoals: Goal[];
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isCollaborateDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  selectedGoal: Goal | null;
  goalCollaborators: Collaborator[];
  isSubmitting: boolean;
  sortBy: SortBy;
  sortDirection: SortDirection;
  filterBy: FilterBy;
}

export type GoalsStateAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'SET_GOALS'; payload: Goal[] }
  | { type: 'SET_FILTERED_GOALS'; payload: Goal[] }
  | { type: 'SET_ADD_DIALOG_OPEN'; payload: boolean }
  | { type: 'SET_EDIT_DIALOG_OPEN'; payload: boolean }
  | { type: 'SET_COLLABORATE_DIALOG_OPEN'; payload: boolean }
  | { type: 'SET_DELETE_DIALOG_OPEN'; payload: boolean }
  | { type: 'SET_SELECTED_GOAL'; payload: Goal | null }
  | { type: 'SET_GOAL_COLLABORATORS'; payload: Collaborator[] }
  | { type: 'SET_IS_SUBMITTING'; payload: boolean }
  | { type: 'SET_SORT_BY'; payload: SortBy }
  | { type: 'SET_SORT_DIRECTION'; payload: SortDirection }
  | { type: 'SET_FILTER_BY'; payload: FilterBy };
