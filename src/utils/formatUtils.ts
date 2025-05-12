// This file already exists, so we'll append to it
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

// Format currency
export function formatCurrency(amount: number, currency: string = 'IDR'): string { // Default to IDR
  if (currency === 'IDR') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  // For other currencies, keep original behavior or define as needed
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency, // This will use the provided currency symbol
    minimumFractionDigits: 2, // Standard for USD, EUR etc.
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

// Calculate progress percentage
export function calculateProgress(saved: number, target: number): number {
  return Math.min(Math.round((saved / target) * 100), 100);
}