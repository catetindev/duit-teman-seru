
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { PosTransaction } from '@/hooks/usePos';
import { Json } from '@/integrations/supabase/types';

export function useTransactionManagement() {
  const [loading, setLoading] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Save transaction to database
  const saveTransaction = async (transaction: PosTransaction) => {
    if (transaction.produk.length === 0) {
      toast({
        title: "Transaksi Kosong",
        description: "Tambahkan produk ke keranjang terlebih dahulu",
        variant: "destructive"
      });
      return false;
    }

    if (transaction.metode_pembayaran === 'Cash' && 
        (!transaction.uang_diterima || transaction.uang_diterima < transaction.total)) {
      toast({
        title: "Pembayaran Kurang",
        description: "Cek dulu nominal uangnya ya...",
        variant: "destructive"
      });
      return false;
    }

    setLoading(true);

    try {
      // Fix for the type error: Convert PosProduct[] to Json to match Supabase expectations
      const { error } = await supabase.from('pos_transactions').insert({
        produk: transaction.produk as unknown as Json,  // Type casting to Json
        total: transaction.total,
        metode_pembayaran: transaction.metode_pembayaran,
        nama_pembeli: transaction.nama_pembeli || null,
        user_id: user?.id,
        waktu_transaksi: new Date().toISOString()
      });

      if (error) throw error;

      toast({
        title: "Sip! ✨",
        description: "Transaksi berhasil disimpan",
      });

      // Fetch recent transactions
      fetchRecentTransactions();
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      console.error("Error saving transaction:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fetch recent transactions
  const fetchRecentTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('pos_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      setRecentTransactions(data || []);
    } catch (error: any) {
      console.error("Error fetching transactions:", error);
    }
  };

  return {
    loading,
    recentTransactions,
    saveTransaction,
    fetchRecentTransactions,
  };
}
