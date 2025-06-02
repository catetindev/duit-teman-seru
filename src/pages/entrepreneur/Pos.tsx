
import React, { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { usePos } from '@/hooks/usePos';
import { ProductCard } from '@/components/pos/ProductCard';
import { CartItem } from '@/components/pos/CartItem';
import { PaymentPanel } from '@/components/pos/PaymentPanel';
import { PosReceipt } from '@/components/pos/PosReceipt';
import { formatRupiah } from '@/utils/formatRupiah';
import { Printer, RefreshCcw, Trash2, Plus } from 'lucide-react';
import { useTransactionManagement } from '@/hooks/pos/useTransactionManagement';

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
  } = usePos();

  const { saveTransaction, deleteTransaction } = useTransactionManagement();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [completedTransaction, setCompletedTransaction] = useState(null);
  
  // Filter products based on search term and active tab
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === 'all' || activeTab === 'favorit';
    return matchesSearch && matchesCategory;
  });
  
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

  const handleSaveTransaction = async () => {
    const success = await saveTransaction(transaction);
    if (success) {
      const savedTransaction = { ...transaction };
      resetTransaction();
      fetchRecentTransactions();
      
      // Show receipt after successful save
      setCompletedTransaction(savedTransaction);
      setReceiptVisible(true);
    }
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
  
  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gradient">POS / Kasir</h1>
        <p className="text-muted-foreground">Kelola penjualan dan transaksi dengan mudah</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Section - Enhanced UI */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-blue-50">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="text-xl text-purple-700">Daftar Produk</CardTitle>
                  <CardDescription>Pilih produk untuk ditambahkan ke keranjang</CardDescription>
                </div>
                
                {/* Enhanced Search and Tabs */}
                <div className="w-full md:w-auto">
                  <Input
                    type="search"
                    placeholder="🔍 Cari produk..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-3 border-purple-200 focus:border-purple-400"
                  />
                  
                  <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="w-full bg-purple-100">
                      <TabsTrigger value="all" className="flex-1 data-[state=active]:bg-purple-500 data-[state=active]:text-white">Semua</TabsTrigger>
                      <TabsTrigger value="favorit" className="flex-1 data-[state=active]:bg-purple-500 data-[state=active]:text-white">Favorit</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {!loading && filteredProducts.length === 0 ? (
                <div className="text-center py-10">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Plus className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-lg text-muted-foreground font-medium">Belum ada produk</p>
                  <p className="text-sm text-muted-foreground">Tambahkan produk terlebih dahulu di menu Produk</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAdd={addToCart}
                    />
                  ))}
                </div>
              )}
              
              {loading && (
                <div className="text-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Memuat produk...</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Recent Transactions - Enhanced UI */}
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-3 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex justify-between items-center text-green-700">
                <span>📊 Transaksi Terbaru</span>
                <Button variant="ghost" size="icon" onClick={fetchRecentTransactions} className="hover:bg-green-100">
                  <RefreshCcw size={18} />
                </Button>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              {recentTransactions.length === 0 ? (
                <div className="text-center py-8">
                  <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">📝</span>
                  </div>
                  <p className="text-center text-muted-foreground">Belum ada transaksi</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="border border-gray-200 rounded-lg p-4 hover:bg-slate-50 transition-colors shadow-sm">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <div className="font-medium text-purple-700">
                              {tx.nama_pembeli || 'Pelanggan'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(tx.created_at).toLocaleDateString('id-ID')}
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="text-sm text-muted-foreground">
                              {tx.metode_pembayaran} • {tx.produk.length} items
                            </div>
                            <div className="font-bold text-green-600">
                              {formatRupiah(tx.total)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => printReceipt(tx)}
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                            title="Print Struk"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(tx.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            title="Hapus Transaksi"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Order Section - Enhanced UI */}
        <div className="space-y-6">
          {/* Cart - Enhanced UI */}
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-3 bg-gradient-to-r from-orange-50 to-yellow-50">
              <CardTitle className="flex justify-between items-center text-orange-700">
                <span>🛒 Keranjang</span>
                <span className="text-muted-foreground text-sm font-normal bg-orange-100 px-3 py-1 rounded-full">
                  {transaction.produk.length} item
                </span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              {transaction.produk.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🛒</span>
                  </div>
                  <p className="text-muted-foreground font-medium">Keranjang kosong</p>
                  <p className="text-xs text-muted-foreground mt-1">Pilih produk dari daftar di samping</p>
                </div>
              ) : (
                <>
                  <ScrollArea className="h-[300px]">
                    <div className="px-6 py-1">
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
                  
                  <div className="p-6 pt-3 border-t bg-gradient-to-r from-purple-50 to-blue-50">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatRupiah(transaction.total)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="font-medium">Total Bayar</span>
                      <span className="font-bold text-xl text-purple-700">{formatRupiah(transaction.total)}</span>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          {/* Enhanced Payment Panel */}
          <PaymentPanel
            transaction={transaction}
            onPaymentMethodChange={updatePaymentMethod}
            onCashReceivedChange={updateCashReceived}
            onCustomerNameChange={updateCustomerName}
            onSaveTransaction={handleSaveTransaction}
            onResetTransaction={resetTransaction}
            loading={loading}
          />
          
          {/* Hidden Receipt for Printing */}
          <div className="hidden">
            {receiptVisible && completedTransaction && (
              <PosReceipt
                ref={receiptRef}
                transaction={completedTransaction}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Pos;
