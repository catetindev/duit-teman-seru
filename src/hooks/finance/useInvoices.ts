import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Invoice } from '@/types/finance';
import { Customer, Product } from '@/types/entrepreneur';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useInvoices = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: invoices = [], isLoading: invoicesLoading, refetch: refetchInvoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Invoice[];
    },
    enabled: !!user?.id,
  });

  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      return data as Customer[];
    },
    enabled: !!user?.id,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      return data as Product[];
    },
    enabled: !!user?.id,
  });

  const generateInvoiceNumber = async () => {
    try {
      if (!user?.id) {
        console.log('No user ID, generating fallback invoice number');
        return `INV-${Date.now()}`;
      }
      
      console.log('Fetching existing invoices for user:', user.id);
      const { data: existingInvoices, error } = await supabase
        .from('invoices')
        .select('invoice_number')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error fetching existing invoices:', error);
        return `INV-${Date.now()}`;
      }

      const currentDate = new Date();
      const year = currentDate.getFullYear().toString().slice(-2);
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');

      let nextNumber = 1;
      if (existingInvoices && existingInvoices.length > 0) {
        const lastInvoice = existingInvoices[0];
        console.log('Last invoice:', lastInvoice);
        const match = lastInvoice.invoice_number.match(/INV-(\d{2})(\d{2})-(\d{4})/);
        if (match) {
          const lastNumber = parseInt(match[3]);
          nextNumber = lastNumber + 1;
        }
      }

      const invoiceNumber = `INV-${year}${month}-${nextNumber.toString().padStart(4, '0')}`;
      console.log('Generated invoice number:', invoiceNumber);
      return invoiceNumber;
    } catch (error) {
      console.error('Error generating invoice number:', error);
      return `INV-${Date.now()}`;
    }
  };

  const addInvoiceMutation = useMutation({
    mutationFn: async (invoiceData: Omit<Invoice, 'id' | 'created_at' | 'user_id'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      console.log('AddInvoice mutation starting with data:', invoiceData);

      // Ensure all required fields are present
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
        payment_method: invoiceData.payment_method || 'Cash',
        payment_proof_url: invoiceData.payment_proof_url || null,
        notes: invoiceData.notes || null,
        user_id: user.id
      };

      console.log('Complete invoice data for insert:', completeInvoiceData);

      const { data, error } = await supabase
        .from('invoices')
        .insert(completeInvoiceData)
        .select()
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        throw new Error(error.message || 'Failed to create invoice');
      }
      
      console.log('Invoice created successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      console.log('Invoice created, invalidating queries');
    },
    onError: (error) => {
      console.error('Add invoice mutation error:', error);
    },
  });

  const updateInvoiceMutation = useMutation({
    mutationFn: async (invoiceData: Partial<Invoice> & { id: string }) => {
      const { id, ...updateData } = invoiceData;
      console.log('Updating invoice with data:', updateData);
      
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
        console.error('Supabase update error:', error);
        throw new Error(error.message || 'Failed to update invoice');
      }
      
      console.log('Invoice updated successfully:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      console.log('Invoice updated, invalidating queries');
    },
    onError: (error) => {
      console.error('Update invoice mutation error:', error);
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
      console.error('Delete invoice error:', error);
      toast({
        title: "Error",
        description: "Failed to delete invoice",
        variant: "destructive",
      });
    },
  });

  const fetchInvoices = (status?: string) => {
    refetchInvoices();
  };

  return {
    invoices,
    customers,
    products,
    loading: invoicesLoading || customersLoading || productsLoading,
    fetchInvoices,
    generateInvoiceNumber,
    addInvoice: addInvoiceMutation.mutate,
    updateInvoice: updateInvoiceMutation.mutate,
    deleteInvoice: deleteInvoiceMutation.mutate,
    isAdding: addInvoiceMutation.isPending,
    isUpdating: updateInvoiceMutation.isPending,
    isDeleting: deleteInvoiceMutation.isPending,
  };
};
