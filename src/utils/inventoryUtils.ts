
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type ProductItem = {
  product_id: string;
  quantity: number;
  name?: string;
  price?: number;
};

/**
 * Updates product stock based on order items
 * @param productsData - Array of product items from an order
 * @param reduce - If true, reduces stock; if false, increases stock (for cancellations)
 */
export const updateProductStock = async (productsData: any, reduce: boolean = true) => {
  try {
    if (!productsData || !Array.isArray(productsData)) {
      console.error('Invalid products data:', productsData);
      return;
    }

    // Process each product in the order
    for (const item of productsData) {
      // Handle different product data formats
      let productId: string;
      let quantity: number;
      
      if (typeof item === 'object' && item !== null) {
        // Handle standard object format
        productId = item.product_id || item.id;
        quantity = item.quantity || 1;
      } else {
        // Skip invalid items
        console.error('Invalid product item format:', item);
        continue;
      }

      if (!productId) {
        console.error('Product ID missing in item:', item);
        continue;
      }

      // First get current stock
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('stock')
        .eq('id', productId)
        .single();
      
      if (fetchError) {
        console.error('Error fetching product stock:', fetchError);
        continue;
      }
      
      if (!product) {
        console.error(`Product not found with ID: ${productId}`);
        continue;
      }

      const currentStock = product.stock || 0;
      const newStock = reduce 
        ? Math.max(0, currentStock - quantity) // Don't allow negative stock
        : currentStock + quantity;
      
      // Update the product stock
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', productId);
      
      if (updateError) {
        console.error('Error updating product stock:', updateError);
      } else {
        console.log(`Updated stock for product ${productId}: ${currentStock} → ${newStock}`);
      }
    }
  } catch (error) {
    console.error('Error updating product stock:', error);
    toast({
      title: 'Error',
      description: 'Failed to update product inventory',
      variant: 'destructive',
    });
  }
};
