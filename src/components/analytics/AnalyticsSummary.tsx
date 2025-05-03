
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center text-green-700 dark:text-green-400">
            <TrendingUp className="w-4 h-4 mr-1" />
            Total Income
          </CardDescription>
          <CardTitle className="text-2xl text-green-700 dark:text-green-400">
            {formatCurrency(totalIncome, 'IDR')}
          </CardTitle>
        </CardHeader>
      </Card>
      
      <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center text-red-700 dark:text-red-400">
            <TrendingDown className="w-4 h-4 mr-1" />
            Total Expense
          </CardDescription>
          <CardTitle className="text-2xl text-red-700 dark:text-red-400">
            {formatCurrency(totalExpense, 'IDR')}
          </CardTitle>
        </CardHeader>
      </Card>
      
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center text-blue-700 dark:text-blue-400">
            <Calendar className="w-4 h-4 mr-1" />
            Balance
          </CardDescription>
          <CardTitle className={`text-2xl ${balance >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-red-700 dark:text-red-400'}`}>
            {formatCurrency(balance, 'IDR')}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
};
