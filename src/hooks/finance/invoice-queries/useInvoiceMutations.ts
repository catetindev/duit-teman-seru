
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Invoice } from '@/types/finance';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useInvoiceMutations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addInvoiceMutation = useMutation({
    mutationFn: async (invoiceData: Omit<Invoice, 'id' | 'created_at' | 'user_id'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      console.log('=== MUTATION START ===');
      console.log('Invoice data received:', invoiceData);

      const completeInvoiceData = {
        invoice_number: invoiceData.invoice_number,
        customer_id: invoiceData.customer_id,
        items: JSON.stringify(invoiceData.items),
        subtotal: Number(invoiceData.subtotal),
        tax: Number(invoiceData.tax) || 0,
        discount: Number(invoiceData.discount) || 0,
        total: Number(invoiceData.total),
        status: invoiceData.status || 'Unpaid',
        payment_due_date: invoiceData.payment_due_date,
        payment_method: invoiceData.payment_method,
        payment_proof_url: invoiceData.payment_proof_url || null,
        notes: invoiceData.notes || null,
        user_id: user.id
      };

      console.log('Complete data for Supabase:', completeInvoiceData);

      const { data, error } = await supabase
        .from('invoices')
        .insert(completeInvoiceData)
        .select()
        .single();

      if (error) {
        console.error('=== SUPABASE ERROR ===', error);
        throw new Error(error.message || 'Failed to create invoice');
      }
      
      console.log('=== SUCCESS ===', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      console.log('Invoice created and queries invalidated');
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create invoice',
        variant: 'destructive'
      });
    },
  });

  const updateInvoiceMutation = useMutation({
    mutationFn: async (invoiceData: Partial<Invoice> & { id: string }) => {
      const { id, ...updateData } = invoiceData;
      
      const completeUpdateData = {
        ...updateData,
        items: updateData.items ? JSON.stringify(updateData.items) : undefined,
        subtotal: updateData.subtotal ? Number(updateData.subtotal) : undefined,
        tax: updateData.tax ? Number(updateData.tax) : undefined,
        discount: updateData.discount ? Number(updateData.discount) : undefined,
        total: updateData.total ? Number(updateData.total) : undefined
      };

      const { data, error } = await supabase
        .from('invoices')
        .update(completeUpdateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message || 'Failed to update invoice');
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update invoice',
        variant: 'destructive'
      });
    },
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: async (invoiceId: string) => {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoiceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete invoice",
        variant: "destructive",
      });
    },
  });

  return {
    addInvoice: addInvoiceMutation.mutate,
    updateInvoice: updateInvoiceMutation.mutate,
    deleteInvoice: deleteInvoiceMutation.mutate,
    isAdding: addInvoiceMutation.isPending,
    isUpdating: updateInvoiceMutation.isPending,
    isDeleting: deleteInvoiceMutation.isPending,
  };
};
