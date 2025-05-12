import React from 'react';
import { TrendingDown, TrendingUp, ArrowRight, DollarSign } from 'lucide-react';
import { FinanceSummary } from '@/types/finance';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatUtils';

interface FinancialSummaryCardsProps {
  data: FinanceSummary;
  loading?: boolean;
  showWarning?: boolean;
}

export function FinancialSummaryCards({ 
  data,
  loading = false,
  showWarning = true
}: FinancialSummaryCardsProps) {
  const { totalIncome, totalExpenses, netProfit, profitMargin } = data;
  const isLoss = netProfit < 0;
  
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 w-24 bg-muted rounded mb-2"></div>
              <div className="h-8 w-32 bg-muted rounded mb-4"></div>
              <div className="h-4 w-16 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Total Income</p>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-1">
            <h3 className="text-2xl font-bold">{formatCurrency(totalIncome, 'IDR')}</h3>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Revenue from orders
          </p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Total Expenses</p>
            <TrendingDown className={`h-4 w-4 ${totalExpenses > totalIncome && showWarning ? 'text-destructive' : 'text-muted-foreground'}`} />
          </div>
          <div className="mt-1">
            <h3 className="text-2xl font-bold">{formatCurrency(totalExpenses, 'IDR')}</h3>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Cost of operations
          </p>
        </CardContent>
      </Card>

      <Card className={`overflow-hidden ${isLoss && showWarning ? 'border-destructive' : ''}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Net Profit</p>
            {isLoss ? (
              <TrendingDown className="h-4 w-4 text-destructive" />
            ) : (
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            )}
          </div>
          <div className="mt-1">
            <h3 className={`text-2xl font-bold ${isLoss ? 'text-destructive' : 'text-emerald-600 dark:text-emerald-500'}`}>
              {formatCurrency(netProfit, 'IDR')}
            </h3>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {isLoss ? 'Net Loss' : 'Net Profit'} (Income - Expenses)
          </p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground">Profit Margin</p>
            <ArrowRight className={`h-4 w-4 ${profitMargin < 0 && showWarning ? 'text-destructive' : 'text-muted-foreground'}`} />
          </div>
          <div className="mt-1">
            <h3 className={`text-2xl font-bold ${profitMargin < 0 && showWarning ? 'text-destructive' : ''}`}>
              {profitMargin.toFixed(1)}%
            </h3>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            (Net Profit / Income) × 100
          </p>
        </CardContent>
      </Card>
    </div>
  );
}