
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
      if (!user?.id) {
        console.error('No user ID in mutation');
        throw new Error('User not authenticated');
      }

      console.log('=== MUTATION EXECUTION ===');
      console.log('User ID:', user.id);
      console.log('Invoice data received in mutation:', invoiceData);

      // Ensure all required fields are present with correct types
      const completeInvoiceData = {
        invoice_number: String(invoiceData.invoice_number),
        customer_id: String(invoiceData.customer_id),
        items: JSON.stringify(invoiceData.items || []),
        subtotal: Number(invoiceData.subtotal) || 0,
        tax: Number(invoiceData.tax) || 0,
        discount: Number(invoiceData.discount) || 0,
        total: Number(invoiceData.total) || 0,
        status: String(invoiceData.status || 'Unpaid'),
        payment_due_date: String(invoiceData.payment_due_date),
        payment_method: String(invoiceData.payment_method || 'Cash'),
        payment_proof_url: invoiceData.payment_proof_url || null,
        notes: invoiceData.notes || null,
        user_id: user.id
      };

      console.log('Complete data for Supabase insert:', completeInvoiceData);

      const { data, error } = await supabase
        .from('invoices')
        .insert(completeInvoiceData)
        .select()
        .single();

      if (error) {
        console.error('=== SUPABASE INSERT ERROR ===');
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Error hint:', error.hint);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('=== INVOICE CREATED SUCCESSFULLY ===');
      console.log('Created invoice:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Mutation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      console.log('Invoice created successfully:', data);
    },
    onError: (error) => {
      console.error('=== MUTATION ERROR ===');
      console.error('Error in addInvoice mutation:', error);
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
      
      console.log('=== UPDATE MUTATION ===');
      console.log('Updating invoice ID:', id);
      console.log('Update data:', updateData);
      
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

      if (error) {
        console.error('Update error:', error);
        throw new Error(error.message || 'Failed to update invoice');
      }
      
      console.log('Invoice updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
    onError: (error) => {
      console.error('Update mutation error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update invoice',
        variant: 'destructive'
      });
    },
  });

  const deleteInvoiceMutation = useMutation({
    mutationFn: async (invoiceId: string) => {
      console.log('Deleting invoice:', invoiceId);
      
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoiceId);

      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      
      console.log('Invoice deleted successfully');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      });
    },
    onError: (error) => {
      console.error('Delete mutation error:', error);
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
