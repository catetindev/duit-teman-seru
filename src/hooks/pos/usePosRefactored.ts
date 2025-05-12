
import { useProductManagement } from './useProductManagement';
import { useCartManagement } from './useCartManagement';
import { useTransactionManagement } from './useTransactionManagement';
import { useEffect } from 'react';

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
    fetchRecentTransactions
  } = useTransactionManagement();

  // Combined loading state
  const loading = productsLoading || transactionLoading;

  // Wrapper for saving transaction
  const handleSaveTransaction = async () => {
    const success = await saveTransaction(transaction);
    if (success) {
      resetTransaction();
    }
  };

  // Load initial data
  useEffect(() => {
    fetchProducts();
    fetchRecentTransactions();
  }, []);

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
    saveTransaction: handleSaveTransaction,
    resetTransaction,
    fetchProducts,
    fetchRecentTransactions,
  };
}
