
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Edit } from 'lucide-react';
import { Budget } from '@/hooks/goals/types';
import { formatCurrency } from '@/utils/formatUtils';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';

interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete: (budget: Budget) => void;
}

const BudgetCard = ({ budget, onEdit, onDelete }: BudgetCardProps) => {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const spentPercentage = budget.spent ? (budget.spent / budget.amount) * 100 : 0;
  const isOverBudget = spentPercentage > 100;

  return (
    <Card className="p-4 md:p-5">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium capitalize">{budget.category}</h3>
          <p className="text-xl md:text-2xl font-bold mt-2">{formatCurrency(budget.amount, budget.currency)}</p>
          {budget.spent !== undefined && (
            <p className={`text-sm mt-1 ${isOverBudget ? 'text-red-500' : 'text-muted-foreground'}`}>
              {t('budget.spent')}: {formatCurrency(budget.spent, budget.currency)} 
              <span className="text-xs ml-1">
                ({Math.round(spentPercentage)}%)
              </span>
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {t('budget.periodLabel')}: {budget.period}
          </p>
        </div>
        <div className="flex space-x-1 md:space-x-2">
          <Button variant="ghost" size={isMobile ? "sm" : "icon"} onClick={() => onEdit(budget)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size={isMobile ? "sm" : "icon"} onClick={() => onDelete(budget)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`}
          style={{ width: `${Math.min(spentPercentage, 100)}%` }}
        />
      </div>
    </Card>
  );
};

export default BudgetCard;
