import React, { useState, useEffect } from 'react';
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
import { useToast } from '@/hooks/use-toast';

interface AddGoalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goalData: GoalFormData) => Promise<void>;
  isSubmitting: boolean;
}

export interface GoalFormData {
  title: string;
  target_amount: string;
  saved_amount?: string;
  target_date?: string;
  currency?: 'IDR' | 'USD';
  emoji?: string;
}

const initialFormState: GoalFormData = {
  title: '',
  target_amount: '',
  saved_amount: '',
  target_date: '',
  emoji: '🎯'
};

const AddGoalDialog: React.FC<AddGoalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting
}) => {
  const [goalData, setGoalData] = useState<GoalFormData>(initialFormState);
  const [validationErrors, setValidationErrors] = useState<Partial<Record<keyof GoalFormData, string>>>({});
  const { toast } = useToast();

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setGoalData(initialFormState);
      setValidationErrors({});
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof GoalFormData, string>> = {};
    
    if (!goalData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!goalData.target_amount) {
      errors.target_amount = 'Target amount is required';
    } else if (isNaN(Number(goalData.target_amount)) || Number(goalData.target_amount) <= 0) {
      errors.target_amount = 'Target amount must be a positive number';
    }
    
    if (goalData.saved_amount && (isNaN(Number(goalData.saved_amount)) || Number(goalData.saved_amount) < 0)) {
      errors.saved_amount = 'Saved amount must be a non-negative number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate before submitting
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the form errors before submitting",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await onSubmit(goalData);
      // Form will be reset by the useEffect when isOpen changes
    } catch (error) {
      console.error("Error submitting goal:", error);
      // Error handling is done in the parent component
    }
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
            <Label htmlFor="goal-name" className={validationErrors.title ? "text-destructive" : ""}>
              Goal Name *
            </Label>
            <Input 
              id="goal-name" 
              value={goalData.title}
              onChange={(e) => setGoalData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., New Laptop, Emergency Fund"
              required
              className={validationErrors.title ? "border-destructive" : ""}
            />
            {validationErrors.title && (
              <p className="text-sm text-destructive">{validationErrors.title}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="goal-amount" className={validationErrors.target_amount ? "text-destructive" : ""}>
              Target Amount (IDR) *
            </Label>
            <Input 
              id="goal-amount" 
              value={goalData.target_amount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setGoalData(prev => ({ ...prev, target_amount: value }));
              }}
              placeholder="1000000"
              required
              className={validationErrors.target_amount ? "border-destructive" : ""}
            />
            {validationErrors.target_amount ? (
              <p className="text-sm text-destructive">{validationErrors.target_amount}</p>
            ) : goalData.target_amount && (
              <p className="text-sm text-muted-foreground">
                Rp {parseInt(goalData.target_amount).toLocaleString('id-ID')}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="goal-saved" className={validationErrors.saved_amount ? "text-destructive" : ""}>
              Current Savings (IDR)
            </Label>
            <Input 
              id="goal-saved" 
              value={goalData.saved_amount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setGoalData(prev => ({ ...prev, saved_amount: value }));
              }}
              placeholder="0"
              className={validationErrors.saved_amount ? "border-destructive" : ""}
            />
            {validationErrors.saved_amount ? (
              <p className="text-sm text-destructive">{validationErrors.saved_amount}</p>
            ) : goalData.saved_amount && (
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
