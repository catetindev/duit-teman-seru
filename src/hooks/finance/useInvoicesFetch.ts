
import { useState } from 'react';
import { Invoice } from '@/types/finance';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useInvoicesFetch() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch invoices with optional filters
  const fetchInvoices = async (userId: string | undefined, status?: string) => {
    try {
      if (!userId) return [];
      setLoading(true);

      let query = supabase
        .from('invoices')
        .select(`
          *,
          customers(id, name, email, phone)
        `)
        .eq('user_id', userId)
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

  return {
    invoices,
    loading,
    setInvoices,
    fetchInvoices
  };
}
