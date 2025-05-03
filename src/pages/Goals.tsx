
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

// Import refactored components
import GoalsList from '@/components/goals/GoalsList';
import AddGoalDialog from '@/components/goals/AddGoalDialog';
import EditGoalDialog from '@/components/goals/EditGoalDialog';
import CollaboratorsDialog from '@/components/goals/CollaboratorsDialog';
import DeleteConfirmationDialog from '@/components/goals/DeleteConfirmationDialog';
import { useGoals } from '@/hooks/useGoals';
import { GoalFormData } from '@/components/goals/AddGoalDialog';

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

const GoalsPage = () => {
  const { t } = useLanguage();
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
  
  const { 
    goals, 
    loading, 
    fetchGoals,
    deleteGoal, 
    fetchCollaborators, 
    addCollaborator,
    removeCollaborator,
    formatCurrency,
    calculateProgress
  } = useGoals(user?.id || '');

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
      const { data, error } = await supabase
        .from('savings_goals')
        .insert({
          title: goalData.title,
          target_amount: parseFloat(goalData.target_amount),
          saved_amount: parseFloat(goalData.saved_amount || '0'),
          target_date: goalData.target_date || null,
          emoji: goalData.emoji,
          user_id: user?.id,
          currency: 'IDR'  // Default currency
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Savings goal has been added.",
      });
      
      setIsAddDialogOpen(false);
      fetchGoals();
      
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
    return (
      <DashboardLayout isPremium={isPremium}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('goals.title')}</h1>
          <p className="text-muted-foreground mt-1">Track progress towards your financial goals</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            className="flex items-center gap-2"
            onClick={() => setIsAddDialogOpen(true)}
            disabled={!isPremium && goals.length >= 1}
          >
            <Plus size={16} />
            <span>Add Goal</span>
          </Button>
          <Link to="/goals/collaboration-docs">
            <Button variant="outline" className="flex items-center gap-2">
              <BookOpen size={16} />
              <span>Documentation</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Goals List Component */}
      <GoalsList
        goals={goals}
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
