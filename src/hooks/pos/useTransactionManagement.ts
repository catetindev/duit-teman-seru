import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PosProduct, PosTransaction } from '@/types/pos';
import { Json } from '@/integrations/supabase/types';
import { generatePrefixedUuid, stripUuidPrefix } from '@/utils/uuidHelpers';
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
    
    // Try to find existing customer first
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
    
    // Create new customer with prefixed UUID
    const customerIdWithPrefix = generatePrefixedUuid('CUSTOMER');
    const cleanCustomerId = stripUuidPrefix(customerIdWithPrefix);
    
    console.log('Creating new customer:', {
      storedId: cleanCustomerId,
      displayId: customerIdWithPrefix
    });
    
    const { data: newCustomer, error: insertError } = await supabase
      .from('customers')
      .insert({ 
        id: cleanCustomerId,
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
    return newCustomer.id;
  };

  const saveTransaction = async (transaction: PosTransaction, originalTxId?: string): Promise<boolean> => {
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
        product_id: p.id, 
        quantity: p.qty, 
        name: p.nama, 
        price: p.harga
      }));

      // Generate or clean UUIDs
      const cleanPosId = originalTxId ? stripUuidPrefix(originalTxId) : stripUuidPrefix(generatePrefixedUuid('POS'));
      const orderIdWithPrefix = generatePrefixedUuid('ORDER');
      const cleanOrderId = stripUuidPrefix(orderIdWithPrefix);
      
      // Log the IDs for debugging
      console.log('Transaction IDs:', {
        pos: { stored: cleanPosId, display: `pos-${cleanPosId}` },
        order: { stored: cleanOrderId, display: orderIdWithPrefix }
      });
      
      const posTransactionData = {
        id: cleanPosId,
        produk: transaction.produk as unknown as Json,
        total: transaction.total,
        metode_pembayaran: transaction.metode_pembayaran,
        nama_pembeli: transaction.nama_pembeli || null,
        user_id: user.id,
        waktu_transaksi: transactionTimestamp
      };

      const orderData = {
        id: cleanOrderId,
        order_date: transactionTimestamp,
        customer_id: customerId,
        products: orderProducts as unknown as Json,
        total: transaction.total,
        status: 'Paid' as 'Pending' | 'Paid' | 'Canceled',
        payment_method: transaction.metode_pembayaran,
        user_id: user.id,
        payment_proof_url: null,
        pos_transaction_id: cleanPosId // Link to POS transaction using clean ID
      };

      if (originalTxId) { 
        const cleanOriginalId = stripUuidPrefix(originalTxId);
        console.log('Updating existing transaction:', cleanOriginalId);
        
        const { error: posUpdateError } = await supabase
          .from('pos_transactions')
          .update(posTransactionData)
          .eq('id', cleanOriginalId)
          .eq('user_id', user.id);
          
        if (posUpdateError) {
          console.error('Error updating POS transaction:', posUpdateError);
          throw posUpdateError;
        }
        
        const { error: orderUpdateError } = await supabase
          .from('orders')
          .update(orderData)
          .eq('pos_transaction_id', cleanOriginalId)
          .eq('user_id', user.id); 
        
        if (orderUpdateError) {
          console.warn("Failed to update linked order:", orderUpdateError);
        } else {
          console.log('Successfully updated linked order');
        }
        
        toast({ title: "Sip! ✨", description: "Transaksi berhasil diupdate." });
      } else { 
        console.log('Creating new transaction');
        
        const { error: posError } = await supabase
          .from('pos_transactions')
          .insert(posTransactionData);
          
        if (posError) {
          console.error('Error creating POS transaction:', posError);
          throw posError;
        }

        const { error: orderError } = await supabase
          .from('orders')
          .insert(orderData);
          
        if (orderError) {
          console.error("Error creating order for POS transaction:", orderError);
          toast({ 
            title: "Partial Success", 
            description: "POS transaksi tersimpan, tapi ada masalah sinkronisasi ke Orders.", 
            variant: "destructive" 
          });
        }

        // Create income transaction record
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

        const { error: incomeError } = await supabase
          .from('transactions')
          .insert(incomeTransactionData);

        if (incomeError) {
          console.warn("Failed to create income transaction record:", incomeError);
        }

        // Update product stock
        await updateProductStock(orderProducts, true);
        
        if (orderError) {
          toast({ title: "Transaksi Tersimpan", description: "POS transaksi berhasil, tapi ada masalah sinkronisasi." });
        } else {
          toast({ title: "Sip! ✨", description: "Transaksi berhasil disimpan dan disinkronkan." });
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

  const deleteTransaction = async (prefixedTxId: string): Promise<boolean> => {
    if (!user?.id) {
      toast({ title: "Error", description: "User not authenticated.", variant: "destructive" });
      return false;
    }
    setLoading(true);
    try {
      const cleanTxId = stripUuidPrefix(prefixedTxId);
      console.log('Deleting transaction:', { prefixed: prefixedTxId, clean: cleanTxId });
      
      // Get transaction data for stock restoration
      const { data: transaction, error: fetchError } = await supabase
        .from('pos_transactions')
        .select('produk, total, nama_pembeli')
        .eq('id', cleanTxId)
        .eq('user_id', user.id)
        .single();

      if (fetchError) {
        console.error('Error fetching transaction for deletion:', fetchError);
        throw fetchError;
      }
      
      // Restore stock
      if (transaction?.produk) {
        const productsToRestore = (transaction.produk as unknown as PosProduct[])
          .map(p => ({ product_id: p.id, quantity: p.qty }));
        await updateProductStock(productsToRestore, false);
      }

      // Delete POS transaction
      const { error: posDeleteError } = await supabase
        .from('pos_transactions')
        .delete()
        .eq('id', cleanTxId)
        .eq('user_id', user.id); 
        
      if (posDeleteError) throw posDeleteError;

      // Delete linked order
      const { error: orderDeleteError } = await supabase
        .from('orders')
        .delete()
        .eq('pos_transaction_id', cleanTxId)
        .eq('user_id', user.id); 
      
      if (orderDeleteError) {
        console.warn("Could not delete linked order:", orderDeleteError);
      }

      // Delete corresponding income transaction
      if (transaction) {
        const { error: incomeDeleteError } = await supabase
          .from('transactions')
          .delete()
          .eq('user_id', user.id)
          .eq('type', 'income')
          .eq('amount', transaction.total)
          .eq('description', `POS Sale - ${transaction.nama_pembeli || 'Customer'}`);
        
        if (incomeDeleteError) {
          console.warn("Could not delete income transaction:", incomeDeleteError);
        }
      }

      toast({ title: "Berhasil! 👍", description: "Transaksi telah dihapus dari semua sistem." });
      await fetchRecentTransactions();
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
      const { data, error } = await supabase
        .from('pos_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      
      // Add prefixes to transaction IDs for display
      const prefixedTransactions = data?.map(tx => ({
        ...tx,
        id: `pos-${tx.id}`
      })) || [];
      
      console.log('Fetched transactions:', {
        raw: data,
        prefixed: prefixedTransactions.map(tx => tx.id)
      });
      
      setRecentTransactions(prefixedTransactions);
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  }, [user?.id, toast]);

  return {
    loading,
    recentTransactions,
    saveTransaction,
    deleteTransaction,
    fetchRecentTransactions
  };
}
