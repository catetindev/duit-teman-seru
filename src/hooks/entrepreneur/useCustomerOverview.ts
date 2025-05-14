
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export interface CustomerOverviewData {
  recentCustomers: {
    id: string;
    name: string;
    last_order_date: string | null;
    tags: string[];
  }[];
  customerCount: number;
  loading: boolean;
}

export const useCustomerOverview = (limit = 5): CustomerOverviewData => {
  const [recentCustomers, setRecentCustomers] = useState<any[]>([]);
  const [customerCount, setCustomerCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchCustomerData() {
      if (!user) return;
      
      try {
        // Fetch recent customers
        const { data: customersData, error: customersError } = await supabase
          .from('customers')
          .select('id, name, last_order_date, tags')
          .eq('user_id', user.id)
          .order('last_order_date', { ascending: false })
          .limit(limit);

        if (customersError) throw customersError;
        
        // Fetch total customer count
        const { count, error: countError } = await supabase
          .from('customers')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
          
        if (countError) throw countError;
        
        setRecentCustomers(customersData || []);
        setCustomerCount(count || 0);
      } catch (error: any) {
        console.error('Error fetching customer data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load customer data',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchCustomerData();
  }, [user, limit]);

  return {
    recentCustomers,
    customerCount,
    loading
  };
};
