
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BusinessStats {
  totalCustomers: number;
  totalProducts: number;
  totalOrders: number;
}

export function useBusinessStats() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<BusinessStats>({
    totalCustomers: 0,
    totalProducts: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchBusinessStats = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch customers
      const { count: customersCount, error: customersError } = await supabase
        .from('customers')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (customersError) throw customersError;

      // Fetch products
      const { count: productsCount, error: productsError } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (productsError) throw productsError;

      // Fetch orders
      const { count: ordersCount, error: ordersError } = await supabase
        .from('orders')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (ordersError) throw ordersError;

      setStats({
        totalCustomers: customersCount || 0,
        totalProducts: productsCount || 0,
        totalOrders: ordersCount || 0
      });
      
    } catch (error: any) {
      console.error('Error fetching business stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch business statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchBusinessStats();
  }, [fetchBusinessStats]);

  return {
    ...stats,
    loading,
    refetch: fetchBusinessStats
  };
}
