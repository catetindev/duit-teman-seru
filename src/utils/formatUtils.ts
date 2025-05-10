
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

// Format date to a readable string
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return '';
  
  // Format based on how recent the date is
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMinutes < 1) {
    return 'just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hr ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} days ago`;
  } else {
    // For older dates, format as MM/DD/YYYY
    return date.toLocaleDateString();
  }
};
