
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
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Invoice[];
    },
  });

  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Customer[];
    },
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Product[];
    },
  });

  // Generate invoice number
  const generateInvoiceNumber = async () => {
    try {
      const { data: existingInvoices, error } = await supabase
        .from('invoices')
        .select('invoice_number')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      const currentDate = new Date();
      const year = currentDate.getFullYear().toString().slice(-2);
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');

      let nextNumber = 1;
      if (existingInvoices && existingInvoices.length > 0) {
        const lastInvoice = existingInvoices[0];
        const lastNumber = parseInt(lastInvoice.invoice_number.split('-').pop() || '0');
        nextNumber = lastNumber + 1;
      }

      return `INV-${year}${month}-${nextNumber.toString().padStart(4, '0')}`;
    } catch (error) {
      console.error('Error generating invoice number:', error);
      return `INV-${Date.now()}`;
    }
  };

  // Add invoice mutation
  const addInvoiceMutation = useMutation({
    mutationFn: async (invoiceData: Omit<Invoice, 'id' | 'created_at' | 'user_id'>) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('invoices')
        .insert({
          ...invoiceData,
          user_id: user.id,
          items: JSON.stringify(invoiceData.items)
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });
    },
    onError: (error) => {
      console.error('Add invoice error:', error);
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
    },
  });

  // Update invoice mutation
  const updateInvoiceMutation = useMutation({
    mutationFn: async (invoiceData: Partial<Invoice> & { id: string }) => {
      const { id, ...updateData } = invoiceData;
      const { data, error } = await supabase
        .from('invoices')
        .update({
          ...updateData,
          items: updateData.items ? JSON.stringify(updateData.items) : undefined
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Success",
        description: "Invoice updated successfully",
      });
    },
    onError: (error) => {
      console.error('Update invoice error:', error);
      toast({
        title: "Error",
        description: "Failed to update invoice",
        variant: "destructive",
      });
    },
  });

  // Delete invoice mutation
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

  // Function to manually trigger refetch with optional status filter
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
