
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
import { useLanguage } from '@/hooks/useLanguage';

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
  const { t } = useLanguage();

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
    
    return Object.entries(expensesByCategory)
      .map(([name, value], index) => ({
        name,
        value,
        color: COLORS[index % COLORS.length]
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-md text-sm">
          <p className="font-medium">{data.name}</p>
          <p className="text-blue-600">{formatCurrency(data.value, 'IDR')}</p>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base md:text-lg flex items-center">
          <PieChart className="w-5 h-5 mr-2 flex-shrink-0" />
          Expense Breakdown
        </CardTitle>
        <CardDescription className="text-sm">
          By category
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 md:p-6">
        {isLoading ? (
          <div className="h-[250px] md:h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : pieData.length === 0 ? (
          <div className="h-[250px] md:h-[300px] flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No expense data available</p>
            </div>
          </div>
        ) : (
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  layout="vertical" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
