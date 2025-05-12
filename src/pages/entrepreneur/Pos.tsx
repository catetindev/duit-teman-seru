
import React, { useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { usePos } from '@/hooks/usePos';
import { ProductCard } from '@/components/pos/ProductCard';
import { CartItem } from '@/components/pos/CartItem';
import { PaymentPanel } from '@/components/pos/PaymentPanel';
import { PosReceipt } from '@/components/pos/PosReceipt';
import { formatRupiah } from '@/utils/formatRupiah';
import { Printer, RefreshCcw } from 'lucide-react';

const Pos = () => {
  const { isPremium } = useAuth();
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
    saveTransaction,
    resetTransaction,
    fetchProducts,
    fetchRecentTransactions,
  } = usePos();
  
  const [searchTerm, setSearchTerm] = React.useState('');
  const [activeTab, setActiveTab] = React.useState('all');
  const [receiptVisible, setReceiptVisible] = React.useState(false);
  
  // Filter products based on search term and active tab
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeTab === 'all' || activeTab === 'favorit'; // Implement favorites if needed
    return matchesSearch && matchesCategory;
  });
  
  // Handle print receipt
  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `Receipt_${new Date().toISOString()}`,
    onAfterPrint: () => {
      setReceiptVisible(false);
      toast({
        title: 'Struk Siap!',
        description: 'Struk berhasil dicetak',
      });
    },
  });
  
  const printReceipt = () => {
    setReceiptVisible(true);
    setTimeout(() => {
      handlePrint();
    }, 100);
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
        {/* Product Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white">
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle className="text-xl">Daftar Produk</CardTitle>
                  <CardDescription>Pilih produk untuk ditambahkan ke keranjang</CardDescription>
                </div>
                
                {/* Search and Tabs */}
                <div className="w-full md:w-auto">
                  <Input
                    type="search"
                    placeholder="Cari produk..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-3"
                  />
                  
                  <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="w-full">
                      <TabsTrigger value="all" className="flex-1">Semua</TabsTrigger>
                      <TabsTrigger value="favorit" className="flex-1">Favorit</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {!loading && filteredProducts.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-lg text-muted-foreground">Belum ada produk</p>
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
                  <p className="text-muted-foreground">Memuat produk...</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Recent Transactions */}
          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex justify-between items-center">
                <span>Transaksi Terbaru</span>
                <Button variant="ghost" size="icon" onClick={fetchRecentTransactions}>
                  <RefreshCcw size={18} />
                </Button>
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              {recentTransactions.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">Belum ada transaksi</p>
              ) : (
                <div className="space-y-4">
                  {recentTransactions.map((tx) => (
                    <div key={tx.id} className="border rounded-lg p-3 hover:bg-slate-50">
                      <div className="flex justify-between mb-1">
                        <div className="font-medium">
                          {tx.nama_pembeli || 'Pelanggan'}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(tx.created_at).toLocaleDateString('id-ID')}
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <div className="text-sm text-muted-foreground">
                          {tx.metode_pembayaran} • {tx.produk.length} items
                        </div>
                        <div className="font-medium text-purple-700">
                          {formatRupiah(tx.total)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Order Section */}
        <div className="space-y-6">
          {/* Cart */}
          <Card className="bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex justify-between items-center">
                <span>Keranjang</span>
                <span className="text-muted-foreground text-sm font-normal">
                  {transaction.produk.length} item
                </span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              {transaction.produk.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">Keranjang kosong</p>
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
                  
                  <div className="p-6 pt-3 border-t">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatRupiah(transaction.total)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="font-medium">Total Bayar</span>
                      <span className="font-bold text-lg text-purple-700">{formatRupiah(transaction.total)}</span>
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
            onSaveTransaction={saveTransaction}
            onResetTransaction={resetTransaction}
            loading={loading}
          />
          
          {/* Print Receipt Button */}
          {transaction.produk.length > 0 && (
            <Button
              onClick={printReceipt}
              className="w-full bg-gradient-to-r from-[#E5E0FF] to-[#CAB8FF] hover:from-[#CAB8FF] hover:to-[#B69FFF] text-purple-900"
            >
              <Printer size={18} className="mr-2" />
              Cetak Struk
            </Button>
          )}
          
          {/* Hidden Receipt for Printing */}
          <div className="hidden">
            {receiptVisible && (
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
};

export default Pos;
