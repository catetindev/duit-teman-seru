
import React from 'react';
import { subDays, startOfMonth, endOfMonth } from 'date-fns';
import { Button } from '@/components/ui/button';
import { DateRange } from 'react-day-picker';

type DateRangeOption = {
  label: string;
  range: DateRange;
};

type DateRangeOptionsProps = {
  onSelect: (range: DateRange) => void;
};

export const DateRangeOptions = ({ onSelect }: DateRangeOptionsProps) => {
  // List of quick date range options
  const dateRangeOptions: DateRangeOption[] = [
    { label: 'Last 7 days', range: { from: subDays(new Date(), 7), to: new Date() } },
    { label: 'Last 30 days', range: { from: subDays(new Date(), 30), to: new Date() } },
    { label: 'This Month', range: { from: startOfMonth(new Date()), to: new Date() } },
    { label: 'Last Month', range: { 
      from: startOfMonth(new Date(new Date().getFullYear(), new Date().getMonth() - 1)), 
      to: endOfMonth(new Date(new Date().getFullYear(), new Date().getMonth() - 1)) 
    }}
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {dateRangeOptions.map((option, index) => (
        <Button 
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onSelect(option.range)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};
