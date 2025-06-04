
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Invoice } from '@/types/finance';

export const useInvoiceOperations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteInvoiceMutation = useMutation({
    mutationFn: async (invoiceId: string) => {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', invoiceId);

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate and refetch invoices data
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

  const updateInvoiceStatusMutation = useMutation({
    mutationFn: async ({ invoiceId, status }: { invoiceId: string; status: Invoice['status'] }) => {
      const { error } = await supabase
        .from('invoices')
        .update({ status })
        .eq('id', invoiceId);

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate and refetch invoices data
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      toast({
        title: "Success",
        description: "Invoice status updated successfully",
      });
    },
    onError: (error) => {
      console.error('Update invoice status error:', error);
      toast({
        title: "Error",
        description: "Failed to update invoice status",
        variant: "destructive",
      });
    },
  });

  return {
    deleteInvoice: deleteInvoiceMutation.mutate,
    updateInvoiceStatus: updateInvoiceStatusMutation.mutate,
    isDeleting: deleteInvoiceMutation.isPending,
    isUpdatingStatus: updateInvoiceStatusMutation.isPending,
  };
};
