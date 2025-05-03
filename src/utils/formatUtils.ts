
/**
 * Format currency for display
 * @param amount - The amount to format
 * @param currency - The currency code (IDR or USD)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency: 'IDR' | 'USD') => {
  return currency === 'IDR' 
    ? `Rp${amount.toLocaleString('id-ID')}` 
    : `$${amount.toLocaleString('en-US')}`;
};
