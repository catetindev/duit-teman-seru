
import React from 'react';
import { Download, FileSpreadsheet, FileText } from 'lucide-react';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

type FinanceHeaderProps = {
  title: string;
  subtitle: string;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onExportExcel: () => void;
  onExportPdf: () => void;
};

export const FinanceHeader = ({
  title,
  subtitle,
  dateRange,
  onDateRangeChange,
  onExportExcel,
  onExportPdf
}: FinanceHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{subtitle}</p>
      </div>
      
      <div className="flex items-center gap-2">
        <DatePickerWithRange 
          date={dateRange} 
          onDateChange={onDateRangeChange} 
        />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1">
              <Download className="h-4 w-4 mr-1" /> Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={onExportExcel} className="cursor-pointer">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              <span>Export as Excel</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportPdf} className="cursor-pointer">
              <FileText className="mr-2 h-4 w-4" />
              <span>Export as PDF</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
