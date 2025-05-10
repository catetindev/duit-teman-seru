
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatUtils';
import { ArrowDownRight, ArrowUpRight, PiggyBank } from 'lucide-react';

interface BusinessSummaryProps {
  totalIncome: number;
  totalExpenses: number;
  currency?: 'IDR' | 'USD';
}

export function BusinessSummary({ totalIncome, totalExpenses, currency = 'IDR' }: BusinessSummaryProps) {
  const profit = totalIncome - totalExpenses;
  const profitMargin = totalIncome > 0 ? (profit / totalIncome) * 100 : 0;
  
  return (
    <Card className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 border-amber-200 dark:border-amber-700">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="flex flex-col">
            <p className="text-sm text-muted-foreground font-medium">Net Profit</p>
            <div className="flex items-center gap-2">
              <h3 className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(profit, currency)}
              </h3>
              {profit >= 0 ? (
                <ArrowUpRight className="h-5 w-5 text-green-600" />
              ) : (
                <ArrowDownRight className="h-5 w-5 text-red-600" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Profit Margin: {profitMargin.toFixed(1)}%
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">Income</p>
              <p className="text-lg font-semibold text-green-600">
                {formatCurrency(totalIncome, currency)}
              </p>
            </div>
            
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">Expenses</p>
              <p className="text-lg font-semibold text-red-600">
                {formatCurrency(totalExpenses, currency)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
