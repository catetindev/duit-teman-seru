
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Plus, Users } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const { goals, loading, deleteGoal } = useDashboardData();
  const { toast } = useToast();
  
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCollaborateDialogOpen, setIsCollaborateDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [goalCollaborators, setGoalCollaborators] = useState<Collaborator[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newGoal, setNewGoal] = useState({
    title: '',
    target_amount: '',
    saved_amount: '',
    target_date: '',
    emoji: '🎯'
  });
  
  const handleDeleteGoal = (id: string) => {
    setGoalToDelete(id);
  };
  
  const confirmDeleteGoal = async () => {
    if (goalToDelete) {
      await deleteGoal(goalToDelete);
      setGoalToDelete(null);
    }
  };
  
  const editGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setNewGoal({
      title: goal.title,
      target_amount: goal.target_amount.toString(),
      saved_amount: goal.saved_amount.toString(),
      target_date: goal.target_date || '',
      emoji: goal.emoji || '🎯'
    });
    setIsEditDialogOpen(true);
  };
  
  const openCollaborationDialog = async (goal: Goal) => {
    setSelectedGoal(goal);
    setIsCollaborateDialogOpen(true);
    
    // Fetch collaborators for this goal
    try {
      // Use the goal_helpers edge function
      const { data, error } = await supabase.functions.invoke('goal_helpers', {
        body: {
          method: 'get_goal_collaborators',
          params: { goalId: goal.id }
        }
      });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setGoalCollaborators(data);
      } else {
        setGoalCollaborators([]);
      }
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      toast({
        title: "Error",
        description: "Failed to fetch collaborators",
        variant: "destructive"
      });
    }
  };
  
  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .insert({
          title: newGoal.title,
          target_amount: parseFloat(newGoal.target_amount),
          saved_amount: parseFloat(newGoal.saved_amount || '0'),
          target_date: newGoal.target_date || null,
          emoji: newGoal.emoji,
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
      setNewGoal({
        title: '',
        target_amount: '',
        saved_amount: '',
        target_date: '',
        emoji: '🎯'
      });
      
      // Refresh goals
      window.location.reload();
      
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
  
  const handleUpdateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('savings_goals')
        .update({
          title: newGoal.title,
          target_amount: parseFloat(newGoal.target_amount),
          saved_amount: parseFloat(newGoal.saved_amount),
          target_date: newGoal.target_date || null,
          emoji: newGoal.emoji
        })
        .eq('id', selectedGoal.id);
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Goal has been updated successfully.",
      });
      
      setIsEditDialogOpen(false);
      // Refresh goals
      window.location.reload();
      
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
  
  const handleInviteCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal || !inviteEmail.trim()) return;
    
    setIsSubmitting(true);
    try {
      // Find user with this email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('email', inviteEmail.trim())
        .maybeSingle();
      
      if (userError) throw userError;
      
      if (!userData) {
        throw new Error("User not found with this email");
      }
      
      // Check if already a collaborator using edge function
      const { data: isCollaborator, error: checkError } = await supabase.functions.invoke('goal_helpers', {
        body: {
          method: 'is_collaborator',
          params: { goalId: selectedGoal.id, userId: userData.id }
        }
      });
        
      if (checkError) throw checkError;
      
      if (isCollaborator) {
        throw new Error("This user is already a collaborator");
      }
      
      // Add collaborator using edge function
      const { data, error: insertError } = await supabase.functions.invoke('goal_helpers', {
        body: {
          method: 'add_collaborator',
          params: { goalId: selectedGoal.id, userId: userData.id }
        }
      });
      
      if (insertError) throw insertError;
      
      // Add new collaborator to the list
      setGoalCollaborators([...goalCollaborators, {
        user_id: userData.id,
        email: userData.email,
        full_name: userData.full_name
      }]);
      
      setInviteEmail('');
      toast({
        title: "Collaborator added!",
        description: `${userData.full_name || userData.email} has been added as a collaborator.`,
      });
      
    } catch (error: any) {
      console.error('Error inviting collaborator:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add collaborator",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const removeCollaborator = async (userId: string) => {
    if (!selectedGoal) return;
    
    try {
      // Remove collaborator using edge function
      const { error } = await supabase.functions.invoke('goal_helpers', {
        body: {
          method: 'remove_collaborator',
          params: { goalId: selectedGoal.id, userId }
        }
      });
      
      if (error) throw error;
      
      // Update the list
      setGoalCollaborators(goalCollaborators.filter(c => c.user_id !== userId));
      
      toast({
        title: "Collaborator removed",
        description: "The collaborator has been removed successfully.",
      });
      
    } catch (error: any) {
      console.error('Error removing collaborator:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to remove collaborator",
        variant: "destructive",
      });
    }
  };

  const formatCurrency = (amount: number, currency: 'IDR' | 'USD') => {
    return currency === 'IDR' 
      ? `Rp${amount.toLocaleString('id-ID')}` 
      : `$${amount.toLocaleString('en-US')}`;
  };

  const calculateProgress = (saved: number, target: number) => {
    return Math.min(Math.round((saved / target) * 100), 100);
  };

  const commonEmojis = ['🎯', '💰', '🏠', '🚗', '✈️', '💻', '📱', '👕', '🏝️', '🎓', '💍', '🚨'];

  if (loading.goals) {
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
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('goals.title')}</h1>
          <p className="text-muted-foreground mt-1">Track progress towards your financial goals</p>
        </div>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setIsAddDialogOpen(true)}
          disabled={!isPremium && goals.length >= 1}
        >
          <Plus size={16} />
          <span>Add Goal</span>
        </Button>
      </div>

      {goals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-5xl mb-4">🎯</div>
            <h3 className="text-xl font-medium mb-2">{t('goals.empty')}</h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              Setting clear goals helps you stay motivated and focused on your financial journey.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              {t('goals.add')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progress = calculateProgress(goal.saved_amount, goal.target_amount);
            
            return (
              <Card key={goal.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{goal.emoji}</span>
                      <CardTitle>{goal.title}</CardTitle>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost" 
                        size="icon"
                        onClick={() => openCollaborationDialog(goal)}
                        className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                      >
                        <Users className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost" 
                        size="icon"
                        onClick={() => editGoal(goal)}
                        className="h-8 w-8 text-gray-500 hover:text-blue-700 hover:bg-blue-100"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-2">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">
                        Saved: {formatCurrency(goal.saved_amount, goal.currency)}
                      </span>
                      <span className="text-sm font-medium">
                        {formatCurrency(goal.target_amount, goal.currency)}
                      </span>
                    </div>
                    <Progress value={progress} />
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 text-sm">
                    <span className="font-medium">{progress}%</span>
                    {goal.target_date && (
                      <span className="text-muted-foreground">Target: {goal.target_date}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
      
      {/* Add Goal Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Savings Goal</DialogTitle>
            <DialogDescription>
              Create a new savings goal to track your progress towards financial targets.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddGoal} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal-emoji">Choose an emoji</Label>
              <div className="grid grid-cols-6 gap-2">
                {commonEmojis.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    className={`h-10 text-xl flex items-center justify-center rounded-md border ${newGoal.emoji === emoji ? 'border-primary bg-primary/10' : 'border-input'}`}
                    onClick={() => setNewGoal(prev => ({ ...prev, emoji }))}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goal-name">Goal Name *</Label>
              <Input 
                id="goal-name" 
                value={newGoal.title}
                onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., New Laptop, Emergency Fund"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goal-amount">Target Amount (IDR) *</Label>
              <Input 
                id="goal-amount" 
                value={newGoal.target_amount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setNewGoal(prev => ({ ...prev, target_amount: value }));
                }}
                placeholder="1000000"
                required
              />
              {newGoal.target_amount && (
                <p className="text-sm text-muted-foreground">
                  Rp {parseInt(newGoal.target_amount).toLocaleString('id-ID')}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goal-saved">Current Savings (IDR)</Label>
              <Input 
                id="goal-saved" 
                value={newGoal.saved_amount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setNewGoal(prev => ({ ...prev, saved_amount: value }));
                }}
                placeholder="0"
              />
              {newGoal.saved_amount && (
                <p className="text-sm text-muted-foreground">
                  Rp {parseInt(newGoal.saved_amount).toLocaleString('id-ID')}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goal-date">Target Date</Label>
              <Input 
                id="goal-date" 
                type="date" 
                value={newGoal.target_date}
                onChange={(e) => setNewGoal(prev => ({ ...prev, target_date: e.target.value }))}
              />
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="gradient-bg-purple"
              >
                {isSubmitting ? 'Adding...' : 'Add Goal'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Goal Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Savings Goal</DialogTitle>
            <DialogDescription>
              Update your savings goal details.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleUpdateGoal} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-goal-emoji">Choose an emoji</Label>
              <div className="grid grid-cols-6 gap-2">
                {commonEmojis.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    className={`h-10 text-xl flex items-center justify-center rounded-md border ${newGoal.emoji === emoji ? 'border-primary bg-primary/10' : 'border-input'}`}
                    onClick={() => setNewGoal(prev => ({ ...prev, emoji }))}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-goal-name">Goal Name *</Label>
              <Input 
                id="edit-goal-name" 
                value={newGoal.title}
                onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., New Laptop, Emergency Fund"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-goal-amount">Target Amount (IDR) *</Label>
              <Input 
                id="edit-goal-amount" 
                value={newGoal.target_amount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setNewGoal(prev => ({ ...prev, target_amount: value }));
                }}
                placeholder="1000000"
                required
              />
              {newGoal.target_amount && (
                <p className="text-sm text-muted-foreground">
                  Rp {parseInt(newGoal.target_amount).toLocaleString('id-ID')}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-goal-saved">Current Savings (IDR) *</Label>
              <Input 
                id="edit-goal-saved" 
                value={newGoal.saved_amount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setNewGoal(prev => ({ ...prev, saved_amount: value }));
                }}
                placeholder="0"
                required
              />
              {newGoal.saved_amount && (
                <p className="text-sm text-muted-foreground">
                  Rp {parseInt(newGoal.saved_amount).toLocaleString('id-ID')}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-goal-date">Target Date</Label>
              <Input 
                id="edit-goal-date" 
                type="date" 
                value={newGoal.target_date}
                onChange={(e) => setNewGoal(prev => ({ ...prev, target_date: e.target.value }))}
              />
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Collaborate Dialog */}
      <Dialog open={isCollaborateDialogOpen} onOpenChange={setIsCollaborateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Goal Collaborators</DialogTitle>
            <DialogDescription>
              Invite others to collaborate on this goal.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <form onSubmit={handleInviteCollaborator} className="flex space-x-2">
              <Input 
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                type="email"
                required
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={isSubmitting || !inviteEmail.trim()}
              >
                Invite
              </Button>
            </form>
            
            <div className="space-y-2">
              <Label>Current Collaborators</Label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {goalCollaborators.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No collaborators yet</p>
                ) : (
                  goalCollaborators.map((collaborator) => (
                    <div key={collaborator.user_id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div>
                        <p className="font-medium">{collaborator.full_name}</p>
                        <p className="text-xs text-muted-foreground">{collaborator.email}</p>
                      </div>
                      <Button 
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500"
                        onClick={() => removeCollaborator(collaborator.user_id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            <div className="pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setIsCollaborateDialogOpen(false)}
                className="w-full"
              >
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <AlertDialog open={!!goalToDelete} onOpenChange={(open) => !open && setGoalToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your savings goal and this action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteGoal} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default GoalsPage;
