
import React from 'react';
import { FinancialSummaryCards } from '@/components/finance/reports/FinancialSummaryCards';
import { FinanceSummary } from '@/types/finance';

interface ProfitLossSummaryProps {
  summary: FinanceSummary;
  loading: boolean;
}

export const ProfitLossSummary = ({ summary, loading }: ProfitLossSummaryProps) => {
  return (
    <div className="w-full">
      <FinancialSummaryCards 
        data={summary}
        loading={loading} 
      />
    </div>
  );
};
