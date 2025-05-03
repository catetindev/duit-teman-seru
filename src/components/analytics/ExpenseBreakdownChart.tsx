
import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { PieChart } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { 
  PieChart as RechartsPieChart,
  ResponsiveContainer, 
  Pie, 
  Cell,
  Tooltip, 
  Legend 
} from 'recharts';
import { Transaction } from '@/hooks/useDashboardData';

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658', '#ff8042', '#ff5252'];

interface CategoryExpense {
  name: string;
  value: number;
  color: string;
}

interface ExpenseBreakdownChartProps {
  transactions: Transaction[];
  isLoading: boolean;
}

export const ExpenseBreakdownChart: React.FC<ExpenseBreakdownChartProps> = ({ 
  transactions,
  isLoading
}) => {
  // Expense breakdown for pie chart
  const pieData = useMemo(() => {
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
    
    return Object.entries(expensesByCategory).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length]
    }));
  }, [transactions]);
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <PieChart className="w-5 h-5 mr-2" />
          Expense Breakdown
        </CardTitle>
        <CardDescription>By category</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : pieData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            <p>No expense data available for this period</p>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={45}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value, 'IDR'), 'Amount']} 
                />
                <Legend layout="vertical" verticalAlign="bottom" align="center" />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
