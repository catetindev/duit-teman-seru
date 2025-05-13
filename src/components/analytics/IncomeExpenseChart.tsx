import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { ChartContainer } from '@/components/ui/chart';
import { 
  BarChart as RechartsBarChart,
  ResponsiveContainer, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from 'recharts';
import { Transaction } from '@/hooks/useDashboardData';
import { useLanguage } from '@/hooks/useLanguage'; // Import useLanguage

interface MonthlyData {
  name: string;
  income: number;
  expense: number;
}

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
  const { t } = useLanguage(); // Use the hook

  // Monthly data for bar chart
  const monthlyData = useMemo(() => {
    if (!transactions.length) return [];
    
    const data: Record<string, MonthlyData> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = timeframe === 'month' 
        ? `${date.getDate()}/${monthNames[date.getMonth()]}`
        : monthNames[date.getMonth()];
      
      if (!data[monthYear]) {
        data[monthYear] = { name: monthYear, income: 0, expense: 0 };
      }
      
      if (transaction.type === 'income') {
        data[monthYear].income += Number(transaction.amount);
      } else {
        data[monthYear].expense += Number(transaction.amount);
      }
    });
    
    return Object.values(data);
  }, [transactions, timeframe]);
  
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <BarChart className="w-5 h-5 mr-2" />
          Income vs Expense
        </CardTitle>
        <CardDescription>Comparison over time</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : monthlyData.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            <p>{t('transactions.noData')}</p> {/* Use translation key */}
          </div>
        ) : (
          <div className="h-[300px]">
            <ChartContainer 
              config={{ 
                income: { label: 'Income', color: '#22c55e' },
                expense: { label: 'Expense', color: '#ef4444' }  
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={monthlyData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => {
                      if (value >= 1000000) return `${value / 1000000}M`;
                      return `${value / 1000}K`;
                    }}
                  />
                  <Tooltip 
                    content={({active, payload}) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border rounded shadow-sm">
                            <p className="text-sm font-medium">{payload[0].payload.name}</p>
                            <p className="text-xs text-green-600">
                              Income: {formatCurrency(payload[0].value as number, 'IDR')}
                            </p>
                            <p className="text-xs text-red-600">
                              Expense: {formatCurrency(payload[1].value as number, 'IDR')}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expense" fill="var(--color-expense)" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};