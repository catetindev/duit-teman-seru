
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChartData {
  name: string;
  income: number;
  expenses: number;
  profit: number;
}

interface IncomeExpenseChartProps {
  data: ChartData[];
  title?: string;
  height?: number;
}

const chartConfig = {
  income: {
    label: "Pendapatan",
    color: "#10b981",
  },
  expenses: {
    label: "Pengeluaran", 
    color: "#ef4444",
  },
  profit: {
    label: "Laba",
    color: "#3b82f6",
  },
}

export const IncomeExpenseChart = ({ data, title = "Income vs Expenses", height = 350 }: IncomeExpenseChartProps) => {
  const isMobile = useIsMobile();
  
  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="text-sm sm:text-base lg:text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px] sm:h-[250px] lg:h-[300px]">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3">📊</div>
            <p className="text-gray-500 text-xs sm:text-sm">Belum ada data untuk ditampilkan</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border border-gray-200">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-4 lg:p-6">
        <ChartContainer config={chartConfig} className="w-full">
          <ResponsiveContainer width="100%" height={height}>
            <BarChart 
              data={data} 
              margin={{ 
                top: 20, 
                right: isMobile ? 10 : 30, 
                left: isMobile ? 10 : 20, 
                bottom: 5 
              }}
              barCategoryGap={isMobile ? "20%" : "30%"}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: isMobile ? 10 : 12 }}
                stroke="#64748b"
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? "end" : "middle"}
                height={isMobile ? 60 : 30}
              />
              <YAxis 
                tick={{ fontSize: isMobile ? 10 : 12 }}
                stroke="#64748b"
                width={isMobile ? 40 : 60}
                tickFormatter={(value) => {
                  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                  return value.toString();
                }}
              />
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value: number) => [
                  new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(value),
                  undefined
                ]}
              />
              <Bar 
                dataKey="income" 
                fill="var(--color-income)" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={isMobile ? 30 : 50}
              />
              <Bar 
                dataKey="expenses" 
                fill="var(--color-expenses)" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={isMobile ? 30 : 50}
              />
              <Bar 
                dataKey="profit" 
                fill="var(--color-profit)" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={isMobile ? 30 : 50}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
