
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { Goal, Collaborator } from '@/hooks/goals/types';
import { SortBy, SortDirection, FilterBy, GoalFormValues } from './types';

// Define a custom hook to manage goals state
export function useGoalsState() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [filteredGoals, setFilteredGoals] = useState<Goal[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCollaborateDialogOpen, setIsCollaborateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [goalCollaborators, setGoalCollaborators] = useState<Collaborator[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>('target_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterBy, setFilterBy] = useState<FilterBy>('all');

  // Function to format currency
  const formatCurrency = (amount: number, currency: 'IDR' | 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Function to calculate progress
  const calculateProgress = (goal: Goal) => {
    const progress = Math.min(Math.round((goal.saved_amount / goal.target_amount) * 100), 100);
    return progress;
  };

  // Function to fetch goals from Supabase
  const fetchGoals = useCallback(async () => {
    setLoading(true);
    try {
      // Use savings_goals table instead of goals
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .order(sortBy, { ascending: sortDirection === 'asc' });

      if (error) throw error;
      
      // Convert the data to the Goal type
      const fetchedGoals: Goal[] = data.map(goal => ({
        id: goal.id,
        title: goal.title,
        target_amount: goal.target_amount,
        saved_amount: goal.saved_amount,
        target_date: goal.target_date,
        currency: goal.currency as 'IDR' | 'USD',
        user_id: goal.user_id,
        emoji: goal.emoji,
        has_collaborators: goal.has_collaborators || false
      }));

      setGoals(fetchedGoals);
      setFilteredGoals(fetchedGoals);
      setError(null);
    } catch (error: any) {
      setError(error);
      toast(error.message || "Failed to fetch goals");
    } finally {
      setLoading(false);
    }
  }, [sortDirection, sortBy]);

  // Fetch goals on mount
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // Function to add a new goal
  const addGoal = async (values: GoalFormValues & { user_id: string; has_collaborators: boolean }) => {
    try {
      setIsSubmitting(true);
      const { data, error } = await supabase
        .from('savings_goals')
        .insert({
          id: uuidv4(),
          title: values.title,
          target_amount: values.target_amount,
          saved_amount: values.saved_amount || 0,
          target_date: values.target_date || null,
          currency: values.currency,
          emoji: values.emoji || '🎯',
          user_id: values.user_id,
          has_collaborators: values.has_collaborators || false
        })
        .select();

      if (error) {
        throw error;
      }

      // Convert the inserted data to the Goal type
      const newGoal: Goal = {
        id: data[0].id,
        title: data[0].title,
        target_amount: data[0].target_amount,
        saved_amount: data[0].saved_amount,
        target_date: data[0].target_date,
        currency: data[0].currency as 'IDR' | 'USD',
        user_id: data[0].user_id,
        emoji: data[0].emoji,
        has_collaborators: data[0].has_collaborators || false
      };

      setGoals((prevGoals) => [...prevGoals, newGoal]);
      toast("Goal added successfully");
      return newGoal;
    } catch (error: any) {
      console.error('Error adding goal:', error);
      toast(error.message || "Failed to add goal");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to update an existing goal
  const updateGoal = async (goalId: string, values: GoalFormValues) => {
    try {
      setIsSubmitting(true);
      const { data, error } = await supabase
        .from('savings_goals')
        .update({
          title: values.title,
          target_amount: values.target_amount,
          saved_amount: values.saved_amount || 0,
          target_date: values.target_date || null,
          currency: values.currency,
          emoji: values.emoji,
          has_collaborators: values.has_collaborators || false
        })
        .eq('id', goalId)
        .select();

      if (error) {
        throw error;
      }

      // Convert the updated data to the Goal type
      const updatedGoal: Goal = {
        id: data[0].id,
        title: data[0].title,
        target_amount: data[0].target_amount,
        saved_amount: data[0].saved_amount,
        target_date: data[0].target_date,
        currency: data[0].currency as 'IDR' | 'USD',
        user_id: data[0].user_id,
        emoji: data[0].emoji,
        has_collaborators: data[0].has_collaborators || false
      };

      setGoals((prevGoals) =>
        prevGoals.map((goal) => (goal.id === goalId ? updatedGoal : goal))
      );
      toast("Goal updated successfully");
    } catch (error: any) {
      console.error('Error updating goal:', error);
      toast(error.message || "Failed to update goal");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to delete a goal
  const handleDeleteGoal = async (goalId: string) => {
    try {
      setIsSubmitting(true);
      await deleteGoal(goalId);
      
      // Remove the goal from the local state
      setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
      
      toast("Goal deleted successfully");
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      toast(error.message || "Failed to delete goal");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to delete a goal from Supabase
  const deleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('savings_goals')
        .delete()
        .eq('id', goalId);

      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error('Error deleting goal from Supabase:', error);
      throw error;
    }
  };

  // Function to handle opening the edit dialog
  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsEditDialogOpen(true);
  };

  // Function to handle opening the collaboration dialog
  const openCollaborationDialog = async (goal: Goal) => {
    setSelectedGoal(goal);
    setIsCollaborateDialogOpen(true);

    // Fetch collaborators for the selected goal
    try {
      // First, get user_ids from goal_collaborators
      const { data: collaboratorsData, error: collaboratorsError } = await supabase
        .from('goal_collaborators')
        .select('user_id')
        .eq('goal_id', goal.id);
        
      if (collaboratorsError) throw collaboratorsError;
      
      if (!collaboratorsData || collaboratorsData.length === 0) {
        setGoalCollaborators([]);
        return;
      }
      
      // Then, get the user details for each user_id
      const userIds = collaboratorsData.map(item => item.user_id);
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', userIds);
        
      if (usersError) throw usersError;
      
      // Transform the data to match the Collaborator type
      const collaborators: Collaborator[] = usersData.map(user => ({
        user_id: user.id,
        email: user.email,
        full_name: user.full_name
      }));
        
      setGoalCollaborators(collaborators);
    } catch (error) {
      console.error("Failed to fetch collaborators:", error);
      toast("Failed to load collaborators");
    }
  };

  // Function to handle adding a new goal
  const handleAddGoal = async (values: GoalFormValues & { user_id: string }) => {
    // Adding has_collaborators property with default value false
    await addGoal({ ...values, has_collaborators: false });
    setIsAddDialogOpen(false);
  };

  // Function to handle updating a goal
  const updateGoalHandler = async (values: GoalFormValues) => {
    if (selectedGoal) {
      await updateGoal(selectedGoal.id, { ...values, has_collaborators: selectedGoal.has_collaborators });
      setIsEditDialogOpen(false);
    }
  };

  // Function to handle inviting a collaborator
  const handleInviteCollaborator = async (email: string) => {
    if (!selectedGoal) return;
    
    try {
      setIsSubmitting(true);
      // Check if the user with the given email exists
      const { data: users, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email);

      if (userError) {
        throw userError;
      }

      if (!users || users.length === 0) {
        throw new Error('User with this email does not exist');
      }

      const user = users[0];

      // Check if the user is already a collaborator
      const { data: existingCollaborators, error: collabError } = await supabase
        .from('goal_collaborators')
        .select('*')
        .eq('goal_id', selectedGoal.id)
        .eq('user_id', user.id);

      if (collabError) {
        throw collabError;
      }

      if (existingCollaborators && existingCollaborators.length > 0) {
        throw new Error('User is already a collaborator');
      }

      // Invite the collaborator
      const { error: inviteError } = await supabase
        .from('goal_collaborators')
        .insert([
          {
            goal_id: selectedGoal.id,
            user_id: user.id,
          }
        ]);

      if (inviteError) {
        throw inviteError;
      }

      // Update the has_collaborators flag
      const { error: updateError } = await supabase
        .from('savings_goals')
        .update({ has_collaborators: true })
        .eq('id', selectedGoal.id);

      if (updateError) {
        console.error('Error updating goal collaborator flag:', updateError);
        // Continue execution as this is not critical
      }

      // Update the local state
      const newCollaborator: Collaborator = {
        user_id: user.id,
        email: user.email,
        full_name: user.full_name
      };
      
      setGoalCollaborators(prevCollaborators => [...prevCollaborators, newCollaborator]);
      toast("Collaborator invited successfully");
    } catch (error: any) {
      console.error('Error inviting collaborator:', error);
      toast(error.message || "Failed to invite collaborator");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle removing a collaborator
  const handleRemoveCollaborator = async (userId: string) => {
    if (!selectedGoal) return;
    
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('goal_collaborators')
        .delete()
        .eq('goal_id', selectedGoal.id)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      // Update the has_collaborators flag if this was the last collaborator
      const { data: remainingCollaborators, error: checkError } = await supabase
        .from('goal_collaborators')
        .select('count')
        .eq('goal_id', selectedGoal.id);

      if (!checkError && (!remainingCollaborators || remainingCollaborators.length === 0)) {
        const { error: updateError } = await supabase
          .from('savings_goals')
          .update({ has_collaborators: false })
          .eq('id', selectedGoal.id);

        if (updateError) {
          console.error('Error updating goal collaborator flag:', updateError);
          // Continue execution as this is not critical
        }
      }

      // Update the local state
      setGoalCollaborators((prevCollaborators) =>
        prevCollaborators.filter((collaborator) => collaborator.user_id !== userId)
      );
      toast("Collaborator removed successfully");
    } catch (error: any) {
      console.error('Error removing collaborator:', error);
      toast(error.message || "Failed to remove collaborator");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to filter goals
  useEffect(() => {
    if (filterBy === 'all') {
      setFilteredGoals(goals);
    } else if (filterBy === 'collaborative') {
      setFilteredGoals(goals.filter((goal) => goal.has_collaborators));
    } else {
      setFilteredGoals(goals.filter((goal) => !goal.has_collaborators));
    }
  }, [goals, filterBy]);

  // Function to sort goals
  const sortGoals = (goalsToSort: Goal[]) => {
    return [...goalsToSort].sort((a, b) => {
      const aValue = a[sortBy as keyof Goal];
      const bValue = b[sortBy as keyof Goal];

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // Get filtered and sorted goals
  const filteredAndSortedGoals = sortGoals(filteredGoals);

  // Async confirmDeleteGoal for compatibility
  const confirmDeleteGoal = async () => {
    if (selectedGoal) {
      await handleDeleteGoal(selectedGoal.id);
      setIsDeleteDialogOpen(false);
      setSelectedGoal(null);
    }
  };

  return {
    loading,
    error,
    goals,
    filteredGoals,
    filteredAndSortedGoals,
    isAddDialogOpen,
    isEditDialogOpen,
    isCollaborateDialogOpen,
    isDeleteDialogOpen,
    selectedGoal,
    goalCollaborators,
    isSubmitting,
    sortBy,
    sortDirection,
    filterBy,
    setGoals,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsCollaborateDialogOpen,
    setIsDeleteDialogOpen,
    setSelectedGoal,
    setGoalCollaborators,
    setIsSubmitting,
    setSortBy,
    setSortDirection,
    setFilterBy,
    fetchGoals,
    formatCurrency,
    calculateProgress,
    handleEditGoal,
    handleDeleteGoal,
    openCollaborationDialog,
    addGoal,
    updateGoal,
    handleInviteCollaborator,
    handleRemoveCollaborator,
    confirmDeleteGoal,
  };
}
