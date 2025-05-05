
import { Goal, Collaborator } from '@/hooks/goals/types';
import { GoalFormData } from '@/components/goals/AddGoalDialog';

export type SortBy = 'target_date' | 'progress' | 'target_amount' | 'title';
export type SortDirection = 'asc' | 'desc';
export type FilterBy = 'all' | 'personal' | 'collaborative';

export interface GoalsContextType {
  // State
  goals: Goal[];
  loading: boolean;
  error: Error | null;
  selectedGoal: Goal | null;
  isSubmitting: boolean;
  sortBy: SortBy;
  sortDirection: SortDirection;
  filterBy: FilterBy;
  goalCollaborators: Collaborator[];
  filteredAndSortedGoals: Goal[];
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isCollaborateDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  
  // Actions
  fetchGoals: () => Promise<void>;
  setSelectedGoal: (goal: Goal | null) => void;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  setIsCollaborateDialogOpen: (isOpen: boolean) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  setSortBy: (sortBy: SortBy) => void;
  setSortDirection: (direction: SortDirection) => void;
  setFilterBy: (filter: FilterBy) => void;
  handleAddGoal: (goalData: GoalFormData) => Promise<void>;
  handleEditGoal: (goal: Goal) => void;
  handleDeleteGoal: (id: string) => void;
  confirmDeleteGoal: () => Promise<void>;
  updateGoalHandler: (goalData: GoalFormData) => Promise<void>;
  openCollaborationDialog: (goal: Goal) => Promise<void>;
  handleInviteCollaborator: (email: string) => Promise<void>;
  handleRemoveCollaborator: (userId: string) => Promise<void>;
  formatCurrency: (amount: number, currency: 'IDR' | 'USD') => string;
  calculateProgress: (goal: Goal) => number;
}
