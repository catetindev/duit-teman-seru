import React, { useState, useMemo } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Import refactored components
import GoalsList from '@/components/goals/GoalsList';
import AddGoalDialog from '@/components/goals/AddGoalDialog';
import EditGoalDialog from '@/components/goals/EditGoalDialog';
import CollaboratorsDialog from '@/components/goals/CollaboratorsDialog';
import DeleteConfirmationDialog from '@/components/goals/DeleteConfirmationDialog';
import GoalsFilters, { SortOption, SortDirection, FilterOption } from '@/components/goals/GoalsFilters';
import GoalsHeader from '@/components/goals/GoalsHeader';
import GoalsLoading from '@/components/goals/GoalsLoading';

// Import hooks
import { useGoals } from '@/hooks/useGoals';
import { GoalFormData } from '@/components/goals/AddGoalDialog';
import { Goal, Collaborator } from '@/hooks/goals/types';

const GoalsPage = () => {
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
    
    const collaborators = await fetchCollaborators(goal.id);
    setGoalCollaborators(collaborators);
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
  
  const handleUpdateGoal = async (goalData: GoalFormData) => {
    if (!selectedGoal) return;
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('savings_goals')
        .update({
          title: goalData.title,
          target_amount: parseFloat(goalData.target_amount),
          saved_amount: parseFloat(goalData.saved_amount),
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
    
    const success = await addCollaborator(selectedGoal.id, email);
    
    if (success) {
      // Refresh collaborators list
      const collaborators = await fetchCollaborators(selectedGoal.id);
      setGoalCollaborators(collaborators);
    }
    
    setIsSubmitting(false);
  };

  const handleRemoveCollaborator = async (userId: string) => {
    if (!selectedGoal) return;
    
    const success = await removeCollaborator(selectedGoal.id, userId);
    
    if (success) {
      setGoalCollaborators(prev => prev.filter(c => c.user_id !== userId));
    }
  };

  if (loading) {
    return <GoalsLoading isPremium={isPremium} />;
  }

  return (
    <DashboardLayout isPremium={isPremium}>
      <GoalsHeader 
        onAddGoal={() => setIsAddDialogOpen(true)}
        isPremium={isPremium}
        goalsCount={goals.length}
      />

      {/* Add GoalsFilters component */}
      {goals.length > 0 && (
        <GoalsFilters
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
        />
      )}

      {/* Goals List Component - use filtered and sorted goals */}
      <GoalsList
        goals={filteredAndSortedGoals}
        formatCurrency={formatCurrency}
        calculateProgress={calculateProgress}
        onEdit={handleEditGoal}
        onDelete={handleDeleteGoal}
        onCollaborate={openCollaborationDialog}
        isPremium={isPremium}
      />
      
      {/* Add Goal Dialog */}
      <AddGoalDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onSubmit={handleAddGoal}
        isSubmitting={isSubmitting}
      />
      
      {/* Edit Goal Dialog */}
      <EditGoalDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSubmit={handleUpdateGoal}
        selectedGoal={selectedGoal}
        isSubmitting={isSubmitting}
      />
      
      {/* Collaborators Dialog */}
      <CollaboratorsDialog
        isOpen={isCollaborateDialogOpen}
        onClose={() => setIsCollaborateDialogOpen(false)}
        selectedGoal={selectedGoal}
        collaborators={goalCollaborators}
        onInviteCollaborator={handleInviteCollaborator}
        onRemoveCollaborator={handleRemoveCollaborator}
        isSubmitting={isSubmitting}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteGoal}
      />
    </DashboardLayout>
  );
};

export default GoalsPage;
