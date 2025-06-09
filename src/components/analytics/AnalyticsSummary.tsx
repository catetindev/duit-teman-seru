
import React, { useMemo } from 'react';
import { Card, CardHeader, CardDescription, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { Transaction } from '@/hooks/useDashboardData';

interface AnalyticsSummaryProps {
  transactions: Transaction[];
}

export const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({ transactions }) => {
  // Calculate summary values
  const { totalIncome, totalExpense, balance } = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense
    };
  }, [transactions]);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 w-full">
      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
        <CardHeader className="pb-3">
          <CardDescription className="flex items-center text-green-700 dark:text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-2 flex-shrink-0" />
            Total Income
          </CardDescription>
          <CardTitle className="text-xl md:text-2xl text-green-700 dark:text-green-400 break-all">
            {formatCurrency(totalIncome, 'IDR')}
          </CardTitle>
        </CardHeader>
      </Card>
      
      <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200 dark:border-red-800">
        <CardHeader className="pb-3">
          <CardDescription className="flex items-center text-red-700 dark:text-red-400 text-sm">
            <TrendingDown className="w-4 h-4 mr-2 flex-shrink-0" />
            Total Expense
          </CardDescription>
          <CardTitle className="text-xl md:text-2xl text-red-700 dark:text-red-400 break-all">
            {formatCurrency(totalExpense, 'IDR')}
          </CardTitle>
        </CardHeader>
      </Card>
      
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800 sm:col-span-2 xl:col-span-1">
        <CardHeader className="pb-3">
          <CardDescription className="flex items-center text-blue-700 dark:text-blue-400 text-sm">
            <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
            Balance
          </CardDescription>
          <CardTitle className={`text-xl md:text-2xl break-all ${balance >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-red-700 dark:text-red-400'}`}>
            {formatCurrency(balance, 'IDR')}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};
