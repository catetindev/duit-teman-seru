import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { Goal, GoalFormValues, ValidCurrency, SortBy, SortDirection, FilterBy } from './types';
import { Database } from '@/integrations/supabase/types';

type GoalType = Database['public']['Tables']['goals']['Row'];
type CollaboratorType = Database['public']['Tables']['goal_collaborators']['Row'];

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
  const [goalCollaborators, setGoalCollaborators] = useState<CollaboratorType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>('target_date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterBy, setFilterBy] = useState<FilterBy>('all');

  // Function to format currency
  const formatCurrency = (amount: number, currency: ValidCurrency) => {
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
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order(sortBy, { ascending: sortDirection === 'asc' });

      if (error) {
        throw error;
      }

      // Convert the data to the Goal type
      const fetchedGoals: Goal[] = data.map(goal => ({
        id: goal.id,
        title: goal.title,
        target_amount: goal.target_amount,
        saved_amount: goal.saved_amount,
        target_date: goal.target_date,
        currency: goal.currency as ValidCurrency,
        user_id: goal.user_id,
        has_collaborators: goal.has_collaborators,
      }));

      setGoals(fetchedGoals);
      setFilteredGoals(fetchedGoals);
      setError(null);
    } catch (error: any) {
      setError(error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch goals",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [sortDirection, sortBy]);

  // Fetch goals on mount
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // Function to add a new goal
  const addGoal = async (values: GoalFormValues) => {
    try {
      setIsSubmitting(true);
      const { data, error } = await supabase
        .from('goals')
        .insert([
          {
            id: uuidv4(),
            title: values.title,
            target_amount: values.target_amount,
            saved_amount: values.saved_amount,
            target_date: values.target_date,
            currency: values.currency,
          },
        ])
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
        currency: data[0].currency as ValidCurrency,
        user_id: data[0].user_id,
        has_collaborators: data[0].has_collaborators,
      };

      setGoals((prevGoals) => [...prevGoals, newGoal]);
      toast({
        title: "Success",
        description: "Goal added successfully",
      });
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

  // Function to update an existing goal
  const updateGoal = async (goalId: string, values: GoalFormValues) => {
    try {
      setIsSubmitting(true);
      const { data, error } = await supabase
        .from('goals')
        .update({
          title: values.title,
          target_amount: values.target_amount,
          saved_amount: values.saved_amount,
          target_date: values.target_date,
          currency: values.currency,
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
        currency: data[0].currency as ValidCurrency,
        user_id: data[0].user_id,
        has_collaborators: data[0].has_collaborators,
      };

      setGoals((prevGoals) =>
        prevGoals.map((goal) => (goal.id === goalId ? updatedGoal : goal))
      );
      toast({
        title: "Success",
        description: "Goal updated successfully",
      });
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

  // Function to delete a goal
  const handleDeleteGoal = async (goalId: string) => {
    try {
      setIsSubmitting(true);
      await deleteGoal(goalId);
      
      // Remove the goal from the local state
      setGoals((prevGoals) => prevGoals.filter((goal) => goal.id !== goalId));
      
      toast({
        title: "Success",
        description: "Goal deleted successfully",
      });
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete goal",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to delete a goal from Supabase
  const deleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('goals')
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
      const { data, error } = await supabase
        .from('goal_collaborators')
        .select('*')
        .eq('goal_id', goal.id);

      if (error) {
        throw error;
      }

      setGoalCollaborators(data);
    } catch (error: any) {
      console.error('Error fetching collaborators:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch collaborators",
        variant: "destructive",
      });
    }
  };

  // Function to handle adding a new goal
  const handleAddGoal = async (values: GoalFormValues) => {
    await addGoal(values);
    setIsAddDialogOpen(false);
  };

  // Function to handle updating a goal
  const updateGoalHandler = async (values: GoalFormValues) => {
    if (selectedGoal) {
      await updateGoal(selectedGoal.id, values);
      setIsEditDialogOpen(false);
    }
  };

  // Function to handle inviting a collaborator
  const handleInviteCollaborator = async (goalId: string, email: string) => {
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
        .eq('goal_id', goalId)
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
            goal_id: goalId,
            user_id: user.id,
          },
        ]);

      if (inviteError) {
        throw inviteError;
      }

      // Update the local state
      setGoalCollaborators((prevCollaborators) => [
        ...prevCollaborators,
        {
          goal_id: goalId,
          user_id: user.id,
        },
      ]);
      toast({
        title: "Success",
        description: "Collaborator invited successfully",
      });
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

  // Function to handle removing a collaborator
  const handleRemoveCollaborator = async (goalId: string, userId: string) => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('goal_collaborators')
        .delete()
        .eq('goal_id', goalId)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      // Update the local state
      setGoalCollaborators((prevCollaborators) =>
        prevCollaborators.filter((collaborator) => collaborator.user_id !== userId)
      );
      toast({
        title: "Success",
        description: "Collaborator removed successfully",
      });
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
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // Function to get filtered and sorted goals
  const filteredAndSortedGoals = sortGoals(filteredGoals);

  // Replaced confirmDeleteGoal with direct delete function
  const confirmDeleteGoal = () => {
    if (selectedGoal) {
      handleDeleteGoal(selectedGoal.id);
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
    handleDeleteGoal, // Add this function to directly delete without confirmation
    openCollaborationDialog,
    handleAddGoal,
    updateGoalHandler,
    handleInviteCollaborator,
    handleRemoveCollaborator,
    confirmDeleteGoal,
  };
}
