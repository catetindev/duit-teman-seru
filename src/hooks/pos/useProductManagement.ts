
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PosProduct } from '@/hooks/usePos';

export function useProductManagement() {
  const [products, setProducts] = useState<PosProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Fetch products from database - properly memoized with useCallback
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_url, category')
        .order('name');
      
      if (error) throw error;

      // Convert to PosProduct format
      const posProducts: PosProduct[] = (data || []).map(product => ({
        id: product.id,
        nama: product.name,
        harga: product.price,
        qty: 0,
      }));

      setProducts(posProducts);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Gagal memuat daftar produk: " + error.message,
        variant: "destructive"
      });
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    products,
    loading,
    fetchProducts
  };
}
