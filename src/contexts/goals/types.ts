
import { Goal, Collaborator } from '@/hooks/goals/types';
import { GoalFormData } from '@/components/goals/AddGoalDialog';

export type SortOption = 'progress' | 'amount' | 'date' | 'title';
export type SortDirection = 'asc' | 'desc';
export type FilterOption = 'all' | 'completed' | 'incomplete' | 'noDate';

export interface GoalsContextType {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  selectedGoal: Goal | null;
  goalToDelete: string | null;
  isSubmitting: boolean;
  sortBy: SortOption;
  sortDirection: SortDirection;
  filterBy: FilterOption;
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
  setGoalToDelete: (goalId: string | null) => void;
  setSortBy: (option: SortOption) => void;
  setSortDirection: (direction: SortDirection) => void;
  setFilterBy: (filter: FilterOption) => void;
  
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
  calculateProgress: (saved: number, target: number) => number;
}
