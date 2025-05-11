
// This file already exists, so we'll append to it
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
}

// Format date
export function formatDate(date: Date): string {
  return format(date, 'MMM dd, yyyy');
}

// Format date range
export function formatDateRange(range: DateRange): string {
  if (!range.from) return '';
  if (!range.to) return `${format(range.from, 'MMM dd, yyyy')}`;
  return `${format(range.from, 'MMM dd, yyyy')} - ${format(range.to, 'MMM dd, yyyy')}`;
}
