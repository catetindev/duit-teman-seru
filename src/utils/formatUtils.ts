
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a numeric value as currency
 */
export const formatCurrency = (value: number, currency = 'IDR'): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Format a date range for display
 */
export const formatDateRange = (from: Date, to: Date): string => {
  return `${format(from, 'dd MMM yyyy')} - ${format(to, 'dd MMM yyyy')}`;
};
