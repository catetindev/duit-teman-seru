
import { Invoice } from '@/types/finance';

export function useInvoiceAnalytics(invoices: Invoice[]) {
  // Calculate invoice totals for reporting
  const calculateInvoiceTotals = (status?: string) => {
    const filteredInvoices = status 
      ? invoices.filter(inv => inv.status === status)
      : invoices;

    const total = filteredInvoices.reduce((acc, inv) => acc + Number(inv.total), 0);
    return { total, count: filteredInvoices.length };
  };

  return {
    calculateInvoiceTotals
  };
}
