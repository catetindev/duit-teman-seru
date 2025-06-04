
import React, { useEffect, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Minus, Trash2, Receipt, CreditCard, Banknote, Smartphone } from 'lucide-react';
import { usePosRefactored } from '@/hooks/pos/usePosRefactored';
import { formatCurrency } from '@/utils/formatUtils';
import { useReactToPrint } from 'react-to-print';
import { PosReceipt } from '@/components/pos/PosReceipt';

export default function PosRefactored() {
  const { isPremium } = useAuth();
  const receiptRef = useRef<HTMLDivElement>(null);
  
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
    resetTransaction
  } = usePosRefactored();

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Receipt-${new Date().toISOString().split('T')[0]}`,
  });

  useEffect(() => {
    if (showReceipt && receiptRef.current) {
      setTimeout(() => {
        handlePrint();
      }, 100);
    }
  }, [showReceipt, handlePrint]);

  const cartTotal = cart.reduce((sum, item) => sum + (item.harga * item.qty), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="min-h-screen bg-slate-50 p-2 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
              POS / Kasir 🛒
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Manage your point of sale transactions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Products Section */}
            <div className="lg:col-span-2 space-y-4">
              <Card className="bg-white border-0 shadow-sm rounded-2xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl font-semibold text-slate-800">
                    Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-24 sm:h-32 bg-slate-200 rounded-xl animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {products.map((product) => (
                        <Card 
                          key={product.id} 
                          className="cursor-pointer hover:shadow-md transition-all duration-200 border border-slate-200 rounded-xl overflow-hidden group"
                          onClick={() => addToCart(product)}
                        >
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex flex-col h-full">
                              <h3 className="font-semibold text-slate-800 text-sm sm:text-base mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {product.nama}
                              </h3>
                              <p className="text-xs sm:text-sm text-slate-500 mb-2">
                                {product.kategori}
                              </p>
                              <div className="mt-auto flex items-center justify-between">
                                <span className="font-bold text-emerald-600 text-sm sm:text-base">
                                  {formatCurrency(product.harga, 'IDR')}
                                </span>
                                <Button 
                                  size="sm" 
                                  className="bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg h-7 w-7 p-0 sm:h-8 sm:w-8"
                                >
                                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Cart & Payment Section */}
            <div className="lg:col-span-1 space-y-4">
              {/* Cart */}
              <Card className="bg-white border-0 shadow-sm rounded-2xl sticky top-4">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg sm:text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Cart
                    {cartItemCount > 0 && (
                      <Badge className="bg-blue-100 text-blue-600 rounded-full">
                        {cartItemCount}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.length === 0 ? (
                    <div className="text-center py-6 sm:py-8 text-slate-500">
                      <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-4 text-slate-300" />
                      <p className="text-sm sm:text-base">Your cart is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-64 sm:max-h-80 overflow-y-auto">
                      {cart.map((item) => (
                        <div key={item.id} className="bg-slate-50 rounded-xl p-3">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-slate-800 text-sm flex-1 pr-2">
                              {item.nama}
                            </h4>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeFromCart(item.id)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg flex-shrink-0"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.qty - 1)}
                                className="h-7 w-7 p-0 rounded-lg"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="font-medium text-sm w-8 text-center">
                                {item.qty}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, item.qty + 1)}
                                className="h-7 w-7 p-0 rounded-lg"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <span className="font-semibold text-emerald-600 text-sm">
                              {formatCurrency(item.harga * item.qty, 'IDR')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {cart.length > 0 && (
                    <>
                      <Separator />
                      
                      {/* Customer Name */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Customer Name (Optional)
                        </label>
                        <Input
                          placeholder="Enter customer name"
                          value={transaction.nama_pembeli || ''}
                          onChange={(e) => updateCustomerName(e.target.value)}
                          className="rounded-xl"
                        />
                      </div>

                      {/* Payment Method */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Payment Method
                        </label>
                        <Select
                          value={transaction.metode_pembayaran}
                          onValueChange={(value: 'Cash' | 'Bank Transfer' | 'QRIS') => updatePaymentMethod(value)}
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Cash">
                              <div className="flex items-center gap-2">
                                <Banknote className="h-4 w-4" />
                                Cash
                              </div>
                            </SelectItem>
                            <SelectItem value="Bank Transfer">
                              <div className="flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                Bank Transfer
                              </div>
                            </SelectItem>
                            <SelectItem value="QRIS">
                              <div className="flex items-center gap-2">
                                <Smartphone className="h-4 w-4" />
                                QRIS
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Cash Payment */}
                      {transaction.metode_pembayaran === 'Cash' && (
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            Cash Received
                          </label>
                          <Input
                            type="number"
                            placeholder="Enter cash amount"
                            value={transaction.uang_diterima || ''}
                            onChange={(e) => updateCashReceived(Number(e.target.value))}
                            className="rounded-xl"
                          />
                          {transaction.kembalian !== undefined && transaction.kembalian >= 0 && (
                            <p className="text-sm text-emerald-600 font-medium">
                              Change: {formatCurrency(transaction.kembalian, 'IDR')}
                            </p>
                          )}
                        </div>
                      )}

                      <Separator />
                      
                      {/* Total */}
                      <div className="bg-emerald-50 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-slate-800">Total:</span>
                          <span className="text-xl font-bold text-emerald-600">
                            {formatCurrency(cartTotal, 'IDR')}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2">
                        <Button 
                          onClick={saveTransaction}
                          disabled={loading}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-12 font-semibold"
                        >
                          {loading ? 'Processing...' : 'Complete Transaction'}
                        </Button>
                        <Button 
                          onClick={resetTransaction}
                          variant="outline"
                          className="w-full rounded-xl h-10"
                        >
                          Clear Cart
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Hidden Receipt for Printing */}
          <div className="hidden">
            {showReceipt && (
              <PosReceipt 
                ref={receiptRef}
                transaction={transaction}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
