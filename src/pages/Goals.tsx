
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import GoalCard from '@/components/ui/GoalCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/components/dashboard/DashboardData';

const GoalsPage = () => {
  const { t } = useLanguage();
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  const [goals, setGoals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // New goal form state
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: '',
    currency: 'IDR',
    deadline: '',
    emoji: '🎯'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);
  
  const fetchGoals = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast({
        title: "Error",
        description: "Failed to load savings goals",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newGoal.name || !newGoal.target) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('savings_goals')
        .insert({
          user_id: user?.id,
          title: newGoal.name,
          target_amount: parseFloat(newGoal.target),
          target_date: newGoal.deadline || null,
          emoji: newGoal.emoji,
          currency: newGoal.currency
        });
      
      if (error) throw error;
      
      toast({
        title: "Goal created!",
        description: "Your new savings goal has been created.",
      });
      
      // Reset form and close dialog
      setNewGoal({
        name: '',
        target: '',
        currency: 'IDR',
        deadline: '',
        emoji: '🎯'
      });
      setIsCreateDialogOpen(false);
      
      // Refresh goals
      fetchGoals();
      
    } catch (error: any) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create savings goal",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('savings_goals')
        .delete()
        .eq('id', goalId);
        
      if (error) throw error;
      
      toast({
        title: "Goal deleted",
        description: "Your savings goal has been removed",
      });
      
      // Refresh goals list
      fetchGoals();
      
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      toast({
        title: "Error",
        description: "Failed to delete goal",
        variant: "destructive"
      });
    }
  };
  
  // Array of emoji options for goals
  const emojiOptions = ['🎯', '🏠', '🚗', '✈️', '🎓', '💻', '👕', '📱', '🎮', '🏝️', '💍', '👶', '🐶'];
  
  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t('nav.goals')}</h1>
          <p className="text-muted-foreground mt-1">Track your savings progress and achieve your financial goals</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus size={16} className="mr-1" />
          Add Goal
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="h-48 animate-pulse">
              <CardContent className="p-0 h-full bg-gray-100 dark:bg-gray-800"></CardContent>
            </Card>
          ))}
        </div>
      ) : goals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              id={goal.id}
              name={goal.title}
              target={goal.target_amount}
              current={goal.saved_amount}
              currency={goal.currency as 'IDR' | 'USD'}
              deadline={goal.target_date ? new Date(goal.target_date).toLocaleDateString() : undefined}
              emoji={goal.emoji || '🎯'}
              onUpdate={fetchGoals}
              onDelete={() => handleDeleteGoal(goal.id)}
            />
          ))}
        </div>
      ) : (
        <Card className="border-dashed bg-muted/50 flex flex-col items-center justify-center p-8 text-center">
          <div className="text-3xl mb-3">🏁</div>
          <CardTitle className="mb-2">Start a fun challenge!</CardTitle>
          <CardDescription className="mb-4">Set your first savings goal</CardDescription>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus size={16} className="mr-1" />
            Add Goal
          </Button>
        </Card>
      )}
      
      {/* Create Goal Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create new savings goal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateGoal}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 gap-2">
                <Label htmlFor="emoji" className="text-right pt-2">Emoji</Label>
                <div className="col-span-3 flex flex-wrap gap-2 p-2 border rounded-md">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewGoal({...newGoal, emoji})}
                      className={`w-8 h-8 text-xl flex items-center justify-center rounded-md transition-colors ${newGoal.emoji === emoji ? 'bg-primary/20 ring-1 ring-primary' : 'hover:bg-muted'}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input
                  id="name"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                  placeholder="New Car"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="target" className="text-right">Target Amount</Label>
                <div className="col-span-3 flex gap-2">
                  <select 
                    value={newGoal.currency}
                    onChange={(e) => setNewGoal({...newGoal, currency: e.target.value})}
                    className="bg-background border border-input rounded-md px-3 py-2 text-sm"
                  >
                    <option value="IDR">IDR</option>
                    <option value="USD">USD</option>
                  </select>
                  <Input
                    id="target"
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({...newGoal, target: e.target.value})}
                    placeholder="5000000"
                    className="flex-1"
                  />
                </div>
                {newGoal.target && (
                  <div className="col-span-3 col-start-2 text-sm text-muted-foreground">
                    {formatCurrency(parseFloat(newGoal.target) || 0, newGoal.currency as 'IDR' | 'USD')}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 items-center gap-2">
                <Label htmlFor="deadline" className="text-right">Target Date</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Goal"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default GoalsPage;
