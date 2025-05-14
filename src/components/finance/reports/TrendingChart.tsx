
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { IncomeExpenseChart } from './IncomeExpenseChart';

type TrendingChartProps = {
  data: any[];
};

export const TrendingChart = ({ data }: TrendingChartProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Performance Trends</CardTitle>
        <CardDescription>
          See how your business has performed over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <IncomeExpenseChart 
          data={data} 
          title="6-Month Financial Trend"
          height={400}
        />
      </CardContent>
    </Card>
  );
};
