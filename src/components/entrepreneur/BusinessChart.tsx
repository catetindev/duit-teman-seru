import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, CalendarDays } from 'lucide-react'; // Changed BarChart to BarChart3 for a different look
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
import { MonthlyData } from '@/hooks/useEntrepreneurData'; // Import MonthlyData
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile hook

interface BusinessChartProps {
  data: MonthlyData[]; // Accept dynamic data
  loading: boolean;
}

export function BusinessChart({ data, loading }: BusinessChartProps) {
  const [timeframe, setTimeframe] = useState<string>('6months'); // Timeframe state can be kept for UI if needed
  const isMobile = useIsMobile(); // Use the hook to detect mobile

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-amber-500" />
            Business Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-slate-200 h-10 w-10"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                  <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (data.length === 0 && !loading) {
     return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-amber-500" />
            Business Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] flex items-center justify-center">
          <p className="text-muted-foreground">No data available for the chart.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4">
        <CardTitle className="text-lg font-medium flex items-center gap-2 mb-2 sm:mb-0">
          <BarChart3 className="h-5 w-5 text-amber-500" />
          Business Performance
        </CardTitle>
        {/* Timeframe select can be re-added if dynamic timeframe filtering is implemented in useEntrepreneurData */}
        {/* <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-full sm:w-[180px] h-9">
            <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">Last 3 months</SelectItem>
            <SelectItem value="6months">Last 6 months</SelectItem>
            <SelectItem value="year">This year</SelectItem>
          </SelectContent>
        </Select> */}
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ChartContainer 
            config={{ 
              income: { label: 'Income', color: 'hsl(var(--chart-1))' }, // Using Tailwind CSS variables for colors
              expense: { label: 'Expense', color: 'hsl(var(--chart-2))' }  
            }}
            className="[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart 
                data={data}
                margin={{
                  top: 5,
                  right: 10,
                  left: -10, // Adjust for YAxis labels
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    if (value >= 1000000) return `${value / 1000000}M`;
                    if (value >= 1000) return `${value / 1000}K`;
                    return value.toString();
                  }}
                />
                <Tooltip
                  cursorClassName="fill-muted/50"
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2.5 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Income
                              </span>
                              <span className="font-bold text-foreground">
                                {formatCurrency(payload[0].value as number, 'IDR')}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Expense
                              </span>
                              <span className="font-bold text-foreground">
                                {formatCurrency(payload[1].value as number, 'IDR')}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                {/* Adjust Legend layout based on screen size */}
                <Legend 
                  layout={isMobile ? 'vertical' : 'horizontal'} 
                  verticalAlign={isMobile ? 'middle' : 'top'} 
                  align={isMobile ? 'right' : 'center'} 
                  wrapperStyle={isMobile ? { right: 0, top: 0, transform: 'translate(20px, 0)' } : {}} // Adjust position slightly on mobile
                />
                <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}