
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useInvoicesFetch } from './useInvoicesFetch';
import { useInvoiceOperations } from './useInvoiceOperations';
import { useInvoiceAnalytics } from './useInvoiceAnalytics';

export function useInvoices() {
  const { user } = useAuth();
  const { invoices, loading, setInvoices, fetchInvoices } = useInvoicesFetch();
  const { operationLoading, generateInvoiceNumber, addInvoice, updateInvoice, deleteInvoice } = 
    useInvoiceOperations(setInvoices);
  const { calculateInvoiceTotals } = useInvoiceAnalytics(invoices);

  // Wrap fetchInvoices with user context
  const fetchUserInvoices = async (status?: string) => {
    return user ? await fetchInvoices(user.id, status) : [];
  };

  // Wrap addInvoice with user context
  const addUserInvoice = async (data: any) => {
    return user ? await addInvoice(user.id, data) : null;
  };

  // Load invoices when user changes
  useEffect(() => {
    if (user) {
      fetchUserInvoices();
    }
  }, [user]);

  return {
    invoices,
    loading: loading || operationLoading,
    fetchInvoices: fetchUserInvoices,
    generateInvoiceNumber,
    addInvoice: addUserInvoice,
    updateInvoice,
    deleteInvoice,
    calculateInvoiceTotals
  };
}
