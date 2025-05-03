import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/components/dashboard/DashboardData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface GoalCardProps {
  id: string;
  name: string;
  target: number;
  current: number;
  currency: 'IDR' | 'USD';
  deadline?: string;
  emoji?: string;
  className?: string;
  onUpdate?: () => void;
  onDelete?: () => void;
}

const GoalCard = ({
  id,
  name,
  target,
  current,
  currency,
  deadline,
  emoji = '🎯',
  className,
  onUpdate,
  onDelete
}: GoalCardProps) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  const isComplete = current >= target;
  
  const handleAddProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const newAmount = current + Number(amount);
      
      const { error } = await supabase
        .from('savings_goals')
        .update({ saved_amount: newAmount })
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Your goal progress has been updated.",
      });
      
      setIsDialogOpen(false);
      setAmount('');
      
      // Ensure UI is updated
      if (onUpdate) setTimeout(() => onUpdate(), 300);
      
    } catch (error: any) {
      console.error('Error updating goal:', error);
      toast({
        title: "Error",
        description: "Failed to update goal progress",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      console.log('Deleting goal with ID:', id);
      
      const { error } = await supabase
        .from('savings_goals')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }
      
      toast({
        title: "Success",
        description: "Goal deleted successfully",
      });
      
      setIsDeleteDialogOpen(false);
      
      // Ensure UI is updated
      if (onDelete) setTimeout(() => onDelete(), 300);
      else if (onUpdate) setTimeout(() => onUpdate(), 300); // Fall back to onUpdate if onDelete isn't provided
      
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete goal",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 card-hover relative",
      className
    )}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <h4 className="font-medium">{name}</h4>
        </div>
        {deadline && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            {deadline}
          </span>
        )}
      </div>
      
      <div className="mt-4">
        <div className="flex justify-between text-sm mb-2">
          <span>{formatCurrency(current, currency)}</span>
          <span className="text-muted-foreground">{formatCurrency(target, currency)}</span>
        </div>
        <Progress value={percentage} className={cn(
          isComplete ? "bg-green-100" : "bg-muted",
          isComplete && "text-green-500"
        )} />
        <div className="mt-2 flex justify-between items-center">
          <span className="text-sm font-medium">{percentage}%</span>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 gap-1"
              onClick={() => setIsDialogOpen(true)}
            >
              <PlusCircle size={16} />
              <span>{t('action.add')}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-muted-foreground hover:text-red-500"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Add Progress Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add to your {name} fund</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddProgress}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount ({currency})</Label>
                <Input
                  id="amount"
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setAmount(value);
                  }}
                  placeholder="100000"
                />
                {amount && (
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(Number(amount), currency)}
                  </p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Money'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your "{name}" savings goal and all its progress.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GoalCard;
