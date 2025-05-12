import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { ComparisonData } from '@/types/finance';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatUtils'; // Updated import

interface ComparisonCardsProps {
  data: ComparisonData;
}

export function ComparisonCards({ data }: ComparisonCardsProps) {
  const formatChange = (change: number): string => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  const getChangeIndicator = (change: number) => {
    if (change > 0) {
      return <ArrowUpRight className="h-4 w-4 text-emerald-500" />;
    } else if (change < 0) {
      return <ArrowDownRight className="h-4 w-4 text-destructive" />;
    }
    return null;
  };

  // For expenses, negative change is good
  const getExpenseClass = (change: number) => {
    if (change > 0) return 'text-destructive';
    if (change < 0) return 'text-emerald-500';
    return '';
  };

  // For income and profit, positive change is good
  const getIncomeClass = (change: number) => {
    if (change > 0) return 'text-emerald-500';
    if (change < 0) return 'text-destructive';
    return '';
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Revenue</p>
              <div className="flex items-center gap-1">
                <span className={getIncomeClass(data.incomeChange)}>
                  {formatChange(data.incomeChange)}
                </span>
                {getChangeIndicator(data.incomeChange)}
              </div>
            </div>
            <p className="text-xl font-semibold">
              {formatCurrency(data.current.totalIncome, 'IDR')}
            </p>
            <p className="text-xs text-muted-foreground">
              vs {formatCurrency(data.previous.totalIncome, 'IDR')} last month
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Expenses</p>
              <div className="flex items-center gap-1">
                <span className={getExpenseClass(data.expensesChange)}>
                  {formatChange(data.expensesChange)}
                </span>
                {getChangeIndicator(data.expensesChange)}
              </div>
            </div>
            <p className="text-xl font-semibold">
              {formatCurrency(data.current.totalExpenses, 'IDR')}
            </p>
            <p className="text-xs text-muted-foreground">
              vs {formatCurrency(data.previous.totalExpenses, 'IDR')} last month
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Profit</p>
              <div className="flex items-center gap-1">
                <span className={getIncomeClass(data.profitChange)}>
                  {formatChange(data.profitChange)}
                </span>
                {getChangeIndicator(data.profitChange)}
              </div>
            </div>
            <p className="text-xl font-semibold">
              {formatCurrency(data.current.netProfit, 'IDR')}
            </p>
            <p className="text-xs text-muted-foreground">
              vs {formatCurrency(data.previous.netProfit, 'IDR')} last month
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Margin</p>
              <div className="flex items-center gap-1">
                <span className={getIncomeClass(data.marginChange)}>
                  {data.marginChange > 0 ? '+' : ''}
                  {data.marginChange.toFixed(1)}%
                </span>
                {getChangeIndicator(data.marginChange)}
              </div>
            </div>
            <p className="text-xl font-semibold">
              {data.current.profitMargin.toFixed(1)}%
            </p>
            <p className="text-xs text-muted-foreground">
              vs {data.previous.profitMargin.toFixed(1)}% last month
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}