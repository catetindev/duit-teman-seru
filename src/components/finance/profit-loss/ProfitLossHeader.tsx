
import React from 'react';
import { DateRange } from 'react-day-picker';
import { FinanceHeader } from '@/components/finance/reports/FinanceHeader';

interface ProfitLossHeaderProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onExportExcel: () => void;
  onExportPdf: () => void;
}

export const ProfitLossHeader = ({
  dateRange,
  onDateRangeChange,
  onExportExcel,
  onExportPdf
}: ProfitLossHeaderProps) => {
  return (
    <div className="w-full">
      <FinanceHeader
        title="Laporan Untung Rugi"
        subtitle="Track your income, expenses, and profitability over time"
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
        onExportExcel={onExportExcel}
        onExportPdf={onExportPdf}
      />
    </div>
  );
};
