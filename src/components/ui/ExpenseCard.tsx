
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface ExpenseCardProps {
  category: string;
  spent: number;
  budget: number;
  currency: 'IDR' | 'USD';
  icon?: string;
  className?: string;
  onDelete?: () => void;
}

const formatCurrency = (amount: number, currency: 'IDR' | 'USD'): string => {
  if (currency === 'IDR') {
    return `Rp${amount.toLocaleString('id-ID')}`;
  }
  return `$${amount.toLocaleString('en-US')}`;
};

const categoryIcons: Record<string, string> = {
  'food': '🍔',
  'transport': '🚗',
  'entertainment': '🎬',
  'shopping': '🛍️',
  'bills': '📄',
  'rent': '🏠',
  'health': '💊',
  'education': '📚',
  'other': '📦'
};

const ExpenseCard = ({
  category,
  spent,
  budget,
  currency,
  icon,
  className,
  onDelete,
}: ExpenseCardProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const percentage = Math.round((spent / budget) * 100);
  const isOverBudget = spent > budget;
  const isCloseToLimit = percentage >= 80 && percentage < 100;
  
  const getStatusColor = () => {
    if (isOverBudget) return 'text-red-500';
    if (isCloseToLimit) return 'text-orange-500';
    return 'text-green-500';
  };
  
  const getProgressColor = () => {
    if (isOverBudget) return 'bg-red-500';
    if (isCloseToLimit) return 'bg-orange-500';
    return 'bg-primary';
  };
  
  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setIsDeleteDialogOpen(false);
  };
  
  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 relative",
      className
    )}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon || categoryIcons[category.toLowerCase()] || '📦'}</span>
          <h4 className="font-medium">{category}</h4>
        </div>
        <div className="flex items-center gap-1">
          <span className={cn("font-semibold", getStatusColor())}>
            {formatCurrency(spent, currency)} / {formatCurrency(budget, currency)}
          </span>
          {onDelete && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="ml-2 text-muted-foreground hover:text-red-500"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </div>
      
      <Progress 
        value={Math.min(percentage, 100)} 
        className={cn("h-2", getProgressColor())}
      />
      
      <div className="mt-2 text-sm">
        <span className={cn("font-medium", getStatusColor())}>
          {percentage}%
        </span>
        {isOverBudget && (
          <span className="text-red-500 text-xs ml-2">
            ({formatCurrency(spent - budget, currency)} over!)
          </span>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the "{category}" budget category.
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

export default ExpenseCard;
