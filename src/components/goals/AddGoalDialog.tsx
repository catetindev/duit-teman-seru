
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddGoalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goalData: GoalFormData) => Promise<void>;
  isSubmitting: boolean;
}

export interface GoalFormData {
  title: string;
  target_amount: string;
  saved_amount: string;
  target_date: string;
  emoji: string;
}

const AddGoalDialog: React.FC<AddGoalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting
}) => {
  const [goalData, setGoalData] = useState<GoalFormData>({
    title: '',
    target_amount: '',
    saved_amount: '',
    target_date: '',
    emoji: '🎯'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(goalData);
  };

  const commonEmojis = ['🎯', '💰', '🏠', '🚗', '✈️', '💻', '📱', '👕', '🏝️', '🎓', '💍', '🚨'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Savings Goal</DialogTitle>
          <DialogDescription>
            Create a new savings goal to track your progress towards financial targets.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goal-emoji">Choose an emoji</Label>
            <div className="grid grid-cols-6 gap-2">
              {commonEmojis.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  className={`h-10 text-xl flex items-center justify-center rounded-md border ${goalData.emoji === emoji ? 'border-primary bg-primary/10' : 'border-input'}`}
                  onClick={() => setGoalData(prev => ({ ...prev, emoji }))}
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
              value={goalData.title}
              onChange={(e) => setGoalData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., New Laptop, Emergency Fund"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="goal-amount">Target Amount (IDR) *</Label>
            <Input 
              id="goal-amount" 
              value={goalData.target_amount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setGoalData(prev => ({ ...prev, target_amount: value }));
              }}
              placeholder="1000000"
              required
            />
            {goalData.target_amount && (
              <p className="text-sm text-muted-foreground">
                Rp {parseInt(goalData.target_amount).toLocaleString('id-ID')}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="goal-saved">Current Savings (IDR)</Label>
            <Input 
              id="goal-saved" 
              value={goalData.saved_amount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setGoalData(prev => ({ ...prev, saved_amount: value }));
              }}
              placeholder="0"
            />
            {goalData.saved_amount && (
              <p className="text-sm text-muted-foreground">
                Rp {parseInt(goalData.saved_amount).toLocaleString('id-ID')}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="goal-date">Target Date</Label>
            <Input 
              id="goal-date" 
              type="date" 
              value={goalData.target_date}
              onChange={(e) => setGoalData(prev => ({ ...prev, target_date: e.target.value }))}
            />
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              type="button" 
              onClick={onClose}
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
  );
};

export default AddGoalDialog;
