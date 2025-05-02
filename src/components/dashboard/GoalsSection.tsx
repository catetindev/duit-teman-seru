import React, { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import GoalCard from '@/components/ui/GoalCard';
import { PlusCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Goal } from '@/components/dashboard/DashboardData';

interface GoalsSectionProps {
  goals: Goal[];
  isPremium: boolean;
  onGoalAdded: () => void;
  loading?: boolean;
}

const GoalsSection = ({ goals, isPremium, onGoalAdded, loading = false }: GoalsSectionProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target_amount: '',
    emoji: '🎯'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setIsSubmitting(true);
      setDialogError(null);
      
      if (!newGoal.title || !newGoal.target_amount) {
        setDialogError('Please fill in all required fields');
        return;
      }
      
      const { data, error } = await supabase
        .from('savings_goals')
        .insert({
          user_id: user.id,
          title: newGoal.title,
          target_amount: parseFloat(newGoal.target_amount),
          saved_amount: 0,
          currency: 'IDR',
          emoji: newGoal.emoji
        });
      
      if (error) {
        if (error.message.includes('free users can only create')) {
          setDialogError('Free users can only create one savings goal. Please upgrade to premium for unlimited goals.');
          return;
        }
        throw error;
      }
      
      toast({
        title: "Success!",
        description: "Your savings goal has been added.",
      });
      
      setIsDialogOpen(false);
      setNewGoal({
        title: '',
        target_amount: '',
        emoji: '🎯'
      });
      
      // Refresh goals list
      onGoalAdded();
      
    } catch (error: any) {
      console.error('Error adding goal:', error);
      setDialogError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewGoal(prev => ({ ...prev, emoji }));
  };

  const commonEmojis = ['🎯', '💰', '🏠', '🚗', '✈️', '💻', '📱', '👕', '🏝️', '🎓', '💍', '🚨'];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{t('goals.title')}</h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          onClick={() => setIsDialogOpen(true)}
          disabled={!isPremium && goals.length >= 1}
        >
          <PlusCircle size={16} />
          <span>{t('goals.add')}</span>
        </Button>
      </div>
      
      <div className="space-y-4">
        {loading ? (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading your goals...</p>
          </div>
        ) : goals.length > 0 ? (
          goals.map((goal) => (
            <GoalCard
              key={goal.id}
              id={goal.id}
              name={goal.title}
              target={goal.target_amount}
              current={goal.saved_amount}
              currency={goal.currency}
              deadline={goal.target_date}
              emoji={goal.emoji}
              onUpdate={onGoalAdded}
            />
          ))
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">You don't have any savings goals yet.</p>
          </div>
        )}
        
        {!isPremium && (
          <div className="bg-muted/50 rounded-xl p-4 mt-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Upgrade to premium for unlimited savings goals! ✨
            </p>
            <Button size="sm" className="gradient-bg-purple">
              Upgrade Now
            </Button>
          </div>
        )}
      </div>

      {/* Add Goal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Savings Goal</DialogTitle>
            <DialogDescription>
              Create a new savings goal to track your progress towards financial targets.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAddGoal} className="space-y-4">
            {dialogError && (
              <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                {dialogError}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="goal-emoji">Choose an emoji</Label>
              <div className="grid grid-cols-6 gap-2">
                {commonEmojis.map(emoji => (
                  <button
                    key={emoji}
                    type="button"
                    className={`h-10 text-xl flex items-center justify-center rounded-md border ${newGoal.emoji === emoji ? 'border-primary bg-primary/10' : 'border-input'}`}
                    onClick={() => handleEmojiSelect(emoji)}
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
            
            <DialogFooter>
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => setIsDialogOpen(false)}
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
    </div>
  );
};

export default GoalsSection;
