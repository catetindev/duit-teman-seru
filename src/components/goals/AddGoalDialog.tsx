
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

// Define the GoalFormData interface for use across components
export interface GoalFormData {
  title: string;
  target_amount: string;
  saved_amount: string;
  target_date?: string;
  emoji?: string;
  currency?: 'IDR' | 'USD';
}

interface AddGoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGoalAdded: () => void;
  onUpgradeNeeded?: () => void;
  onSubmit?: (goalData: GoalFormData) => Promise<void>;
  isSubmitting?: boolean;
}

const AddGoalDialog = ({ 
  isOpen, 
  onClose, 
  onGoalAdded,
  onUpgradeNeeded,
  onSubmit,
  isSubmitting: externalIsSubmitting = false
}: AddGoalDialogProps) => {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user, isPremium } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !target) {
      toast({
        title: "Please fill all fields",
        description: "Goal name and target amount are required.",
        variant: "destructive",
      });
      return;
    }
    
    const targetAmount = parseFloat(target);
    if (isNaN(targetAmount) || targetAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid target amount.",
        variant: "destructive",
      });
      return;
    }
    
    // If external submit handler is provided, use it
    if (onSubmit) {
      await onSubmit({
        title: name,
        target_amount: target,
        saved_amount: "0",
      });
      setName('');
      setTarget('');
      return;
    }
    
    setLoading(true);
    
    try {
      const { data: existingGoals, error: countError } = await supabase
        .from('savings_goals')
        .select('id')
        .eq('user_id', user?.id);
      
      if (countError) throw countError;
      
      // Check if user has reached the limit (1 goal for free users)
      if (!isPremium && existingGoals && existingGoals.length >= 1) {
        toast({
          title: "Goal limit reached",
          description: "Free users can only create one savings goal. Upgrade to Premium for unlimited goals.",
          // Fix warning variant
          variant: "destructive",
        });
        
        // Call the upgrade handler
        if (onUpgradeNeeded) {
          setTimeout(() => {
            onClose();
            onUpgradeNeeded();
          }, 1000);
        }
        
        setLoading(false);
        return;
      }
      
      const { error } = await supabase
        .from('savings_goals')
        .insert({
          title: name, // Use 'title' instead of 'name' to match the database schema
          target_amount: targetAmount,
          saved_amount: 0,
          currency: 'IDR',
          user_id: user?.id,
        });
      
      if (error) throw error;
      
      toast({
        title: "Goal created!",
        description: "Your savings goal has been created successfully.",
      });
      
      setName('');
      setTarget('');
      onClose();
      onGoalAdded();
    } catch (error: any) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error creating goal",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Goal</DialogTitle>
          <DialogDescription>
            Create a new savings goal to track your progress
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid w-full items-center gap-2">
            <label htmlFor="name">Goal Name</label>
            <Input
              id="name"
              placeholder="e.g., New Laptop"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading || externalIsSubmitting}
            />
          </div>
          
          <div className="grid w-full items-center gap-2">
            <label htmlFor="target">Target Amount (IDR)</label>
            <Input
              id="target"
              placeholder="e.g., 5000000"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              type="number"
              disabled={loading || externalIsSubmitting}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={loading || externalIsSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || externalIsSubmitting}>
              {(loading || externalIsSubmitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Goal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGoalDialog;
