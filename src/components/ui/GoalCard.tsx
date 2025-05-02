
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface GoalCardProps {
  name: string;
  target: number;
  current: number;
  currency: 'IDR' | 'USD';
  deadline?: string;
  emoji?: string;
  className?: string;
}

const formatCurrency = (amount: number, currency: 'IDR' | 'USD'): string => {
  if (currency === 'IDR') {
    return `Rp${amount.toLocaleString('id-ID')}`;
  }
  return `$${amount.toLocaleString('en-US')}`;
};

const GoalCard = ({
  name,
  target,
  current,
  currency,
  deadline,
  emoji = '🎯',
  className,
}: GoalCardProps) => {
  const { t } = useLanguage();
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  const isComplete = current >= target;
  
  return (
    <div className={cn(
      "bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 card-hover",
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
          <Button variant="ghost" size="sm" className="h-8 gap-1">
            <PlusCircle size={16} />
            <span>{t('action.add')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
