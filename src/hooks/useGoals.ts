
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Goal {
  id: string;
  title: string;
  target_amount: number;
  saved_amount: number;
  currency: 'IDR' | 'USD';
  target_date?: string;
  emoji?: string;
}

interface Collaborator {
  user_id: string;
  email: string;
  full_name: string;
}

// Helper function to validate currency
const validateCurrency = (currency: string): 'IDR' | 'USD' => {
  return currency === 'USD' ? 'USD' : 'IDR'; // Default to IDR if not USD
};

export function useGoals(userId: string) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Format currency for display
  const formatCurrency = (amount: number, currency: 'IDR' | 'USD') => {
    return currency === 'IDR' 
      ? `Rp${amount.toLocaleString('id-ID')}` 
      : `$${amount.toLocaleString('en-US')}`;
  };

  // Calculate progress percentage
  const calculateProgress = (saved: number, target: number) => {
    return Math.min(Math.round((saved / target) * 100), 100);
  };

  // Fetch all goals
  const fetchGoals = async () => {
    try {
      setLoading(true);
      
      // First get user's own goals
      const { data: ownGoals, error: ownError } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', userId);
      
      if (ownError) throw ownError;
      
      // Then get goals where user is a collaborator
      const { data: collaborations, error: collabError } = await supabase
        .from('goal_collaborators')
        .select('goal_id')
        .eq('user_id', userId);
      
      if (collabError) throw collabError;
      
      let sharedGoals: Goal[] = [];
      
      if (collaborations && collaborations.length > 0) {
        const goalIds = collaborations.map(c => c.goal_id);
        
        const { data: collabGoals, error: fetchError } = await supabase
          .from('savings_goals')
          .select('*')
          .in('id', goalIds);
        
        if (fetchError) throw fetchError;
        
        if (collabGoals) {
          // Convert database records to Goal objects with proper currency type
          sharedGoals = collabGoals.map(goal => ({
            ...goal,
            currency: validateCurrency(goal.currency)
          }));
        }
      }
      
      // Combine both sets of goals, ensuring proper currency type
      const typedOwnGoals = ownGoals ? ownGoals.map(goal => ({
        ...goal,
        currency: validateCurrency(goal.currency)
      })) : [];
      
      setGoals([...typedOwnGoals, ...sharedGoals]);
      
    } catch (error: any) {
      console.error('Error fetching goals:', error);
      toast({
        title: "Error",
        description: "Failed to load goals",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete a goal
  const deleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('savings_goals')
        .delete()
        .eq('id', goalId);
      
      if (error) throw error;
      
      setGoals(prev => prev.filter(goal => goal.id !== goalId));
      
      toast({
        title: "Success",
        description: "Goal has been deleted",
      });
      
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      toast({
        title: "Error",
        description: "Failed to delete goal",
        variant: "destructive",
      });
    }
  };

  // Fetch collaborators for a goal
  const fetchCollaborators = async (goalId: string): Promise<Collaborator[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('goal_helpers', {
        body: {
          method: 'get_goal_collaborators',
          params: { goalId }
        }
      });
      
      if (error) throw error;
      
      return data || [];
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      toast({
        title: "Error",
        description: "Failed to fetch collaborators",
        variant: "destructive"
      });
      return [];
    }
  };

  // Add a collaborator
  const addCollaborator = async (goalId: string, email: string): Promise<boolean> => {
    try {
      // Find user with this email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('email', email.trim())
        .maybeSingle();
      
      if (userError) throw userError;
      
      if (!userData) {
        throw new Error("User not found with this email");
      }
      
      // Check if already a collaborator
      const { data: isCollaborator, error: checkError } = await supabase.functions.invoke('goal_helpers', {
        body: {
          method: 'is_collaborator',
          params: { goalId, userId: userData.id }
        }
      });
        
      if (checkError) throw checkError;
      
      if (isCollaborator) {
        throw new Error("This user is already a collaborator");
      }
      
      // Add collaborator
      const { error: addError } = await supabase.functions.invoke('goal_helpers', {
        body: {
          method: 'add_collaborator',
          params: { goalId, userId: userData.id }
        }
      });
      
      if (addError) throw addError;
      
      toast({
        title: "Collaborator added!",
        description: `${userData.full_name || userData.email} has been added as a collaborator.`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Error inviting collaborator:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add collaborator",
        variant: "destructive",
      });
      return false;
    }
  };

  // Remove a collaborator
  const removeCollaborator = async (goalId: string, userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase.functions.invoke('goal_helpers', {
        body: {
          method: 'remove_collaborator',
          params: { goalId, userId }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Collaborator removed",
        description: "The collaborator has been removed successfully.",
      });
      
      return true;
    } catch (error: any) {
      console.error('Error removing collaborator:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove collaborator",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (userId) {
      fetchGoals();
    }
  }, [userId]);

  return {
    goals,
    loading,
    deleteGoal,
    fetchGoals,
    fetchCollaborators,
    addCollaborator,
    removeCollaborator,
    formatCurrency,
    calculateProgress
  };
}
