import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/utils/formatUtils';

interface ExpenseCardProps {
  category: string;
  spent: number;
  budget: number;
  currency: 'IDR' | 'USD';
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  category,
  spent,
  budget,
  currency,
}) => {
  const percentage = (spent / budget) * 100;
  const isOverBudget = percentage > 100;

  return (
    <Card className="p-4 transition-shadow card-hover">
      <CardContent className="p-0">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold capitalize">{category}</h3>
          <span className={`text-sm font-medium ${isOverBudget ? 'text-red-500' : 'text-green-600'}`}>
            {isOverBudget ? 'Over Budget' : 'On Track'}
          </span>
        </div>

        <div className="space-y-1 mb-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Spent: {formatCurrency(spent, currency)}</span>
            <span>Budget: {formatCurrency(budget, currency)}</span>
          </div>
          <Progress value={Math.min(percentage, 100)} className={`h-2 ${isOverBudget ? '[&>div]:bg-red-500' : '[&>div]:bg-green-500'}`} />
        </div>

        <div className="text-sm text-muted-foreground">
          {isOverBudget ? (
            <span className="text-red-500">
              You are {formatCurrency(spent - budget, currency)} over budget.
            </span>
          ) : (
            <span>
              {formatCurrency(budget - spent, currency)} remaining.
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;