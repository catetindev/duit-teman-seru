
import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import dayjs from 'dayjs';
import { Printer, RefreshCcw, Trash2, Plus, ArrowDownToLine, Receipt, ShoppingBag } from 'lucide-react';

// Layout and contexts
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Custom components
import { ProductCard } from '@/components/pos/ProductCard';
import { CartItem } from '@/components/pos/CartItem';
import { PaymentPanel } from '@/components/pos/PaymentPanel';
import { PosReceipt } from '@/components/pos/PosReceipt';

// Hooks and utilities
import { useToast } from '@/hooks/use-toast';
import { usePos } from '@/hooks/usePos';
import { useTransactionManagement } from '@/hooks/pos/useTransactionManagement';
import { formatRupiah } from '@/utils/formatRupiah';
import type { PosTransaction, PosProduct } from '@/types/pos';

// Available product categories
const categories = ['Makanan', 'Minuman', 'Snack', 'Lainnya'];

const Pos = () => {
  const { isPremium, user } = useAuth();
  const { toast } = useToast();
  const receiptRef = useRef<HTMLDivElement>(null);
  
  const {
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
    resetTransaction,
    fetchProducts,
    fetchRecentTransactions,
    saveTransaction,
  } = usePos();

  const { deleteTransaction } = useTransactionManagement();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState(''); // New state for product search
  const [activeTab, setActiveTab] = useState('all');
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [completedTransaction, setCompletedTransaction] = useState<PosTransaction | null>(null);
  const [category, setCategory] = useState('all');

  const exportTransactions = () => {
    // TODO: Implement export functionality
    toast({
      title: "Coming Soon",
      description: "Export functionality will be available soon",
    });
  };

  // Handle print receipt
  const handlePrint = useReactToPrint({
    documentTitle: `Receipt_${new Date().toISOString()}`,
    onAfterPrint: () => {
      setReceiptVisible(false);
      setCompletedTransaction(null);
      toast({
        title: 'Struk Siap!',
        description: 'Struk berhasil dicetak',
      });
    },
    contentRef: receiptRef,
  });
  
  const printReceipt = (transactionData) => {
    setCompletedTransaction(transactionData);
    setReceiptVisible(true);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  const printSpecificReceipt = (transactionData: PosTransaction) => {
    setCompletedTransaction(transactionData);
    setReceiptVisible(true);
    setTimeout(() => {
      handlePrint();
    }, 100);
  };

  const handleSaveTransaction = async (): Promise<boolean> => {
    const success = await saveTransaction();
    if (success) {
      const savedTransaction = { ...transaction };
      fetchRecentTransactions();
      
      // Show receipt after successful save
      setCompletedTransaction(savedTransaction);
      setReceiptVisible(true);
      return true;
    }
    return false;
  };

  const handleDeleteClick = async (txId: string) => {
    if (window.confirm('Yakin ingin menghapus transaksi ini?')) {
      const success = await deleteTransaction(txId);
      if (success) {
        fetchRecentTransactions();
      }
    }
  };
  
  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
    fetchRecentTransactions();
  }, []);
  
  // Filter products based on search term and active tab
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nama.toLowerCase().includes(search.toLowerCase());
    // If 'all' is selected or the product matches the selected category
    const matchesCategory = category === 'all' || (product as any).kategori === category;
    return matchesSearch && matchesCategory;
  });
  
  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">POS / Kasir</h1>
            <p className="text-slate-600 mt-1">Kelola penjualan dan transaksi dengan mudah</p>
          </div>
        </div>
        
        {/* Main Grid Layout - Responsive 2 columns */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Section - Products & Transactions (2/3 on xl screens) */}
          <div className="xl:col-span-2 space-y-6">
            {/* Product Search & Grid */}
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-800">Produk</CardTitle>
                    <CardDescription className="text-sm text-slate-500">
                      Pilih produk untuk ditambahkan ke keranjang
                    </CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="w-full sm:w-[160px]">
                        <SelectValue placeholder="Semua Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Semua Kategori</SelectItem>
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="search"
                      placeholder="Cari produk..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full sm:w-[200px]"
                    />
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {!loading && filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-sm font-medium text-slate-800">Belum ada produk</p>
                    <p className="text-xs text-slate-600 mt-1">Tambahkan produk terlebih dahulu di menu Produk</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} onAdd={addToCart} />
                    ))}
                  </div>
                )}
                {loading && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-slate-600 mt-2">Memuat produk...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle className="text-lg font-semibold text-slate-800">
                      Transaksi Terakhir
                    </CardTitle>
                    <CardDescription className="text-sm text-slate-500">
                      Riwayat transaksi hari ini
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportTransactions}
                    className="w-full sm:w-auto"
                  >
                    <ArrowDownToLine className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentTransactions.length === 0 ? (
                    <div className="text-center py-8">
                      <Receipt className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-sm text-slate-600">Belum ada transaksi hari ini</p>
                    </div>
                  ) : (
                    recentTransactions.map((tx) => (
                      <div
                        key={`pos-${tx.id}`}
                        className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
                            <Receipt className="h-5 w-5 text-purple-500" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-slate-800 truncate">
                              {tx.nama_pembeli || "Customer"}
                            </p>
                            <p className="text-xs text-slate-500">
                              {dayjs(tx.tanggal).format("HH:mm")} • {tx.metode_pembayaran}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <p className="text-sm font-semibold text-slate-800">
                            {formatRupiah(tx.total)}
                          </p>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteClick(`pos-${tx.id}`)}
                              className="h-8 w-8 hover:bg-red-50 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => printSpecificReceipt(tx as PosTransaction)}
                              className="h-8 w-8 hover:bg-slate-100"
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Section - Cart & Payment (1/3 on xl screens) */}
          <div className="xl:col-span-1">
            <div className="space-y-6 xl:sticky xl:top-6">
              {/* Cart Section */}
              <Card className="bg-white shadow-sm border-slate-200">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg font-semibold text-slate-800">
                        Keranjang
                      </CardTitle>
                      <CardDescription className="text-sm text-slate-500">
                        {transaction.produk.length} item
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0">
                  {transaction.produk.length === 0 ? (
                    <div className="text-center py-12 px-6">
                      <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm font-medium text-slate-800">Keranjang kosong</p>
                      <p className="text-xs text-slate-500 mt-1">Pilih produk untuk memulai transaksi</p>
                    </div>
                  ) : (
                    <>
                      <ScrollArea className="h-[280px]">
                        <div className="px-6 py-4 space-y-3">
                          {transaction.produk.map((item) => (
                            <CartItem
                              key={item.id}
                              product={item}
                              onUpdateQuantity={updateQuantity}
                              onRemove={removeFromCart}
                            />
                          ))}
                        </div>
                      </ScrollArea>
                      
                      <div className="p-6 border-t bg-slate-50/50">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Subtotal</span>
                            <span className="font-medium text-slate-800">{formatRupiah(transaction.total)}</span>
                          </div>
                          <div className="flex justify-between items-baseline pt-2 border-t">
                            <span className="text-sm font-medium text-slate-800">Total</span>
                            <span className="text-lg font-bold text-slate-800">{formatRupiah(transaction.total)}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Payment Panel */}
              <PaymentPanel
                transaction={transaction}
                onPaymentMethodChange={updatePaymentMethod}
                onCashReceivedChange={updateCashReceived}
                onCustomerNameChange={updateCustomerName}
                onSaveTransaction={handleSaveTransaction}
                onResetTransaction={resetTransaction}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Receipt for Printing */}
      <div className="hidden">
        {receiptVisible && completedTransaction && (
          <PosReceipt
            ref={receiptRef}
            transaction={completedTransaction}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Pos;
