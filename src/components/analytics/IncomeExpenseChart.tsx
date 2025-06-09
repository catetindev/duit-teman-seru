
import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart, Calendar } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { 
  BarChart as RechartsBarChart,
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Bar
} from 'recharts';
import { Transaction } from '@/hooks/useDashboardData';
import { useLanguage } from '@/hooks/useLanguage';

interface IncomeExpenseChartProps {
  transactions: Transaction[];
  timeframe: 'month' | 'quarter' | 'year';
  isLoading: boolean;
}

export const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({ 
  transactions,
  timeframe,
  isLoading
}) => {
  const { t } = useLanguage();

  // Process data for bar chart
  const chartData = useMemo(() => {
    if (!transactions.length) return [];
    
    // Group transactions by month
    const monthlyData: Record<string, { income: number; expense: number }> = {};
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = date.toLocaleDateString('id-ID', { 
        month: 'short', 
        year: '2-digit' 
      });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { income: 0, expense: 0 };
      }
      
      if (transaction.type === 'income') {
        monthlyData[monthKey].income += Number(transaction.amount);
      } else {
        monthlyData[monthKey].expense += Number(transaction.amount);
      }
    });
    
    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      income: data.income,
      expense: data.expense
    }));
  }, [transactions]);
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base md:text-lg flex items-center">
          <BarChart className="w-5 h-5 mr-2 flex-shrink-0" />
          Income vs Expense
        </CardTitle>
        <CardDescription className="text-sm">
          Comparison over time
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 md:p-6">
        {isLoading ? (
          <div className="h-[250px] md:h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-[250px] md:h-[300px] flex items-center justify-center">
            <div className="text-center">
              <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No data available</p>
            </div>
          </div>
        ) : (
          <div className="h-[250px] md:h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  stroke="#64748b"
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="#64748b"
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                    return value.toString();
                  }}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    formatCurrency(value, 'IDR'),
                    name === 'income' ? 'Income' : 'Expense'
                  ]}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="income" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]} 
                  name="Income"
                />
                <Bar 
                  dataKey="expense" 
                  fill="#ef4444" 
                  radius={[4, 4, 0, 0]} 
                  name="Expense"
                />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
