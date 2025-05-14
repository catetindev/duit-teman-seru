
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PosTransaction, PosProduct } from '@/hooks/usePos'; 
import { Json } from '@/integrations/supabase/types';
import { v4 as uuidv4 } from 'uuid'; 
import { updateProductStock } from '@/utils/inventoryUtils';

export function useTransactionManagement() {
  const [loading, setLoading] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const getOrCreateCustomerId = async (customerName: string | undefined): Promise<string> => {
    if (!user?.id) throw new Error("User not authenticated");
    const nameToUse = customerName?.trim() || "POS Customer";
    let { data: existingCustomer, error: fetchError } = await supabase
      .from('customers')
      .select('id')
      .eq('name', nameToUse)
      .eq('user_id', user.id)
      .maybeSingle();
    if (fetchError) throw fetchError;
    if (existingCustomer) return existingCustomer.id;
    const newCustomerId = uuidv4();
    const { data: newCustomer, error: insertError } = await supabase
      .from('customers')
      .insert({ id: newCustomerId, name: nameToUse, user_id: user.id })
      .select('id').single();
    if (insertError) throw insertError;
    if (!newCustomer) throw new Error("Failed to create customer and retrieve ID");
    return newCustomer.id;
  };

  const saveTransaction = async (transaction: PosTransaction, originalTxId?: string) => {
    if (!user?.id) {
      toast({ title: "Error", description: "User not authenticated.", variant: "destructive" });
      return false;
    }
    if (transaction.produk.length === 0) {
      toast({ title: "Transaksi Kosong", description: "Tambahkan produk.", variant: "destructive" });
      return false;
    }
    if (transaction.metode_pembayaran === 'Cash' && (!transaction.uang_diterima || transaction.uang_diterima < transaction.total)) {
      toast({ title: "Pembayaran Kurang", description: "Cek nominal uang.", variant: "destructive" });
      return false;
    }

    setLoading(true);
    try {
      const transactionTimestamp = new Date().toISOString();
      const customerId = await getOrCreateCustomerId(transaction.nama_pembeli);
      const orderProducts = transaction.produk.map((p: PosProduct) => ({
        product_id: p.id, quantity: p.qty, name: p.nama, price: p.harga
      }));

      const posTransactionData = {
        produk: transaction.produk as unknown as Json,
        total: transaction.total,
        metode_pembayaran: transaction.metode_pembayaran,
        nama_pembeli: transaction.nama_pembeli || null,
        user_id: user.id,
        waktu_transaksi: transactionTimestamp
      };

      const orderData = {
        order_date: transactionTimestamp,
        customer_id: customerId,
        products: orderProducts as unknown as Json,
        total: transaction.total,
        status: 'Paid' as 'Pending' | 'Paid' | 'Canceled',
        payment_method: transaction.metode_pembayaran,
        user_id: user.id,
        payment_proof_url: null,
      };
      
      let posTxIdToLink = originalTxId;

      if (originalTxId) { 
        const { data: updatedPosTx, error: posUpdateError } = await supabase
          .from('pos_transactions')
          .update(posTransactionData)
          .eq('id', originalTxId)
          .eq('user_id', user.id) 
          .select('id')
          .single();
        if (posUpdateError) throw posUpdateError;
        if (!updatedPosTx) throw new Error("Failed to update POS transaction or transaction not found for user.");
        posTxIdToLink = updatedPosTx.id;
        
        const { error: orderUpdateError } = await supabase
          .from('orders')
          .update(orderData)
          .eq('pos_transaction_id', originalTxId)
          .eq('user_id', user.id); 
        
        if (orderUpdateError) {
             console.warn("Failed to update linked order, or no linked order found. POS transaction updated.", orderUpdateError);
        }
        toast({ title: "Sip! ✨", description: "Transaksi berhasil diupdate." });

      } else { 
        const { data: newPosTx, error: posError } = await supabase
          .from('pos_transactions')
          .insert(posTransactionData)
          .select('id')
          .single();
        if (posError) throw posError;
        if (!newPosTx) throw new Error("Failed to insert POS transaction and retrieve ID.");
        posTxIdToLink = newPosTx.id;

        const orderDataWithLink = { ...orderData, pos_transaction_id: posTxIdToLink };
        const { error: orderError } = await supabase.from('orders').insert(orderDataWithLink);
        if (orderError) {
          console.error("Error creating order for POS transaction:", orderError);
          toast({ title: "Partial Error", description: "POS sale recorded, but failed to sync to Orders.", variant: "destructive" });
        } else {
          toast({ title: "Sip! ✨", description: "Transaksi berhasil disimpan dan disinkronkan." });
        }

        // Update product stock after successful transaction
        await updateProductStock(orderProducts, true);
      }
      await fetchRecentTransactions(); 
      return true;
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      console.error("Error saving/updating transaction:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const deleteTransaction = async (txId: string): Promise<boolean> => {
    if (!user?.id) {
      toast({ title: "Error", description: "User not authenticated.", variant: "destructive" });
      return false;
    }
    setLoading(true);
    try {
      // Get the transaction data first to access the products for stock restoration
      const { data: transaction, error: fetchError } = await supabase
        .from('pos_transactions')
        .select('produk')
        .eq('id', txId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) throw fetchError;
      
      // Restore stock for deleted transaction's products
      if (transaction && transaction.produk) {
        const productsToRestore = (transaction.produk as unknown as PosProduct[]).map(
          (p: PosProduct) => ({
            product_id: p.id,
            quantity: p.qty
          })
        );
        
        // Restore stock (false = adding back to inventory)
        await updateProductStock(productsToRestore, false);
      }

      const { error: posDeleteError } = await supabase
        .from('pos_transactions')
        .delete()
        .eq('id', txId)
        .eq('user_id', user.id); 
      if (posDeleteError) throw posDeleteError;

      const { error: orderDeleteError } = await supabase
        .from('orders')
        .delete()
        .eq('pos_transaction_id', txId)
        .eq('user_id', user.id); 
      
      if (orderDeleteError) {
        console.warn("Could not delete linked order, or no linked order found. POS transaction deleted.", orderDeleteError);
      }

      toast({ title: "Berhasil! 👍", description: "Transaksi telah dihapus." });
      // Removed fetchRecentTransactions() from here. It will be called by the component.
      return true;
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      console.error("Error deleting transaction:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentTransactions = useCallback(async () => {
    if (!user?.id) return;
    try {
      const { data, error } = await supabase
        .from('pos_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      setRecentTransactions(data || []);
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
    }
  }, [user?.id]);

  return {
    loading,
    recentTransactions,
    saveTransaction, 
    deleteTransaction,
    fetchRecentTransactions,
  };
}
