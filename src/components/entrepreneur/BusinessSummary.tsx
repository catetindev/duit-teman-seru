import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatUtils';
import { ArrowDownRight, ArrowUpRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface BusinessSummaryProps {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  currency?: 'IDR' | 'USD';
}

export function BusinessSummary({ 
  totalIncome, 
  totalExpenses, 
  netProfit,
  currency = 'IDR' 
}: BusinessSummaryProps) {
  const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;
  
  return (
    <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/50 dark:to-orange-900/50 border-amber-200 dark:border-amber-700"> {/* Removed shadow-lg */}
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Net Profit */}
          <div className="flex flex-col items-center md:items-start p-4 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm">
            <div className="flex items-center text-sm text-muted-foreground font-medium mb-1">
              <DollarSign className="h-4 w-4 mr-1" />
              Net Profit
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(netProfit, currency)}
              </h3>
              {netProfit !== 0 && (
                netProfit >= 0 ? (
                  <ArrowUpRight className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <ArrowDownRight className="h-5 w-5 text-red-600 dark:text-red-400" />
                )
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Profit Margin: {profitMargin.toFixed(1)}%
            </p>
          </div>
          
          {/* Total Income */}
          <div className="flex flex-col items-center md:items-start p-4 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm">
            <div className="flex items-center text-sm text-muted-foreground font-medium mb-1">
              <TrendingUp className="h-4 w-4 mr-1 text-green-500" />
              Total Income
            </div>
            <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
              {formatCurrency(totalIncome, currency)}
            </p>
          </div>
          
          {/* Total Expenses */}
          <div className="flex flex-col items-center md:items-start p-4 bg-white/50 dark:bg-black/20 rounded-xl backdrop-blur-sm">
            <div className="flex items-center text-sm text-muted-foreground font-medium mb-1">
              <TrendingDown className="h-4 w-4 mr-1 text-red-500" />
              Total Expenses
            </div>
            <p className="text-2xl font-semibold text-red-600 dark:text-red-400">
              {formatCurrency(totalExpenses, currency)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}