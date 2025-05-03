import React, { useMemo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '@/utils/formatUtils';

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

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface TransactionChartProps {
  transactions: Transaction[];
}

const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#8DD1E1', '#EA80FC', '#607D8B'];

const TransactionChart: React.FC<TransactionChartProps> = ({ transactions }) => {
  const { t } = useLanguage();
  
  const chartData = useMemo(() => {
    // Filter only expenses
    const expenses = transactions.filter(t => t.type === 'expense');
    
    if (expenses.length === 0) return [];
    
    // Group by category
    const categoryMap = new Map<string, number>();
    
    expenses.forEach(transaction => {
      const { category, amount } = transaction;
      const currentAmount = categoryMap.get(category) || 0;
      categoryMap.set(category, currentAmount + Number(amount));
    });
    
    // Convert to chart data
    const data: ChartData[] = [];
    let colorIndex = 0;
    
    categoryMap.forEach((value, name) => {
      data.push({
        name,
        value,
        color: COLORS[colorIndex % COLORS.length]
      });
      colorIndex++;
    });
    
    return data;
  }, [transactions]);
  
  if (transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Grafik Transaksi Kamu</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-muted-foreground text-center">
            {t('transactions.noData')}
          </p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Grafik Transaksi Kamu</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value, 'IDR')} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionChart;
