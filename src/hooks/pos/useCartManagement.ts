
import { useState } from 'react';
import { PosProduct, PosTransaction } from '@/types/pos';

export function useCartManagement() {
  const [transaction, setTransaction] = useState<PosTransaction>({
    produk: [],
    total: 0,
    metode_pembayaran: 'Cash',
  });

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

  // Reset transaction
  const resetTransaction = () => {
    setTransaction({
      produk: [],
      total: 0,
      metode_pembayaran: 'Cash',
    });
  };

  return {
    transaction,
    addToCart,
    updateQuantity,
    removeFromCart,
    updatePaymentMethod,
    updateCashReceived,
    updateCustomerName,
    resetTransaction
  };
}
