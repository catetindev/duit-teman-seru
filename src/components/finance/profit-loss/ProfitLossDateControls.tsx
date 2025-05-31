
import React from 'react';
import { DateRange } from 'react-day-picker';
import { DateRangeOptions } from '@/components/finance/reports/DateRangeOptions';

interface ProfitLossDateControlsProps {
  onSelect: (range: DateRange | undefined) => void;
}

export const ProfitLossDateControls = ({ onSelect }: ProfitLossDateControlsProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <DateRangeOptions onSelect={onSelect} />
    </div>
  );
};
