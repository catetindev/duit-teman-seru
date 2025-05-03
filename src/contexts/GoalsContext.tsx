import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { Goal, Collaborator } from '@/hooks/goals/types';
import { useGoals } from '@/hooks/useGoals';
import { useAuth } from '@/contexts/AuthContext';
import { GoalFormData } from '@/components/goals/AddGoalDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type SortOption = 'progress' | 'amount' | 'date' | 'title';
export type SortDirection = 'asc' | 'desc';
export type FilterOption = 'all' | 'completed' | 'incomplete' | 'noDate';

interface GoalsContextType {
  goals: Goal[];
  loading: boolean;
  error: string | null;  // Added error state
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
  fetchGoals: () => Promise<void>; // Added fetchGoals to the interface
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

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const GoalsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isPremium, user } = useAuth();
  const { toast } = useToast();
  
  // States for dialogs
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCollaborateDialogOpen, setIsCollaborateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [goalCollaborators, setGoalCollaborators] = useState<Collaborator[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  
  // States for sorting and filtering
  const [sortBy, setSortBy] = useState<SortOption>('progress');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  
  const { 
    goals, 
    loading, 
    error,  // Added error handling
    fetchGoals,
    addGoal,
    deleteGoal, 
    fetchCollaborators, 
    addCollaborator,
    removeCollaborator,
    formatCurrency,
    calculateProgress
  } = useGoals(user?.id || '');

  // Apply sorting and filtering to goals
  const filteredAndSortedGoals = useMemo(() => {
    let result = [...goals];
    
    // Apply filters
    switch(filterBy) {
      case 'completed':
        result = result.filter(goal => calculateProgress(goal.saved_amount, goal.target_amount) >= 100);
        break;
      case 'incomplete':
        result = result.filter(goal => calculateProgress(goal.saved_amount, goal.target_amount) < 100);
        break;
      case 'noDate':
        result = result.filter(goal => !goal.target_date);
        break;
      // 'all' case returns all goals, no filtering needed
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      switch(sortBy) {
        case 'progress':
          const progressA = calculateProgress(a.saved_amount, a.target_amount);
          const progressB = calculateProgress(b.saved_amount, b.target_amount);
          comparison = progressA - progressB;
          break;
        case 'amount':
          comparison = a.target_amount - b.target_amount;
          break;
        case 'date':
          // Handle cases where one or both goals don't have a target date
          if (!a.target_date && !b.target_date) comparison = 0;
          else if (!a.target_date) comparison = 1;  // Goals without dates go last
          else if (!b.target_date) comparison = -1; // Goals without dates go last
          else comparison = new Date(a.target_date).getTime() - new Date(b.target_date).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }
      
      // Apply sort direction
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [goals, sortBy, sortDirection, filterBy, calculateProgress]);
  
  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsEditDialogOpen(true);
  };
  
  const handleDeleteGoal = (id: string) => {
    setGoalToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteGoal = async () => {
    if (goalToDelete) {
      await deleteGoal(goalToDelete);
      setGoalToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };

  const openCollaborationDialog = async (goal: Goal) => {
    setSelectedGoal(goal);
    setIsCollaborateDialogOpen(true);
    
    try {
      const collaborators = await fetchCollaborators(goal.id);
      setGoalCollaborators(collaborators);
    } catch (error) {
      console.error("Failed to fetch collaborators:", error);
      toast({
        title: "Error",
        description: "Failed to load collaborators",
        variant: "destructive"
      });
    }
  };

  const handleAddGoal = async (goalData: GoalFormData) => {
    setIsSubmitting(true);
    
    try {
      if (!user?.id) {
        throw new Error("You must be logged in to add a goal");
      }
      
      const goalToAdd = {
        title: goalData.title,
        target_amount: parseFloat(goalData.target_amount),
        saved_amount: parseFloat(goalData.saved_amount || '0'),
        target_date: goalData.target_date || null,
        emoji: goalData.emoji,
        user_id: user.id,
        currency: 'IDR' as const
      };
      
      const newGoal = await addGoal(goalToAdd);
      
      if (newGoal) {
        toast({
          title: "Success!",
          description: "Savings goal has been added.",
        });
        
        setIsAddDialogOpen(false);
        // Refresh goals list
        fetchGoals();
      }
      
    } catch (error: any) {
      console.error('Error adding goal:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add goal",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const updateGoalHandler = async (goalData: GoalFormData) => {
    if (!selectedGoal) return;
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('savings_goals')
        .update({
          title: goalData.title,
          target_amount: parseFloat(goalData.target_amount),
          saved_amount: parseFloat(goalData.saved_amount || '0'),
          target_date: goalData.target_date || null,
          emoji: goalData.emoji
        })
        .eq('id', selectedGoal.id);
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Goal has been updated successfully.",
      });
      
      setIsEditDialogOpen(false);
      fetchGoals();
      
    } catch (error: any) {
      console.error('Error updating goal:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update goal",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInviteCollaborator = async (email: string) => {
    if (!selectedGoal) return;
    setIsSubmitting(true);
    
    try {
      const success = await addCollaborator(selectedGoal.id, email);
      
      if (success) {
        toast({
          title: "Success!",
          description: `Invitation sent to ${email}`,
        });
        
        // Refresh collaborators list
        const collaborators = await fetchCollaborators(selectedGoal.id);
        setGoalCollaborators(collaborators);
      }
    } catch (error: any) {
      console.error('Error inviting collaborator:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to invite collaborator",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveCollaborator = async (userId: string) => {
    if (!selectedGoal) return;
    setIsSubmitting(true);
    
    try {
      const success = await removeCollaborator(selectedGoal.id, userId);
      
      if (success) {
        toast({
          title: "Success!",
          description: "Collaborator has been removed",
        });
        
        // Update the collaborators list
        setGoalCollaborators(prev => prev.filter(c => c.user_id !== userId));
      }
    } catch (error: any) {
      console.error('Error removing collaborator:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove collaborator",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const value = {
    goals,
    loading,
    error,  // Added error state
    selectedGoal,
    goalToDelete,
    isSubmitting,
    sortBy,
    sortDirection,
    filterBy,
    goalCollaborators,
    filteredAndSortedGoals,
    isAddDialogOpen,
    isEditDialogOpen,
    isCollaborateDialogOpen,
    isDeleteDialogOpen,
    fetchGoals, // Add fetchGoals to the context value
    setSelectedGoal,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsCollaborateDialogOpen,
    setIsDeleteDialogOpen,
    setGoalToDelete,
    setSortBy,
    setSortDirection,
    setFilterBy,
    handleAddGoal,
    handleEditGoal,
    handleDeleteGoal,
    confirmDeleteGoal,
    updateGoalHandler,
    openCollaborationDialog,
    handleInviteCollaborator,
    handleRemoveCollaborator,
    formatCurrency,
    calculateProgress
  };
  
  return <GoalsContext.Provider value={value}>{children}</GoalsContext.Provider>;
};

export const useGoalsContext = (): GoalsContextType => {
  const context = useContext(GoalsContext);
  if (context === undefined) {
    throw new Error('useGoalsContext must be used within a GoalsProvider');
  }
  return context;
};
