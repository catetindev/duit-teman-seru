
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatUtils';
import { ArrowDownRight, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useBusinessSummary } from '@/hooks/entrepreneur/useBusinessSummary';
import { Skeleton } from '@/components/ui/skeleton';

interface BusinessSummaryProps {
  currency?: 'IDR' | 'USD';
}

export function BusinessSummary({ currency = 'IDR' }: BusinessSummaryProps) {
  const { totalIncome, totalExpenses, netProfit, profitMargin, loading } = useBusinessSummary();
  
  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 border-amber-200 dark:border-amber-700 overflow-hidden shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 justify-between">
            <Skeleton className="h-20 w-[250px]" />
            <div className="flex gap-6">
              <Skeleton className="h-16 w-[120px]" />
              <Skeleton className="h-16 w-[120px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 border-amber-200 dark:border-amber-700 overflow-hidden shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6 justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              {netProfit >= 0 ? (
                <TrendingUp className="h-5 w-5 text-green-600" />
              ) : (
                <TrendingDown className="h-5 w-5 text-red-600" />
              )}
              <p className="text-sm font-medium text-muted-foreground">Business Performance</p>
            </div>
            <div className="flex items-center gap-3">
              <h3 className={`text-3xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(netProfit, currency)}
              </h3>
              {netProfit >= 0 ? (
                <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full flex items-center">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  Profit
                </div>
              ) : (
                <div className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full flex items-center">
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                  Loss
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Profit Margin: <span className={`font-medium ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>{profitMargin.toFixed(1)}%</span>
            </p>
          </div>
          
          <div className="flex gap-6">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground mb-1">Income</p>
              <div className="flex items-center">
                <p className="text-xl font-semibold text-green-600">
                  {formatCurrency(totalIncome, currency)}
                </p>
                <ArrowUpRight className="h-4 w-4 text-green-600 ml-1" />
              </div>
            </div>
            
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground mb-1">Expenses</p>
              <div className="flex items-center">
                <p className="text-xl font-semibold text-red-600">
                  {formatCurrency(totalExpenses, currency)}
                </p>
                <ArrowDownRight className="h-4 w-4 text-red-600 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
