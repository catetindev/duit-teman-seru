
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

/**
 * Updates product stock after a successful transaction
 * @param products Array of products with their quantities
 * @param isReducing Whether to reduce stock (true) or restore stock (false)
 * @returns Promise<boolean> indicating success or failure
 */
export async function updateProductStock(
  products: Array<{ product_id: string; quantity: number }>,
  isReducing: boolean = true
): Promise<boolean> {
  try {
    // Process each product in the transaction
    for (const item of products) {
      // Skip if product_id is not valid
      if (!item.product_id) continue;
      
      // Get current product data
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('stock, name')
        .eq('id', item.product_id)
        .single();
      
      if (fetchError) {
        console.error(`Error fetching product ${item.product_id}:`, fetchError);
        continue;
      }
      
      if (!product) {
        console.error(`Product ${item.product_id} not found`);
        continue;
      }
      
      // Calculate new stock level
      const changeAmount = item.quantity || 0;
      const newStock = isReducing 
        ? Math.max(0, product.stock - changeAmount) // Don't go below 0 when reducing
        : product.stock + changeAmount;
      
      // Update the stock in the database
      const { error: updateError } = await supabase
        .from('products')
        .update({ stock: newStock })
        .eq('id', item.product_id);
      
      if (updateError) {
        console.error(`Error updating stock for ${product.name}:`, updateError);
        // Continue with other products even if one fails
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error updating product stock:', error);
    return false;
  }
}
