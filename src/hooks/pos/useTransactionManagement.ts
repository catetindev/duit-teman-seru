
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
    
    console.log('Looking for customer:', nameToUse);
    
    let { data: existingCustomer, error: fetchError } = await supabase
      .from('customers')
      .select('id')
      .eq('name', nameToUse)
      .eq('user_id', user.id)
      .maybeSingle();
      
    if (fetchError) {
      console.error('Error fetching customer:', fetchError);
      throw fetchError;
    }
    
    if (existingCustomer) {
      console.log('Found existing customer:', existingCustomer.id);
      return existingCustomer.id;
    }
    
    const newCustomerId = uuidv4();
    console.log('Creating new customer with ID:', newCustomerId);
    
    const { data: newCustomer, error: insertError } = await supabase
      .from('customers')
      .insert({ 
        id: newCustomerId, 
        name: nameToUse, 
        user_id: user.id,
        email: null,
        phone: null
      })
      .select('id')
      .single();
      
    if (insertError) {
      console.error('Error creating customer:', insertError);
      throw insertError;
    }
    
    if (!newCustomer) throw new Error("Failed to create customer and retrieve ID");
    
    console.log('Created new customer:', newCustomer.id);
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
      
      console.log('Processing transaction with customer ID:', customerId);
      
      const orderProducts = transaction.produk.map((p: PosProduct) => ({
        product_id: p.id, 
        quantity: p.qty, 
        name: p.nama, 
        price: p.harga
      }));

      console.log('Order products:', orderProducts);

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
      
      console.log('Saving POS transaction data:', posTransactionData);
      console.log('Saving order data:', orderData);
      
      let posTxIdToLink = originalTxId;

      if (originalTxId) { 
        console.log('Updating existing transaction:', originalTxId);
        
        const { data: updatedPosTx, error: posUpdateError } = await supabase
          .from('pos_transactions')
          .update(posTransactionData)
          .eq('id', originalTxId)
          .eq('user_id', user.id) 
          .select('id')
          .single();
          
        if (posUpdateError) {
          console.error('Error updating POS transaction:', posUpdateError);
          throw posUpdateError;
        }
        if (!updatedPosTx) throw new Error("Failed to update POS transaction or transaction not found for user.");
        posTxIdToLink = updatedPosTx.id;
        
        const { error: orderUpdateError } = await supabase
          .from('orders')
          .update(orderData)
          .eq('pos_transaction_id', originalTxId)
          .eq('user_id', user.id); 
        
        if (orderUpdateError) {
          console.warn("Failed to update linked order, or no linked order found. POS transaction updated.", orderUpdateError);
        } else {
          console.log('Successfully updated linked order');
        }
        
        toast({ title: "Sip! ✨", description: "Transaksi berhasil diupdate." });

      } else { 
        console.log('Creating new transaction');
        
        const { data: newPosTx, error: posError } = await supabase
          .from('pos_transactions')
          .insert(posTransactionData)
          .select('id')
          .single();
          
        if (posError) {
          console.error('Error creating POS transaction:', posError);
          throw posError;
        }
        if (!newPosTx) throw new Error("Failed to insert POS transaction and retrieve ID.");
        posTxIdToLink = newPosTx.id;

        const orderDataWithLink = { ...orderData, pos_transaction_id: posTxIdToLink };
        console.log('Creating order with POS link:', orderDataWithLink);
        
        const { data: newOrder, error: orderError } = await supabase
          .from('orders')
          .insert(orderDataWithLink)
          .select('id')
          .single();
          
        if (orderError) {
          console.error("Error creating order for POS transaction:", orderError);
          toast({ 
            title: "Partial Success", 
            description: "POS transaksi tersimpan, tapi ada masalah sinkronisasi ke Orders. Periksa menu Orders & Transactions.", 
            variant: "destructive" 
          });
        } else {
          console.log('Successfully created linked order:', newOrder.id);
        }

        // Create income transaction record for dashboard tracking
        const incomeTransactionData = {
          user_id: user.id,
          type: 'income',
          amount: transaction.total,
          currency: 'IDR',
          category: 'Business Sales',
          description: `POS Sale - ${transaction.nama_pembeli || 'Customer'}`,
          date: new Date().toISOString().split('T')[0],
          is_business: true
        };

        console.log('Creating income transaction:', incomeTransactionData);

        const { error: incomeError } = await supabase
          .from('transactions')
          .insert(incomeTransactionData);

        if (incomeError) {
          console.warn("Failed to create income transaction record:", incomeError);
        } else {
          console.log('Successfully created income transaction');
        }

        // Update product stock after successful transaction
        await updateProductStock(orderProducts, true);
        
        if (orderError) {
          toast({ title: "Transaksi Tersimpan", description: "POS transaksi berhasil, tapi ada masalah sinkronisasi. Periksa menu Orders & Transactions." });
        } else {
          toast({ title: "Sip! ✨", description: "Transaksi berhasil disimpan dan disinkronkan ke Orders & Income." });
        }
      }
      
      await fetchRecentTransactions(); 
      return true;
    } catch (error: any) {
      console.error("Error saving/updating transaction:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
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
      console.log('Deleting transaction:', txId);
      
      // Get the transaction data first to access the products for stock restoration
      const { data: transaction, error: fetchError } = await supabase
        .from('pos_transactions')
        .select('produk, total, nama_pembeli')
        .eq('id', txId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching transaction for deletion:', fetchError);
        throw fetchError;
      }
      
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
        console.log('Stock restored for deleted transaction');
      }

      const { error: posDeleteError } = await supabase
        .from('pos_transactions')
        .delete()
        .eq('id', txId)
        .eq('user_id', user.id); 
        
      if (posDeleteError) {
        console.error('Error deleting POS transaction:', posDeleteError);
        throw posDeleteError;
      }

      const { error: orderDeleteError } = await supabase
        .from('orders')
        .delete()
        .eq('pos_transaction_id', txId)
        .eq('user_id', user.id); 
      
      if (orderDeleteError) {
        console.warn("Could not delete linked order, or no linked order found. POS transaction deleted.", orderDeleteError);
      } else {
        console.log('Successfully deleted linked order');
      }

      // Also delete corresponding income transaction
      if (transaction) {
        const { error: incomeDeleteError } = await supabase
          .from('transactions')
          .delete()
          .eq('user_id', user.id)
          .eq('type', 'income')
          .eq('amount', transaction.total)
          .eq('description', `POS Sale - ${transaction.nama_pembeli || 'Customer'}`);
        
        if (incomeDeleteError) {
          console.warn("Could not delete corresponding income transaction:", incomeDeleteError);
        } else {
          console.log('Successfully deleted income transaction');
        }
      }

      toast({ title: "Berhasil! 👍", description: "Transaksi telah dihapus dari semua sistem." });
      return true;
    } catch (error: any) {
      console.error("Error deleting transaction:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentTransactions = useCallback(async () => {
    if (!user?.id) return;
    try {
      console.log('Fetching recent transactions for user:', user.id);
      
      const { data, error } = await supabase
        .from('pos_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) {
        console.error('Error fetching recent transactions:', error);
        throw error;
      }
      
      console.log('Fetched recent transactions:', data);
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
