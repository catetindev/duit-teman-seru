
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { usePosRefactored } from '@/hooks/pos/usePosRefactored';
import { PosLayout } from '@/components/pos/PosLayout';
import { ProductsGrid } from '@/components/pos/ProductsGrid';
import { CartPanel } from '@/components/pos/CartPanel';
import { PaymentPanel } from '@/components/pos/PaymentPanel';
import { PosReceipt } from '@/components/pos/PosReceipt';
import { RecentTransactions } from '@/components/pos/RecentTransactions';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const PosRefactored = () => {
  const { isPremium } = useAuth();
  const {
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
    saveTransaction,
    deleteTransaction,
    resetTransaction,
    handleCloseReceipt,
  } = usePosRefactored();

  if (showReceipt && transaction.produk.length > 0) {
    return (
      <DashboardLayout isPremium={isPremium}>
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
          <PosReceipt transaction={transaction} onClose={handleCloseReceipt} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="space-y-6">
        <PosLayout
          title="Point of Sale"
          leftPanel={
            <div className="space-y-6">
              <ProductsGrid
                products={products}
                onAddToCart={addToCart}
                loading={loading}
              />
              
              <RecentTransactions
                transactions={recentTransactions}
                onDelete={deleteTransaction}
                loading={loading}
              />
            </div>
          }
          rightPanel={
            <div className="space-y-4 h-full flex flex-col">
              {/* Cart Section */}
              <div className="flex-1">
                <CartPanel
                  cart={cart}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                  total={transaction.total}
                />
              </div>
              
              <Separator className="my-4" />
              
              {/* Payment Section */}
              <div className="flex-shrink-0">
                <PaymentPanel
                  transaction={transaction}
                  onPaymentMethodChange={updatePaymentMethod}
                  onCashReceivedChange={updateCashReceived}
                  onCustomerNameChange={updateCustomerName}
                  onSaveTransaction={saveTransaction}
                  onResetTransaction={resetTransaction}
                  loading={loading}
                />
              </div>
            </div>
          }
        />
      </div>
    </DashboardLayout>
  );
};

export default PosRefactored;
