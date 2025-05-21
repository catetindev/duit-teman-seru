import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

// Export the interface so it can be imported elsewhere
export interface GoalFormData {
  title: string;
  target_amount: string | number;
  saved_amount?: string | number;
  target_date?: string | Date;
  emoji?: string;
  currency?: 'IDR' | 'USD';
  user_id?: string; // Add this line to include user_id as an optional property
}

export interface AddGoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGoalAdded: () => void;
  onSubmit: (goalData: GoalFormData) => Promise<void>;
  isSubmitting: boolean;
}

const AddGoalDialog: React.FC<AddGoalDialogProps> = ({ 
  isOpen, 
  onClose, 
  onGoalAdded,
  onSubmit,
  isSubmitting 
}) => {
  const { toast } = useToast();
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<GoalFormData>();
  
  const onSubmitForm = async (data: GoalFormData) => {
    try {
      // Convert target_amount and saved_amount to numbers
      const formattedData: GoalFormData = {
        ...data,
        target_amount: parseFloat(String(data.target_amount)),
        saved_amount: data.saved_amount ? parseFloat(String(data.saved_amount)) : 0,
        target_date: targetDate,
      };
      
      await onSubmit(formattedData);
      onGoalAdded();
      onClose();
      toast({
        title: "Success",
        description: "Goal added successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add goal.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Goal</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Goal Title</Label>
              <Input
                id="title"
                {...register('title', { required: true })}
                placeholder="e.g., New Laptop"
              />
              {errors.title && (
                <p className="text-sm text-red-500">Title is required</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="target_amount">Target Amount</Label>
                <Input
                  id="target_amount"
                  type="number"
                  {...register('target_amount', { 
                    required: true,
                    min: { value: 0, message: "Target amount must be positive" }
                  })}
                  placeholder="5000000"
                />
                {errors.target_amount && (
                  <p className="text-sm text-red-500">
                    {errors.target_amount.message || "Target amount is required"}
                  </p>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="saved_amount">Initial Savings</Label>
                <Input
                  id="saved_amount"
                  type="number"
                  {...register('saved_amount')}
                  placeholder="0"
                  defaultValue="0"
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                defaultValue="IDR"
                onValueChange={(value) => setValue('currency', value as 'IDR' | 'USD')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IDR">Indonesian Rupiah (IDR)</SelectItem>
                  <SelectItem value="USD">US Dollar (USD)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="target_date">Target Date (Optional)</Label>
              <DatePicker 
                date={targetDate} 
                setDate={(date) => {
                  setTargetDate(date);
                  if (date) {
                    setValue('target_date', date);
                  }
                }}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="emoji">Emoji (Optional)</Label>
              <Input
                id="emoji"
                {...register('emoji')}
                placeholder="🎯"
                maxLength={2}
              />
              <p className="text-xs text-gray-500">Single emoji to represent your goal</p>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button variant="outline" type="button" onClick={onClose} className="mr-2">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Add Goal'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGoalDialog;
