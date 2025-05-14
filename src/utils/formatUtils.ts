
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date for display
 * @param date Date to format
 * @param formatString Optional format string
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, formatString: string = "dd MMM yyyy"): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, formatString);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid date";
  }
}

/**
 * Formats a date range for display
 * @param startDate Start date
 * @param endDate End date
 * @returns Formatted date range string
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  try {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  } catch (error) {
    console.error("Error formatting date range:", error);
    return "Invalid date range";
  }
}

/**
 * Calculates progress percentage
 * @param current Current amount
 * @param target Target amount
 * @returns Progress as a percentage (0-100)
 */
export function calculateProgress(current: number, target: number): number {
  if (target <= 0) return 0;
  const progress = (current / target) * 100;
  return Math.min(100, Math.max(0, progress)); // Clamp between 0 and 100
}

/**
 * Format currency for display
 * @param amount Amount to format
 * @param currency Currency code (default: 'IDR')
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'IDR'): string {
  try {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return `${amount}`;
  }
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param date Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true, locale: id });
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return "Unknown time";
  }
}
