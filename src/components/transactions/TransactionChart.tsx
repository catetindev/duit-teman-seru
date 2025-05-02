
import React, { useMemo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  currency: 'IDR' | 'USD';
  category: string;
  description: string;
  date: string;
  icon?: string;
}

interface TransactionChartProps {
  transactions: Transaction[];
}

const TransactionChart = ({ transactions }: TransactionChartProps) => {
  const { t } = useLanguage();
  
  const categoryColors: Record<string, string> = {
    'food': '#FF9F7A',
    'shopping': '#7AD0FF',
    'entertainment': '#C07AFF',
    'bills': '#FFE07A',
    'salary': '#7AFF9F',
    'transport': '#FF7AC0',
    'health': '#7AFFFF',
    'education': '#D0FF7A',
    'other': '#A0A0A0'
  };
  
  const chartData = useMemo(() => {
    // Only process expense transactions
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    // Group by category
    const categories = expenseTransactions.reduce((acc: Record<string, number>, transaction) => {
      const { category, amount } = transaction;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += Number(amount);
      return acc;
    }, {});
    
    // Convert to format expected by Recharts
    return Object.entries(categories).map(([name, value]) => ({
      name,
      value,
      color: categoryColors[name.toLowerCase()] || '#A0A0A0'
    }));
  }, [transactions]);
  
  // For the empty state
  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('transactions.spendingBreakdown')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-muted-foreground text-center">
            No expense data to show yet
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('transactions.spendingBreakdown')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name }) => name}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}`, 'Amount']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {chartData.map((entry, index) => (
            <div key={`legend-${index}`} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-xs truncate">{entry.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionChart;
