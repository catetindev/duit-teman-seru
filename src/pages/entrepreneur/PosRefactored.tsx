
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { usePosRefactored } from '@/hooks/pos/usePosRefactored';
import { PosLayout } from '@/components/pos/PosLayout';
import { ProductsGrid } from '@/components/pos/ProductsGrid';
import { CartPanel } from '@/components/pos/CartPanel';
import { PaymentPanel } from '@/components/pos/PaymentPanel';
import { PosReceipt } from '@/components/pos/PosReceipt';
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
    addToCart,
    updateQuantity,
    removeFromCart,
    updatePaymentMethod,
    updateCashReceived,
    updateCustomerName,
    saveTransaction,
    resetTransaction,
  } = usePosRefactored();

  if (showReceipt && transaction.produk.length > 0) {
    return (
      <DashboardLayout isPremium={isPremium}>
        <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
          <PosReceipt transaction={transaction} onClose={resetTransaction} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout isPremium={isPremium}>
      <PosLayout
        title="Point of Sale"
        leftPanel={
          <ProductsGrid
            products={products}
            onAddToCart={addToCart}
            loading={loading}
          />
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
    </DashboardLayout>
  );
};

export default PosRefactored;
