
// Format currency with proper locale and currency symbol
export const formatCurrency = (amount: number, currency: 'IDR' | 'USD' = 'IDR'): string => {
  if (isNaN(amount)) return `0`;
  
  try {
    if (currency === 'IDR') {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);
    }
  } catch (error) {
    // Fallback formatting if Intl is not supported
    if (currency === 'IDR') {
      return `Rp ${amount.toLocaleString()}`;
    } else {
      return `$${amount.toLocaleString()}`;
    }
  }
};

// Calculate progress percentage
export const calculateProgress = (current: number, target: number): number => {
  if (target <= 0) return 0;
  const progress = (current / target) * 100;
  return Math.min(100, Math.round(progress));
};
