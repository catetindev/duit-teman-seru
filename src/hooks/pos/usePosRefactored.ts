
import { useProductManagement } from './useProductManagement';
import { useCartManagement } from './useCartManagement';
import { useTransactionManagement } from './useTransactionManagement';
import { useEffect, useCallback, useState } from 'react';

export function usePosRefactored() {
  const { 
    products, 
    loading: productsLoading, 
    fetchProducts 
  } = useProductManagement();
  
  const { 
    transaction,
    addToCart,
    updateQuantity,
    removeFromCart,
    updatePaymentMethod,
    updateCashReceived,
    updateCustomerName,
    resetTransaction
  } = useCartManagement();
  
  const {
    loading: transactionLoading,
    recentTransactions,
    saveTransaction,
    deleteTransaction,
    fetchRecentTransactions
  } = useTransactionManagement();

  const [showReceipt, setShowReceipt] = useState(false);

  // Combined loading state
  const loading = productsLoading || transactionLoading;

  // Create cart from transaction products
  const cart = transaction.produk || [];

  // Wrapper for saving transaction
  const handleSaveTransaction = useCallback(async () => {
    const success = await saveTransaction(transaction);
    if (success) {
      setShowReceipt(true);
      // Hide receipt after a delay
      setTimeout(() => {
        setShowReceipt(false);
      }, 3000);
      resetTransaction();
    }
    return success;
  }, [saveTransaction, transaction, resetTransaction]);

  // Load initial data
  useEffect(() => {
    fetchProducts();
    fetchRecentTransactions();
  }, [fetchProducts, fetchRecentTransactions]);

  return {
    products,
    cart,
    transaction,
    loading,
    showReceipt,
    recentTransactions,
    addToCart,
    updateQuantity,
    removeFromCart,
    updatePaymentMethod,
    updateCashReceived,
    updateCustomerName,
    saveTransaction: handleSaveTransaction,
    deleteTransaction,
    resetTransaction,
    fetchProducts,
    fetchRecentTransactions,
  };
}
