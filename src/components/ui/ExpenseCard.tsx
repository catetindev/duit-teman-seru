
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ExpenseCardProps {
  category: string;
  spent: number;
  budget: number;
  currency: 'IDR' | 'USD';
  icon?: string;
  className?: string;
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
}: ExpenseCardProps) => {
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
  
  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4",
      className
    )}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon || categoryIcons[category.toLowerCase()] || '📦'}</span>
          <h4 className="font-medium">{category}</h4>
        </div>
        <span className={cn("font-semibold", getStatusColor())}>
          {formatCurrency(spent, currency)} / {formatCurrency(budget, currency)}
        </span>
      </div>
      
      <Progress 
        value={Math.min(percentage, 100)} 
        className="h-2" 
        indicatorClassName={getProgressColor()}
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
    </div>
  );
};

export default ExpenseCard;
