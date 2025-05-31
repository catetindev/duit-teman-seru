
import React from 'react';
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Legend, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface DataPoint {
  name: string;
  income: number;
  expenses: number;
  profit: number;
}

interface IncomeExpenseChartProps {
  data: DataPoint[];
  title?: string;
  height?: number;
}

export function IncomeExpenseChart({ 
  data, 
  title = "Income vs Expenses", 
  height = 350 
}: IncomeExpenseChartProps) {
  const isMobile = useIsMobile();
  
  // Adjust height for mobile
  const chartHeight = isMobile ? Math.min(height, 280) : height;
  
  if (data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm sm:text-base md:text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-3 sm:p-6" style={{ height: chartHeight }}>
          <p className="text-muted-foreground text-xs sm:text-sm">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 sm:p-3 border rounded-lg shadow-md max-w-[200px] sm:max-w-none">
          <p className="font-medium mb-1 text-xs sm:text-sm truncate">{label}</p>
          <div className="space-y-1">
            <p className="text-xs sm:text-sm flex items-center">
              <span className="w-2 h-2 sm:w-3 sm:h-3 inline-block mr-1 sm:mr-2 bg-emerald-500 rounded-full flex-shrink-0"></span>
              <span className="truncate">Income: {formatCurrency(payload[0].value, 'IDR')}</span>
            </p>
            <p className="text-xs sm:text-sm flex items-center">
              <span className="w-2 h-2 sm:w-3 sm:h-3 inline-block mr-1 sm:mr-2 bg-rose-500 rounded-full flex-shrink-0"></span>
              <span className="truncate">Expenses: {formatCurrency(payload[1].value, 'IDR')}</span>
            </p>
            <p className="text-xs sm:text-sm flex items-center">
              <span className="w-2 h-2 sm:w-3 sm:h-3 inline-block mr-1 sm:mr-2 bg-blue-500 rounded-full flex-shrink-0"></span>
              <span className="truncate">Profit: {formatCurrency(payload[2].value, 'IDR')}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="text-sm sm:text-base md:text-lg truncate">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 md:p-6">
        <div className="w-full overflow-x-auto">
          <div style={{ height: chartHeight, minWidth: isMobile ? '300px' : '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={data} 
                margin={{ 
                  top: 5, 
                  right: isMobile ? 10 : 30, 
                  left: isMobile ? 10 : 20, 
                  bottom: 5 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? 'end' : 'middle'}
                  height={isMobile ? 60 : 30}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: isMobile ? 10 : 12 }}
                  tickFormatter={(value) => {
                    if (isMobile) {
                      return value < 1000000 ? `${(value / 1000)}k` : `${(value / 1000000)}M`;
                    }
                    return value < 1000 ? value : `${(value / 1000)}k`;
                  }}
                  width={isMobile ? 40 : 60}
                />
                <Tooltip content={<CustomTooltip />} />
                {!isMobile && <Legend />}
                <Bar 
                  dataKey="income" 
                  name="Income" 
                  fill="#10b981" 
                  radius={[2, 2, 0, 0]} 
                  maxBarSize={isMobile ? 20 : 40} 
                />
                <Bar 
                  dataKey="expenses" 
                  name="Expenses" 
                  fill="#f43f5e" 
                  radius={[2, 2, 0, 0]} 
                  maxBarSize={isMobile ? 20 : 40} 
                />
                <Bar 
                  dataKey="profit" 
                  name="Profit" 
                  fill="#3b82f6" 
                  radius={[2, 2, 0, 0]} 
                  maxBarSize={isMobile ? 20 : 40} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {isMobile && (
          <div className="flex flex-wrap justify-center gap-2 mt-2 text-xs">
            <div className="flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-1"></span>
              <span>Income</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-rose-500 rounded-full mr-1"></span>
              <span>Expenses</span>
            </div>
            <div className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
              <span>Profit</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
