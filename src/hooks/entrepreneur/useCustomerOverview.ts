
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface RecentCustomer {
  id: string;
  name: string;
  lastOrderDate: string | null;
  orderCount: number;
  tags: string[];
}

export function useCustomerOverview(limit = 5) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recentCustomers, setRecentCustomers] = useState<RecentCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentCustomers = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch most recent customers
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('id, name, last_order_date, tags')
        .eq('user_id', user.id)
        .order('last_order_date', { ascending: false, nullsLast: true })
        .limit(limit);

      if (customersError) throw customersError;

      // For each customer, count their orders
      const customersWithOrderCount = await Promise.all(
        (customers || []).map(async (customer) => {
          const { count, error } = await supabase
            .from('orders')
            .select('id', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .eq('customer_id', customer.id);

          if (error) throw error;

          return {
            id: customer.id,
            name: customer.name,
            lastOrderDate: customer.last_order_date,
            orderCount: count || 0,
            tags: customer.tags || []
          };
        })
      );

      setRecentCustomers(customersWithOrderCount);
      
    } catch (error: any) {
      console.error('Error fetching recent customers:', error);
      toast({
        title: "Error",
        description: "Failed to fetch customer data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, limit, toast]);

  useEffect(() => {
    fetchRecentCustomers();
  }, [fetchRecentCustomers]);

  return {
    recentCustomers,
    loading,
    refetch: fetchRecentCustomers
  };
}
