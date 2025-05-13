
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Calendar } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { 
  BarChart as RechartsBarChart,
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { formatCurrency } from '@/utils/formatUtils';
import { ChartContainer } from '@/components/ui/chart';

// Sample data - in a real app, this would come from the database
const sampleData = [
  { month: 'Jan', income: 5500000, expense: 3200000 },
  { month: 'Feb', income: 7200000, expense: 3800000 },
  { month: 'Mar', income: 6800000, expense: 4100000 },
  { month: 'Apr', income: 9100000, expense: 5200000 },
  { month: 'May', income: 8600000, expense: 4900000 },
  { month: 'Jun', income: 10200000, expense: 5500000 },
];

export function BusinessChart() {
  const [timeframe, setTimeframe] = useState<string>('6months');

  // In a real app, you would filter data based on the selected timeframe
  const chartData = sampleData;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <BarChart className="h-5 w-5" />
          Business Income vs. Expenses
        </CardTitle>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">Last 3 months</SelectItem>
            <SelectItem value="6months">Last 6 months</SelectItem>
            <SelectItem value="year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer 
            config={{ 
              income: { label: 'Income', color: '#f59e0b' },
              expense: { label: 'Expense', color: '#0ea5e9' }  
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `${value / 1000000}M`;
                    return `${value / 1000}K`;
                  }}
                />
                <Tooltip
                  formatter={(value: any) => [formatCurrency(value, 'IDR'), '']}
                />
                <Legend />
                <Bar dataKey="income" name="Income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="var(--color-expense)" radius={[4, 4, 0, 0]} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
