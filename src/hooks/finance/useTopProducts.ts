
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { TopProduct } from '@/types/finance';
import { useToast } from '@/hooks/use-toast';

export function useTopProducts() {
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch top products data
  const fetchTopProducts = async (dateRange?: { from: Date, to: Date }) => {
    try {
      if (!user) return [];
      setLoading(true);

      // Fetch orders for the date range
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('id, total, products, created_at')
        .eq('user_id', user.id)
        .eq('status', 'Paid')
        .gte('created_at', dateRange?.from?.toISOString() || '')
        .lte('created_at', dateRange?.to?.toISOString() || '');

      if (error) throw error;

      // Calculate top products
      const productMap = new Map<string, { revenue: number, count: number }>();
      
      ordersData.forEach(order => {
        const products = Array.isArray(order.products) 
          ? order.products 
          : JSON.parse(typeof order.products === 'string' ? order.products : JSON.stringify(order.products));
        
        products.forEach((product: any) => {
          const name = product.name || product.product_name || 'Unknown';
          const revenue = Number(product.price || 0) * Number(product.quantity || 0);
          const current = productMap.get(name) || { revenue: 0, count: 0 };
          
          productMap.set(name, {
            revenue: current.revenue + revenue,
            count: current.count + Number(product.quantity || 1)
          });
        });
      });

      const topProductsList = Array.from(productMap.entries())
        .map(([name, data]) => ({
          name,
          revenue: data.revenue,
          count: data.count
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      setTopProducts(topProductsList);
      return topProductsList;
    } catch (error: any) {
      console.error('Error fetching top products:', error);
      toast({
        title: 'Error fetching top products',
        description: error.message,
        variant: 'destructive'
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      fetchTopProducts();
    }
  }, [user]);

  return {
    topProducts,
    loading,
    fetchTopProducts
  };
}
