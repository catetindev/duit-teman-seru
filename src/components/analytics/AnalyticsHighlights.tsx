
import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatUtils';
import { Transaction } from '@/hooks/useDashboardData';

interface TopSpendingCategory {
  category: string;
  amount: number;
  icon: string;
}

interface HighestSpendingDay {
  date: Date;
  amount: number;
  count: number;
}

interface AnalyticsHighlightsProps {
  transactions: Transaction[];
}

export const AnalyticsHighlights: React.FC<AnalyticsHighlightsProps> = ({ transactions }) => {
  const categoryIcons: Record<string, string> = {
    'food': '🍔',
    'transport': '🚗',
    'entertainment': '🎬',
    'shopping': '🛍️',
    'bills': '📄',
    'housing': '🏠',
    'health': '🏥',
    'education': '🎓',
    'travel': '✈️',
    'other': '📦'
  };
  
  // Top spending categories
  const topSpendingCategories = useMemo(() => {
    if (!transactions.length) return [];
    
    const expensesByCategory: Record<string, number> = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const category = transaction.category;
        if (!expensesByCategory[category]) {
          expensesByCategory[category] = 0;
        }
        expensesByCategory[category] += Number(transaction.amount);
      });
    
    return Object.entries(expensesByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, amount]) => ({
        category,
        amount,
        icon: categoryIcons[category.toLowerCase()] || '📊'
      }));
  }, [transactions]);
  
  // Day with highest spending
  const highestSpendingDay = useMemo(() => {
    if (!transactions.length) return null;
    
    const expensesByDay: Record<string, { total: number, count: number, date: Date }> = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const day = transaction.date;
        if (!expensesByDay[day]) {
          expensesByDay[day] = { total: 0, count: 0, date: new Date(day) };
        }
        expensesByDay[day].total += Number(transaction.amount);
        expensesByDay[day].count++;
      });
    
    const highestDay = Object.values(expensesByDay)
      .sort((a, b) => b.total - a.total)[0];
    
    if (!highestDay) return null;
    
    return {
      date: highestDay.date,
      amount: highestDay.total,
      count: highestDay.count
    };
  }, [transactions]);
  
  // Average expense per day
  const averageDailyExpense = useMemo(() => {
    if (!transactions.length) return 0;
    
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    if (!expenseTransactions.length) return 0;
    
    const totalExpense = expenseTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
    const days = new Set(expenseTransactions.map(t => t.date)).size;
    return days > 0 ? totalExpense / days : 0;
  }, [transactions]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Highlights</CardTitle>
        <CardDescription>Key insights from your financial data</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Top Spending Categories */}
          <div>
            <h3 className="text-sm font-medium mb-2">Top Spending Categories</h3>
            {topSpendingCategories.length > 0 ? (
              <div className="space-y-3">
                {topSpendingCategories.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.category}</span>
                    </div>
                    <span className="font-medium">{formatCurrency(item.amount, 'IDR')}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 bg-muted rounded-md text-center">
                <p>No data available</p>
              </div>
            )}
          </div>
          
          {/* Highest Spending Day */}
          <div>
            <h3 className="text-sm font-medium mb-2">Highest Spending Day</h3>
            {highestSpendingDay ? (
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm">
                  {highestSpendingDay.date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'short'
                  })}
                </p>
                <p className="font-medium text-lg mt-1">
                  {formatCurrency(highestSpendingDay.amount, 'IDR')}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {highestSpendingDay.count} transactions
                </p>
              </div>
            ) : (
              <div className="p-3 bg-muted rounded-md text-center">
                <p>No data available</p>
              </div>
            )}
          </div>
          
          {/* Transaction Stats */}
          <div>
            <h3 className="text-sm font-medium mb-2">Transaction Stats</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 bg-muted rounded-md">
                <p className="text-xs text-muted-foreground">Transactions</p>
                <p className="font-medium text-lg">{transactions.length}</p>
              </div>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-xs text-muted-foreground">Avg Per Day</p>
                <p className="font-medium text-lg">
                  {formatCurrency(averageDailyExpense, 'IDR')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
