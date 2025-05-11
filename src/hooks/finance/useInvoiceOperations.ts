
import { useState } from 'react';
import { Invoice, InvoiceFormData } from '@/types/finance';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useInvoiceOperations(setInvoices: (invoices: Invoice[]) => void) {
  const { toast } = useToast();
  const [operationLoading, setOperationLoading] = useState(false);

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
  const addInvoice = async (userId: string, invoiceData: InvoiceFormData) => {
    try {
      setOperationLoading(true);
      if (!userId) return null;

      const newInvoice = {
        ...invoiceData,
        user_id: userId,
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
    } finally {
      setOperationLoading(false);
    }
  };

  // Update invoice
  const updateInvoice = async (invoice: InvoiceFormData) => {
    try {
      setOperationLoading(true);
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
    } finally {
      setOperationLoading(false);
    }
  };

  // Delete invoice
  const deleteInvoice = async (id: string) => {
    try {
      setOperationLoading(true);
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
    } finally {
      setOperationLoading(false);
    }
  };

  return {
    operationLoading,
    generateInvoiceNumber,
    addInvoice,
    updateInvoice,
    deleteInvoice
  };
}
