
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { IncomeExpenseChart } from './IncomeExpenseChart';
import { useIsMobile } from '@/hooks/use-mobile';

type TrendingChartProps = {
  data: any[];
};

export const TrendingChart = ({ data }: TrendingChartProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="text-sm sm:text-base md:text-lg">
          Financial Performance Trends
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          See how your business has performed over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 sm:p-4 md:p-6">
        <div className="w-full overflow-x-auto">
          <IncomeExpenseChart 
            data={data} 
            title="6-Month Financial Trend"
            height={isMobile ? 300 : 400}
          />
        </div>
      </CardContent>
    </Card>
  );
};
