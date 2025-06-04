
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ExpenseCategory } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/formatUtils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ExpenseCategoryChartProps {
  data: ExpenseCategory[];
}

// Generate colors for chart
const COLORS = [
  '#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', 
  '#8b5cf6', '#ec4899', '#f97316', '#84cc16', '#14b8a6'
];

export function ExpenseCategoryChart({ data }: ExpenseCategoryChartProps) {
  const isMobile = useIsMobile();

  if (data.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-sm sm:text-base lg:text-lg">Kategori Pengeluaran</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[250px] sm:h-[300px]">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3">💰</div>
            <p className="text-gray-500 text-xs sm:text-sm">Belum ada data pengeluaran</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-2 sm:p-3 border rounded-lg shadow-md">
          <p className="font-medium text-xs sm:text-sm">{data.category}</p>
          <p className="text-xs sm:text-sm">{formatCurrency(data.amount, 'IDR')}</p>
          <p className="text-xs text-gray-500">{data.percentage.toFixed(1)}% dari total</p>
        </div>
      );
    }
    return null;
  };

  const chartHeight = isMobile ? 200 : 250;
  const outerRadius = isMobile ? 70 : 90;
  const innerRadius = isMobile ? 40 : 50;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-sm sm:text-base lg:text-lg">Kategori Pengeluaran</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <div style={{ height: chartHeight }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                fill="#8884d8"
                paddingAngle={2}
                dataKey="amount"
                nameKey="category"
                label={isMobile ? false : ({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
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
        
        {/* Legend - Responsive Grid */}
        <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
          {data.map((category, index) => (
            <div key={category.category} className="flex items-center">
              <div 
                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-1 sm:mr-2 flex-shrink-0" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <div className="flex justify-between w-full min-w-0">
                <span className="text-xs truncate">{category.category}</span>
                <span className="text-xs font-medium ml-1 flex-shrink-0">
                  {category.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
