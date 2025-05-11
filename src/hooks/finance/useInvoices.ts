
import { useState, useEffect } from 'react';
import { Invoice, InvoiceFormData } from '@/types/finance';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/formatUtils';

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch invoices with optional filters
  const fetchInvoices = async (status?: string) => {
    try {
      if (!user) return;
      setLoading(true);

      let query = supabase
        .from('invoices')
        .select(`
          *,
          customers(id, name, email, phone)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      // Apply status filter if provided
      if (status && status !== 'All') {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) throw error;

      setInvoices(data as any[]);
      return data;
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      toast({
        title: 'Error fetching invoices',
        description: error.message,
        variant: 'destructive'
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Generate a unique invoice number
  const generateInvoiceNumber = async () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const prefix = `INV-${year}${month}`;
    
    try {
      // Get the last invoice with this prefix
      const { data, error } = await supabase
        .from('invoices')
        .select('invoice_number')
        .like('invoice_number', `${prefix}%`)
        .order('invoice_number', { ascending: false })
        .limit(1);

      if (error) throw error;

      // Calculate the next number
      let nextNumber = 1;
      if (data && data.length > 0) {
        const lastNumber = parseInt(data[0].invoice_number.split('-')[2], 10);
        nextNumber = lastNumber + 1;
      }

      return `${prefix}-${nextNumber.toString().padStart(3, '0')}`;
    } catch (error) {
      console.error('Error generating invoice number:', error);
      // Fallback with random number if failed
      return `${prefix}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    }
  };

  // Add new invoice
  const addInvoice = async (invoiceData: InvoiceFormData) => {
    try {
      if (!user) return null;

      const newInvoice = {
        ...invoiceData,
        user_id: user.id,
        items: JSON.stringify(invoiceData.items),
        payment_due_date: invoiceData.payment_due_date.toISOString()
      };

      const { data, error } = await supabase
        .from('invoices')
        .insert(newInvoice)
        .select(`
          *, 
          customers(id, name, email, phone)
        `)
        .single();

      if (error) throw error;

      toast({
        title: 'Invoice created',
        description: `Invoice ${invoiceData.invoice_number} created successfully`,
      });

      // Update local state
      setInvoices(prev => [data as any, ...prev]);
      return data;
    } catch (error: any) {
      console.error('Error creating invoice:', error);
      toast({
        title: 'Error creating invoice',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    }
  };

  // Update invoice
  const updateInvoice = async (invoice: InvoiceFormData) => {
    try {
      if (!invoice.id) return null;

      const updatedInvoice = {
        ...invoice,
        items: JSON.stringify(invoice.items),
        payment_due_date: invoice.payment_due_date.toISOString()
      };

      const { data, error } = await supabase
        .from('invoices')
        .update(updatedInvoice)
        .eq('id', invoice.id)
        .select(`
          *, 
          customers(id, name, email, phone)
        `)
        .single();

      if (error) throw error;

      toast({
        title: 'Invoice updated',
        description: `Invoice ${invoice.invoice_number} updated successfully`,
      });

      // Update local state
      setInvoices(prev => prev.map(inv => inv.id === invoice.id ? (data as any) : inv));
      return data;
    } catch (error: any) {
      console.error('Error updating invoice:', error);
      toast({
        title: 'Error updating invoice',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    }
  };

  // Delete invoice
  const deleteInvoice = async (id: string) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Invoice deleted',
        description: 'The invoice was deleted successfully',
      });

      // Update local state
      setInvoices(prev => prev.filter(inv => inv.id !== id));
      return true;
    } catch (error: any) {
      console.error('Error deleting invoice:', error);
      toast({
        title: 'Error deleting invoice',
        description: error.message,
        variant: 'destructive'
      });
      return false;
    }
  };

  // Calculate invoice totals for reporting
  const calculateInvoiceTotals = (status?: string) => {
    const filteredInvoices = status 
      ? invoices.filter(inv => inv.status === status)
      : invoices;

    const total = filteredInvoices.reduce((acc, inv) => acc + Number(inv.total), 0);
    return { total, count: filteredInvoices.length };
  };

  // Load invoices when user changes
  useEffect(() => {
    if (user) {
      fetchInvoices();
    }
  }, [user]);

  return {
    invoices,
    loading,
    fetchInvoices,
    generateInvoiceNumber,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    calculateInvoiceTotals
  };
}
