
import React, { useState } from 'react';
import { formatCurrency } from '@/utils/formatUtils';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Edit, Trash, Users, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface GoalCardProps {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  currency: 'IDR' | 'USD';
  isPremium?: boolean;
  emoji?: string;
  onEdit?: () => void;
  onDelete?: (id: string) => void;
  onCollaborate?: () => void;
  onUpdate?: () => void;
  className?: string;
}

const GoalCard = ({
  id,
  title,
  targetAmount,
  currentAmount,
  targetDate,
  currency,
  isPremium = false,
  emoji = '🎯',
  onEdit,
  onDelete,
  onCollaborate,
  onUpdate,
  className = ''
}: GoalCardProps) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isAddMoneyDialogOpen, setIsAddMoneyDialogOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate progress percentage
  const progress = Math.min(Math.round(currentAmount / targetAmount * 100), 100);

  // Format date
  const formattedDate = targetDate ? new Date(targetDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : 'No deadline';

  // Handle delete
  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      if (onDelete) {
        onDelete(id);
      } else if (onUpdate) {
        // Direct delete functionality
        const {
          error
        } = await supabase.from('savings_goals').delete().eq('id', id);
        if (error) throw error;
        toast("Goal deleted successfully");
        onUpdate();
      }
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      toast("Failed to delete goal: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle add money
  const handleAddMoney = async () => {
    if (isSubmitting || !amount) return;
    
    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      toast("Please enter a valid amount");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Get current amount
      const { data: currentGoalData, error: fetchError } = await supabase
        .from('savings_goals')
        .select('saved_amount')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      const newAmount = (currentGoalData?.saved_amount || 0) + amountValue;
      
      // Update the goal
      const { error } = await supabase
        .from('savings_goals')
        .update({ saved_amount: newAmount })
        .eq('id', id);
      
      if (error) throw error;
      
      toast("Money added successfully!");
      setAmount('');
      setIsAddMoneyDialogOpen(false);
      
      // Call onUpdate if provided
      if (onUpdate) {
        onUpdate();
      }
    } catch (error: any) {
      console.error('Error adding money:', error);
      toast("Failed to add money: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return <Card className={cn("p-5 overflow-hidden transition-all duration-300 hover:shadow-md", className)}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          {emoji && <span className="text-xl">{emoji}</span>}
          <h3 className="font-semibold text-lg truncate pr-4">{title}</h3>
        </div>
        <div className="flex gap-1">
          {isPremium && onCollaborate && (
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-500" onClick={onCollaborate} title="Collaborate">
              <Users className="h-4 w-4" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-500 hover:text-green-500" 
            onClick={() => setIsAddMoneyDialogOpen(true)}
            title="Add money"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          {onEdit && <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-blue-500" onClick={onEdit} title="Edit goal">
              <Edit className="h-4 w-4" />
            </Button>}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-500" onClick={handleDelete} disabled={isDeleting} title="Delete goal">
            {isDeleting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-r-transparent" /> : <Trash className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <div className="flex justify-between mb-1 text-sm">
        <div>Target: {formatCurrency(targetAmount, currency)}</div>
        <div>By: {formattedDate}</div>
      </div>
      
      <div className="mb-2">
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="flex justify-between text-sm">
        <div className={progress >= 100 ? "text-green-600 font-medium" : ""}>
          {formatCurrency(currentAmount, currency)} saved
        </div>
        <div className={progress >= 100 ? "text-green-600 font-medium" : ""}>
          {progress}%
        </div>
      </div>

      {/* Add Money Dialog */}
      <Dialog open={isAddMoneyDialogOpen} onOpenChange={setIsAddMoneyDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Money to Savings Goal</DialogTitle>
            <DialogDescription>
              Enter the amount you want to add to your "{title}" savings goal.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <div className="col-span-3">
                <Input
                  id="amount"
                  type="text"
                  value={amount}
                  onChange={(e) => {
                    // Only allow numbers and decimal point
                    const value = e.target.value.replace(/[^0-9.]/g, '');
                    setAmount(value);
                  }}
                  placeholder={`0${currency === 'IDR' ? '' : '.00'}`}
                  className="w-full"
                />
                {amount && !isNaN(parseFloat(amount)) && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatCurrency(parseFloat(amount), currency)}
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMoneyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMoney} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Money'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>;
};
export default GoalCard;
