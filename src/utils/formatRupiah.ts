
/**
 * Format number to Indonesian Rupiah
 * @param amount Number to format
 * @returns Formatted string (e.g., "Rp10.000")
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Parse formatted rupiah string back to number
 * @param rupiah Formatted rupiah string (e.g., "Rp10.000")
 * @returns Number value
 */
export function parseRupiah(rupiah: string): number {
  return Number(rupiah.replace(/[^\d]/g, ''));
}
