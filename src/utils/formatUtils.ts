
import { format } from 'date-fns';

export const formatCurrency = (amount: number, currency = 'IDR') => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const calculateProgress = (current: number, target: number): number => {
  if (target <= 0) return 0;
  const progress = (current / target) * 100;
  return progress > 100 ? 100 : progress;
};

export const formatDate = (date: Date): string => {
  return format(date, 'dd MMM yyyy');
};
