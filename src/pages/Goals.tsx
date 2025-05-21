import React, { useCallback, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

// Import components
import GoalsList from '@/components/goals/GoalsList';
import AddGoalDialog from '@/components/goals/AddGoalDialog';
import EditGoalDialog from '@/components/goals/EditGoalDialog';
import CollaboratorsDialog from '@/components/goals/CollaboratorsDialog';
import DeleteConfirmationDialog from '@/components/goals/DeleteConfirmationDialog';
import GoalsFilters from '@/components/goals/GoalsFilters';
import GoalsHeader from '@/components/goals/GoalsHeader';
import GoalsLoading from '@/components/goals/GoalsLoading';
import PendingInvitations from '@/components/goals/PendingInvitations';
import { GoalFormData } from '@/components/goals/AddGoalDialog';

// Import context provider
import { GoalsProvider, useGoalsContext } from '@/contexts/goals';
import { SortBy, SortDirection, FilterBy } from '@/contexts/goals/types';

// Main component that wraps everything with the context provider
const GoalsPage = () => {
  const { isPremium, user } = useAuth();
  
  return (
    <GoalsProvider>
      <GoalsContent isPremium={isPremium} userId={user?.id} />
    </GoalsProvider>
  );
};

// Inner component that consumes the context
const GoalsContent = ({ isPremium, userId }: { isPremium: boolean; userId?: string }) => {
  const { 
    loading, 
    error,
    goals,
    filteredAndSortedGoals,
    isAddDialogOpen,
    isEditDialogOpen,
    isCollaborateDialogOpen,
    isDeleteDialogOpen,
    selectedGoal,
    goalCollaborators,
    isSubmitting,
    setIsAddDialogOpen,
    sortBy,
    setSortBy,
    sortDirection,
    setSortDirection,
    filterBy,
    setFilterBy,
    formatCurrency,
    calculateProgress,
    handleEditGoal,
    handleDeleteGoal,
    openCollaborationDialog,
    handleAddGoal,
    updateGoalHandler,
    handleInviteCollaborator,
    handleRemoveCollaborator,
    confirmDeleteGoal,
    setIsEditDialogOpen,
    setIsCollaborateDialogOpen,
    setIsDeleteDialogOpen,
    fetchGoals,
  } = useGoalsContext();

  // Refetch goals when user ID changes
  useEffect(() => {
    if (userId) {
      console.log('User ID changed, fetching goals for:', userId);
      fetchGoals();
    }
  }, [userId, fetchGoals]);

  // Use stable callback to prevent re-renders
  const handleAddDialogOpen = useCallback(() => {
    setIsAddDialogOpen(true);
  }, [setIsAddDialogOpen]);

  const handleAddDialogClose = useCallback(() => {
    setIsAddDialogOpen(false);
  }, [setIsAddDialogOpen]);

  const handleEditDialogClose = useCallback(() => {
    setIsEditDialogOpen(false);
  }, [setIsEditDialogOpen]);

  const handleCollaborateDialogClose = useCallback(() => {
    setIsCollaborateDialogOpen(false);
  }, [setIsCollaborateDialogOpen]);

  const handleDeleteDialogClose = useCallback(() => {
    setIsDeleteDialogOpen(false);
  }, [setIsDeleteDialogOpen]);

  // Handle adding a goal with the current user ID
  const handleAddGoalWithUser = useCallback(async (goalData: GoalFormData) => {
    console.log('handleAddGoalWithUser called with:', goalData);
    if (userId) {
      await handleAddGoal({ ...goalData, user_id: userId });
    } else {
      console.error('Cannot add goal: No user ID available');
    }
  }, [handleAddGoal, userId]);

  if (loading) {
    return <GoalsLoading isPremium={isPremium} />;
  }

  if (error) {
    return (
      <GoalsLoading 
        isPremium={isPremium} 
        error={error instanceof Error ? error.message : String(error)} 
        onRetry={fetchGoals} 
      />
    );
  }

  return (
    <DashboardLayout isPremium={isPremium}>
      <GoalsHeader 
        onAddGoal={handleAddDialogOpen}
        isPremium={isPremium}
        goalsCount={goals?.length || 0}
      />

      {/* Display pending invitations */}
      <PendingInvitations />

      {/* Add GoalsFilters component */}
      {goals && goals.length > 0 && (
        <GoalsFilters
          sortBy={sortBy}
          setSortBy={setSortBy as (option: SortBy) => void}
          sortDirection={sortDirection}
          setSortDirection={setSortDirection}
          filterBy={filterBy}
          setFilterBy={setFilterBy as (filter: FilterBy) => void}
        />
      )}

      {/* Goals List Component */}
      <GoalsList
        goals={filteredAndSortedGoals}
        formatCurrency={formatCurrency}
        calculateProgress={calculateProgress}
        onEdit={handleEditGoal}
        onDelete={handleDeleteGoal}
        onCollaborate={openCollaborationDialog}
        isPremium={isPremium}
      />
      
      {/* Dialogs */}
      <AddGoalDialog
        isOpen={isAddDialogOpen}
        onClose={handleAddDialogClose}
        onGoalAdded={fetchGoals}
        onSubmit={handleAddGoalWithUser}
        isSubmitting={isSubmitting}
      />
      
      <EditGoalDialog
        isOpen={isEditDialogOpen}
        onClose={handleEditDialogClose}
        onSubmit={updateGoalHandler}
        selectedGoal={selectedGoal}
        isSubmitting={isSubmitting}
      />
      
      <CollaboratorsDialog
        isOpen={isCollaborateDialogOpen}
        onClose={handleCollaborateDialogClose}
        selectedGoal={selectedGoal}
        collaborators={goalCollaborators}
        onInviteCollaborator={handleInviteCollaborator}
        onRemoveCollaborator={handleRemoveCollaborator}
        isSubmitting={isSubmitting}
      />
      
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteDialogClose}
        onConfirm={confirmDeleteGoal}
      />
    </DashboardLayout>
  );
};

export default GoalsPage;
