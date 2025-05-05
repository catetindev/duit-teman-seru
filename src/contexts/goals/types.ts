
import { Goal, Collaborator } from '@/hooks/goals/types';
import { GoalFormData } from '@/components/goals/AddGoalDialog';

export type SortBy = 'target_date' | 'progress' | 'target_amount' | 'title';
export type SortDirection = 'asc' | 'desc';
export type FilterBy = 'all' | 'collaborative' | 'personal';

// Map the new types to the old ones for backward compatibility
export type SortOption = 'progress' | 'amount' | 'date' | 'title';
export type FilterOption = 'all' | 'completed' | 'incomplete' | 'noDate' | 'collaborative' | 'personal';

export interface GoalFormValues {
  title: string;
  target_amount: number;
  saved_amount?: number;
  target_date?: string;
  currency: 'IDR' | 'USD';
  emoji?: string;
  user_id?: string;
}

export type ValidCurrency = 'IDR' | 'USD';

export interface GoalsContextType {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  selectedGoal: Goal | null;
  isSubmitting: boolean;
  sortBy: SortBy;
  sortDirection: SortDirection;
  filterBy: FilterBy;
  goalCollaborators: Collaborator[];
  filteredAndSortedGoals: Goal[];
  
  // Dialog states
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  isCollaborateDialogOpen: boolean;
  isDeleteDialogOpen: boolean;
  
  // Methods
  fetchGoals: () => Promise<void>;
  setSelectedGoal: (goal: Goal | null) => void;
  setIsAddDialogOpen: (isOpen: boolean) => void;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  setIsCollaborateDialogOpen: (isOpen: boolean) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  setSortBy: (option: SortBy) => void;
  setSortDirection: (direction: SortDirection) => void;
  setFilterBy: (filter: FilterBy) => void;
  
  // Goal operations
  handleAddGoal: (goalData: GoalFormData) => Promise<void>;
  handleEditGoal: (goal: Goal) => void;
  handleDeleteGoal: (id: string) => void;
  confirmDeleteGoal: () => Promise<void>;
  updateGoalHandler: (goalData: GoalFormData) => Promise<void>;
  openCollaborationDialog: (goal: Goal) => Promise<void>;
  handleInviteCollaborator: (email: string) => Promise<void>;
  handleRemoveCollaborator: (userId: string) => Promise<void>;
  
  // Utility methods
  formatCurrency: (amount: number, currency: 'IDR' | 'USD') => string;
  calculateProgress: (goal: Goal) => number;
}
