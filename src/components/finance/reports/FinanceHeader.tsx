
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
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  return (
    <div className="w-full space-y-3 sm:space-y-4">
      {/* Title Section */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight truncate">
          {title}
        </h1>
        <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
          {subtitle}
        </p>
      </div>
      
      {/* Controls Section - Stack on mobile, inline on desktop */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <DatePickerWithRange 
            date={dateRange} 
            onDateChange={onDateRangeChange}
            className="w-full sm:w-auto"
          />
        </div>
        
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className={`gap-1 ${isMobile ? 'w-full' : 'w-auto'} h-9 sm:h-10`}
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Export</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-48 bg-white dark:bg-gray-800 border shadow-lg z-50"
            >
              <DropdownMenuItem 
                onClick={onExportExcel} 
                className="cursor-pointer text-xs sm:text-sm"
              >
                <FileSpreadsheet className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span>Export as Excel</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onExportPdf} 
                className="cursor-pointer text-xs sm:text-sm"
              >
                <FileText className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span>Export as PDF</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};
