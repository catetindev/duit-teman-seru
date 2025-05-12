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
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center" style={{ height }}>
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-lg shadow-md">
          <p className="font-medium mb-1">{label}</p>
          <div className="space-y-1">
            <p className="text-sm flex items-center">
              <span className="w-3 h-3 inline-block mr-2 bg-emerald-500 rounded-full"></span>
              Income: {formatCurrency(payload[0].value, 'IDR')}
            </p>
            <p className="text-sm flex items-center">
              <span className="w-3 h-3 inline-block mr-2 bg-rose-500 rounded-full"></span>
              Expenses: {formatCurrency(payload[1].value, 'IDR')}
            </p>
            <p className="text-sm flex items-center">
              <span className="w-3 h-3 inline-block mr-2 bg-blue-500 rounded-full"></span>
              Profit: {formatCurrency(payload[2].value, 'IDR')}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                tickFormatter={(value) => `${value < 1000 ? value : `${(value / 1000)}k`}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
              <Bar dataKey="profit" name="Profit" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}