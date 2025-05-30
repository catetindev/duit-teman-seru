import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Calendar, Download } from 'lucide-react';
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
import { useBusinessChartData } from '@/hooks/entrepreneur/useBusinessChartData';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export function BusinessChart() {
  const { chartData, loading, timeframe, setTimeframe } = useBusinessChartData();

  return (
    <Card className="border-0 shadow-md overflow-hidden bg-white dark:bg-gray-800">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <BarChart className="h-5 w-5 text-amber-500" />
          Business Income vs. Expenses
        </CardTitle>
        <div className="flex items-center gap-2">
          <Select value={timeframe} onValueChange={setTimeframe}>
            <SelectTrigger className="w-[180px] bg-muted/40">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 months</SelectItem>
              <SelectItem value="6months">Last 6 months</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {loading ? (
          <div className="h-[400px] flex items-center justify-center">
            <Skeleton className="h-[360px] w-full" />
          </div>
        ) : chartData.length > 0 ? (
          <div className="h-[400px]">
            <ChartContainer 
              config={{ 
                income: { label: 'Income', color: '#10b981' },
                expense: { label: 'Expense', color: '#3b82f6' }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="month" 
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
                    formatter={(value: any) => [formatCurrency(value, 'IDR'), '']}
                    contentStyle={{ 
                      borderRadius: '6px', 
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
                      border: '1px solid #e5e7eb',
                      padding: '8px 12px'
                    }}
                  />
                  <Legend iconType="circle" iconSize={8} />
                  <Bar 
                    dataKey="income" 
                    name="Income" 
                    fill="var(--color-income)" 
                    radius={[4, 4, 0, 0]} 
                    barSize={24}
                    animationDuration={1000}
                  />
                  <Bar 
                    dataKey="expense" 
                    name="Expense" 
                    fill="var(--color-expense)" 
                    radius={[4, 4, 0, 0]} 
                    barSize={24}
                    animationDuration={1000}
                    animationBegin={300}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        ) : (
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-center">
              <BarChart className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">No data available for the selected timeframe</p>
              <Button variant="outline" className="mt-4">
                Add transactions to see your chart
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
