
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FinanceSummary } from '@/types/finance';

type IncomeOverviewProps = {
  summary: FinanceSummary;
};

export const IncomeOverview = ({ summary }: IncomeOverviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          This section shows your income from all paid orders and invoices.
        </p>
        
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-2xl font-bold mb-2">
            {Intl.NumberFormat('id-ID', { 
              style: 'currency', 
              currency: 'IDR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(summary.totalIncome)}
          </p>
          <p className="text-muted-foreground">
            Total income for the selected period
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
