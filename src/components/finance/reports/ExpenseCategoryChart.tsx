import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ExpenseCategory } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatUtils';

interface ExpenseCategoryChartProps {
  data: ExpenseCategory[];
}

// Generate colors for chart
const COLORS = [
  '#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', 
  '#8b5cf6', '#ec4899', '#f97316', '#84cc16', '#14b8a6'
];

export function ExpenseCategoryChart({ data }: ExpenseCategoryChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-muted-foreground">No expense data available</p>
        </CardContent>
      </Card>
    );
  }

  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background p-3 border rounded-lg shadow-md">
          <p className="font-medium">{data.category}</p>
          <p className="text-sm">{formatCurrency(data.amount, 'IDR')}</p>
          <p className="text-xs text-muted-foreground">{data.percentage.toFixed(1)}% of expenses</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="amount"
                nameKey="category"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {data.map((category, index) => (
            <div key={category.category} className="flex items-center">
              <div 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <div className="flex justify-between w-full">
                <span className="text-xs truncate">{category.category}</span>
                <span className="text-xs font-medium">{category.percentage.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}