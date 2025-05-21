
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date | DateRange | undefined;
  onSelect: (date: Date | DateRange | undefined) => void;
  className?: string;
  preText?: string;
  placeholder?: string;
}

export function DatePicker({ 
  date, 
  onSelect, 
  className, 
  preText = "",
  placeholder = "Pick a date"
}: DatePickerProps) {
  // Determine if we're dealing with a DateRange or a single Date
  const isDateRange = date && typeof date === 'object' && 'from' in date;
  
  // Determine what text to display on the button
  const buttonText = React.useMemo(() => {
    if (!date) return placeholder;
    
    if (isDateRange) {
      const range = date as DateRange;
      if (range.from) {
        if (range.to) {
          return `${format(range.from, "MMM d, yyyy")} - ${format(range.to, "MMM d, yyyy")}`;
        }
        return format(range.from, "MMM d, yyyy");
      }
      return placeholder;
    } 
    
    return format(date as Date, "PPP");
  }, [date, isDateRange, placeholder]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {preText && <span className="mr-1">{preText}</span>}
          <span>{buttonText}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode={isDateRange ? "range" : "single"}
          selected={date}
          onSelect={onSelect}
          initialFocus
          numberOfMonths={isDateRange ? 2 : 1}
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}
