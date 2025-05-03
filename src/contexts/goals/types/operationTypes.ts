
import { Goal, Collaborator } from '@/hooks/goals/types';
import { GoalFormData } from '@/components/goals/AddGoalDialog';

export interface GoalOperationsDependencies {
  selectedGoal: Goal | null;
  setIsEditDialogOpen: (isOpen: boolean) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
  setSelectedGoal: (goal: Goal | null) => void;
  setGoalToDelete: (goalId: string | null) => void;
  setIsCollaborateDialogOpen: (isOpen: boolean) => void;
  setGoalCollaborators: React.Dispatch<React.SetStateAction<Collaborator[]>>;
  fetchGoals: () => Promise<void>;
  deleteGoal: (goalId: string) => Promise<void>;
  fetchCollaborators: (goalId: string) => Promise<Collaborator[]>;
  addCollaborator: (goalId: string, email: string) => Promise<boolean>;
  removeCollaborator: (goalId: string, userId: string) => Promise<boolean>;
  setIsSubmitting: (isSubmitting: boolean) => void;
  toast: any; // Adding toast to dependencies to avoid importing it in each operation
}

export interface GoalOperations {
  handleEditGoal: (goal: Goal) => void;
  handleDeleteGoal: (id: string) => void;
  confirmDeleteGoal: () => Promise<void>;
  openCollaborationDialog: (goal: Goal) => Promise<void>;
  updateGoalHandler: (goalData: GoalFormData) => Promise<void>;
  handleInviteCollaborator: (email: string) => Promise<void>;
  handleRemoveCollaborator: (userId: string) => Promise<void>;
}
