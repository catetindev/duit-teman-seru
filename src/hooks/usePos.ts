
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Json } from '@/integrations/supabase/types';

export interface PosProduct {
  id: string;
  nama: string;
  harga: number;
  qty: number;
}

export interface PosTransaction {
  produk: PosProduct[];
  total: number;
  metode_pembayaran: 'Cash' | 'Bank Transfer' | 'QRIS';
  nama_pembeli?: string;
  uang_diterima?: number;
  kembalian?: number;
}

export function usePos() {
  const [products, setProducts] = useState<PosProduct[]>([]);
  const [transaction, setTransaction] = useState<PosTransaction>({
    produk: [],
    total: 0,
    metode_pembayaran: 'Cash',
  });
  const [loading, setLoading] = useState(false);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  // Add a product to the cart
  const addToCart = (product: PosProduct) => {
    // Check if product already in cart
    const existingProductIndex = transaction.produk.findIndex(p => p.id === product.id);

    if (existingProductIndex >= 0) {
      // If product exists in cart, increase quantity
      const updatedProducts = [...transaction.produk];
      updatedProducts[existingProductIndex].qty += 1;
      
      const newTotal = calculateTotal(updatedProducts);
      
      setTransaction({
        ...transaction,
        produk: updatedProducts,
        total: newTotal
      });
    } else {
      // If product doesn't exist in cart, add it
      const productWithQty = { ...product, qty: 1 };
      const updatedProducts = [...transaction.produk, productWithQty];
      const newTotal = calculateTotal(updatedProducts);

      setTransaction({
        ...transaction,
        produk: updatedProducts,
        total: newTotal
      });
    }
  };

  // Update quantity of a product in cart
  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedProducts = transaction.produk.map(p => 
      p.id === productId ? { ...p, qty } : p
    );

    const newTotal = calculateTotal(updatedProducts);
    
    setTransaction({
      ...transaction,
      produk: updatedProducts,
      total: newTotal
    });
  };

  // Remove a product from cart
  const removeFromCart = (productId: string) => {
    const updatedProducts = transaction.produk.filter(p => p.id !== productId);
    const newTotal = calculateTotal(updatedProducts);
    
    setTransaction({
      ...transaction,
      produk: updatedProducts,
      total: newTotal
    });
  };

  // Calculate total from products
  const calculateTotal = (products: PosProduct[]): number => {
    return products.reduce((sum, product) => sum + (product.harga * product.qty), 0);
  };

  // Update payment method
  const updatePaymentMethod = (method: 'Cash' | 'Bank Transfer' | 'QRIS') => {
    setTransaction({
      ...transaction,
      metode_pembayaran: method
    });
  };

  // Update cash received amount and calculate change
  const updateCashReceived = (amount: number) => {
    const kembalian = amount - transaction.total;
    
    setTransaction({
      ...transaction,
      uang_diterima: amount,
      kembalian: kembalian
    });
  };

  // Set customer name
  const updateCustomerName = (name: string) => {
    setTransaction({
      ...transaction,
      nama_pembeli: name
    });
  };

  // Save transaction to database
  const saveTransaction = async () => {
    if (transaction.produk.length === 0) {
      toast({
        title: "Transaksi Kosong",
        description: "Tambahkan produk ke keranjang terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    if (transaction.metode_pembayaran === 'Cash' && 
        (!transaction.uang_diterima || transaction.uang_diterima < transaction.total)) {
      toast({
        title: "Pembayaran Kurang",
        description: "Cek dulu nominal uangnya ya...",
        variant: "destructive"
      });
      return;
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
      
      // Reset the transaction
      resetTransaction();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
      console.error("Error saving transaction:", error);
    } finally {
      setLoading(false);
    }
  };

  // Reset transaction
  const resetTransaction = () => {
    setTransaction({
      produk: [],
      total: 0,
      metode_pembayaran: 'Cash',
    });
  };

  // Fetch products from database
  const fetchProducts = async () => {
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
    products,
    transaction,
    loading,
    recentTransactions,
    addToCart,
    updateQuantity,
    removeFromCart,
    updatePaymentMethod,
    updateCashReceived,
    updateCustomerName,
    saveTransaction,
    resetTransaction,
    fetchProducts,
    fetchRecentTransactions,
  };
}
