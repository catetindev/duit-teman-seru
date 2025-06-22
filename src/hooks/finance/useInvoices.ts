
import { useInvoiceQueries } from './invoice-queries/useInvoiceQueries';
import { useInvoiceMutations } from './invoice-queries/useInvoiceMutations';
import { useInvoiceNumberGenerator } from './invoice-queries/useInvoiceNumberGenerator';

export const useInvoices = () => {
  const {
    invoices,
    customers,
    products,
    loading,
    refetchInvoices
  } = useInvoiceQueries();

  const {
    addInvoice,
    updateInvoice,
    deleteInvoice,
    isAdding,
    isUpdating,
    isDeleting
  } = useInvoiceMutations();

  const { generateInvoiceNumber } = useInvoiceNumberGenerator();

  const fetchInvoices = (status?: string) => {
    refetchInvoices();
  };

  return {
    invoices,
    customers,
    products,
    loading,
    fetchInvoices,
    generateInvoiceNumber,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    isAdding,
    isUpdating,
    isDeleting,
  };
};
