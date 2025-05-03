
// Helper function to validate currency
export const validateCurrency = (currency: string): 'IDR' | 'USD' => {
  return currency === 'USD' ? 'USD' : 'IDR'; // Default to IDR if not USD
};

// Format currency for display
export const formatCurrency = (amount: number, currency: 'IDR' | 'USD') => {
  return currency === 'IDR' 
    ? `Rp${amount.toLocaleString('id-ID')}` 
    : `$${amount.toLocaleString('en-US')}`;
};

// Calculate progress percentage
export const calculateProgress = (saved: number, target: number) => {
  return Math.min(Math.round((saved / target) * 100), 100);
};
