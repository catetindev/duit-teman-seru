
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
import { ShoppingBag, ShoppingCart, CreditCard, Receipt, Clock } from 'lucide-react';

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
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
          <PosReceipt transaction={transaction} onClose={handleCloseReceipt} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="min-h-screen bg-gray-50">
        {/* Clean Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Point of Sale
                </h1>
                <p className="text-gray-600 mt-1">Kelola penjualan dengan mudah dan cepat</p>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                  <span className="text-green-700 font-medium text-sm">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 pb-8">
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
            {/* Left Panel - Products & Transactions */}
            <div className="xl:col-span-8 space-y-6">
              {/* Products Section */}
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Produk</h2>
                      <p className="text-gray-500 text-sm">Pilih produk untuk menambah ke keranjang</p>
                    </div>
                  </div>
                  
                  <ProductsGrid
                    products={products}
                    onAddToCart={addToCart}
                    loading={loading}
                  />
                </CardContent>
              </Card>
              
              {/* Recent Transactions */}
              <Card className="bg-white border border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 rounded-lg bg-gray-700 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Transaksi Terbaru</h2>
                      <p className="text-gray-500 text-sm">Riwayat penjualan hari ini</p>
                    </div>
                  </div>

                  <RecentTransactions
                    transactions={recentTransactions}
                    onDelete={deleteTransaction}
                    loading={loading}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Panel - Cart & Payment */}
            <div className="xl:col-span-4">
              <div className="sticky top-6 space-y-6">
                {/* Cart Section */}
                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-0">
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-orange-600 flex items-center justify-center">
                          <ShoppingCart className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">Keranjang</h2>
                          <p className="text-gray-500 text-sm">{transaction.produk.length} item</p>
                        </div>
                      </div>
                    </div>
                    
                    <CartPanel
                      cart={cart}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeFromCart}
                      total={transaction.total}
                    />
                  </CardContent>
                </Card>

                {/* Payment Section */}
                <Card className="bg-white border border-gray-200">
                  <CardContent className="p-0">
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center">
                          <CreditCard className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900">Pembayaran</h2>
                          <p className="text-gray-500 text-sm">Pilih metode bayar</p>
                        </div>
                      </div>
                    </div>
                    
                    <PaymentPanel
                      transaction={transaction}
                      onPaymentMethodChange={updatePaymentMethod}
                      onCashReceivedChange={updateCashReceived}
                      onCustomerNameChange={updateCustomerName}
                      onSaveTransaction={saveTransaction}
                      onResetTransaction={resetTransaction}
                      loading={loading}
                    />
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PosRefactored;
