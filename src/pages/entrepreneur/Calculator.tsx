
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Calculator as CalculatorIcon, Percent, TrendingUp, DollarSign, Package, Truck, Users, ShoppingCart } from 'lucide-react';
import { formatRupiah } from '@/utils/formatRupiah';

const Calculator = () => {
  const { isPremium } = useAuth();
  
  // State for comprehensive pricing calculations
  const [materialCost, setMaterialCost] = useState<string>('');
  const [laborCost, setLaborCost] = useState<string>('');
  const [overheadCost, setOverheadCost] = useState<string>('');
  const [packagingCost, setPackagingCost] = useState<string>('');
  const [shippingCost, setShippingCost] = useState<string>('');
  const [marketingCost, setMarketingCost] = useState<string>('');
  const [desiredMargin, setDesiredMargin] = useState<string>('');
  const [competitorPrice, setCompetitorPrice] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  // Results state
  const [totalCOGS, setTotalCOGS] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);
  const [marginPercentage, setMarginPercentage] = useState<number>(0);
  const [markupPercentage, setMarkupPercentage] = useState<number>(0);
  const [competitiveAnalysis, setCompetitiveAnalysis] = useState<string>('');

  // State for bulk calculations
  const [quantity, setQuantity] = useState<string>('');
  const [totalCost, setTotalCost] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalProfit, setTotalProfit] = useState<number>(0);

  const calculateComprehensivePricing = () => {
    // Calculate total COGS (Cost of Goods Sold)
    const materials = parseFloat(materialCost) || 0;
    const labor = parseFloat(laborCost) || 0;
    const overhead = parseFloat(overheadCost) || 0;
    const packaging = parseFloat(packagingCost) || 0;
    const shipping = parseFloat(shippingCost) || 0;
    const marketing = parseFloat(marketingCost) || 0;
    
    const cogs = materials + labor + overhead + packaging + shipping + marketing;
    const margin = parseFloat(desiredMargin) || 0;
    const competitor = parseFloat(competitorPrice) || 0;
    
    setTotalCOGS(cogs);
    
    if (cogs > 0 && margin > 0) {
      // Calculate selling price based on margin
      const selling = cogs / (1 - margin / 100);
      const profitAmount = selling - cogs;
      const markup = cogs > 0 ? (profitAmount / cogs) * 100 : 0;
      
      setSellingPrice(selling);
      setProfit(profitAmount);
      setMarginPercentage(margin);
      setMarkupPercentage(markup);
      
      // Competitive analysis
      if (competitor > 0) {
        const difference = selling - competitor;
        const percentageDiff = (difference / competitor) * 100;
        
        if (difference > 0) {
          setCompetitiveAnalysis(`Harga Anda ${formatRupiah(difference)} (${percentageDiff.toFixed(1)}%) lebih tinggi dari kompetitor`);
        } else if (difference < 0) {
          setCompetitiveAnalysis(`Harga Anda ${formatRupiah(Math.abs(difference))} (${Math.abs(percentageDiff).toFixed(1)}%) lebih rendah dari kompetitor`);
        } else {
          setCompetitiveAnalysis('Harga Anda sama dengan kompetitor');
        }
      } else {
        setCompetitiveAnalysis('');
      }
      
      // Calculate bulk if quantity is provided
      const qty = parseFloat(quantity) || 1;
      setTotalCost(cogs * qty);
      setTotalRevenue(selling * qty);
      setTotalProfit(profitAmount * qty);
    }
  };

  const resetCalculator = () => {
    setMaterialCost('');
    setLaborCost('');
    setOverheadCost('');
    setPackagingCost('');
    setShippingCost('');
    setMarketingCost('');
    setDesiredMargin('');
    setCompetitorPrice('');
    setQuantity('');
    setNotes('');
    setTotalCOGS(0);
    setSellingPrice(0);
    setProfit(0);
    setMarginPercentage(0);
    setMarkupPercentage(0);
    setCompetitiveAnalysis('');
    setTotalCost(0);
    setTotalRevenue(0);
    setTotalProfit(0);
  };

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 px-2">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CalculatorIcon className="h-6 w-6 text-emerald-600" />
              </div>
              Kalkulator Harga Komprehensif
            </h1>
            <p className="text-slate-600">Hitung HPP (Harga Pokok Penjualan) dan harga jual optimal dengan detail lengkap</p>
          </div>

          {/* Content */}
          <div className="px-2 space-y-6">
            {/* Input Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Cost Input Panel */}
              <Card className="bg-white shadow-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    Komponen Biaya (HPP)
                  </CardTitle>
                  <Separator />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="material-cost" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Biaya Bahan Baku (Rp)
                      </Label>
                      <Input
                        id="material-cost"
                        type="number"
                        placeholder="Contoh: 50000"
                        value={materialCost}
                        onChange={(e) => setMaterialCost(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="labor-cost" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Biaya Tenaga Kerja (Rp)
                      </Label>
                      <Input
                        id="labor-cost"
                        type="number"
                        placeholder="Contoh: 25000"
                        value={laborCost}
                        onChange={(e) => setLaborCost(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="overhead-cost" className="text-sm font-medium text-slate-700">
                        Biaya Overhead (Rp)
                      </Label>
                      <Input
                        id="overhead-cost"
                        type="number"
                        placeholder="Listrik, sewa, dll"
                        value={overheadCost}
                        onChange={(e) => setOverheadCost(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="packaging-cost" className="text-sm font-medium text-slate-700">
                        Biaya Kemasan (Rp)
                      </Label>
                      <Input
                        id="packaging-cost"
                        type="number"
                        placeholder="Box, plastik, dll"
                        value={packagingCost}
                        onChange={(e) => setPackagingCost(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shipping-cost" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Biaya Pengiriman (Rp)
                      </Label>
                      <Input
                        id="shipping-cost"
                        type="number"
                        placeholder="Per unit pengiriman"
                        value={shippingCost}
                        onChange={(e) => setShippingCost(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="marketing-cost" className="text-sm font-medium text-slate-700">
                        Biaya Pemasaran (Rp)
                      </Label>
                      <Input
                        id="marketing-cost"
                        type="number"
                        placeholder="Iklan, promosi, dll"
                        value={marketingCost}
                        onChange={(e) => setMarketingCost(e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-sm font-medium text-blue-800 mb-1">Total HPP</div>
                      <div className="text-2xl font-bold text-blue-900">
                        {formatRupiah(totalCOGS)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pricing Strategy Panel */}
              <Card className="bg-white shadow-sm border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Strategi Harga
                  </CardTitle>
                  <Separator />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="desired-margin" className="text-sm font-medium text-slate-700">
                        Target Margin Keuntungan (%)
                      </Label>
                      <Input
                        id="desired-margin"
                        type="number"
                        placeholder="Contoh: 30"
                        value={desiredMargin}
                        onChange={(e) => setDesiredMargin(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="competitor-price" className="text-sm font-medium text-slate-700">
                        Harga Kompetitor (Rp) - Opsional
                      </Label>
                      <Input
                        id="competitor-price"
                        type="number"
                        placeholder="Untuk analisis kompetitif"
                        value={competitorPrice}
                        onChange={(e) => setCompetitorPrice(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="quantity" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                        <ShoppingCart className="h-4 w-4" />
                        Kuantitas Produksi
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        placeholder="Jumlah unit yang diproduksi"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-sm font-medium text-slate-700">
                        Catatan Tambahan
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder="Catatan untuk perhitungan ini..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="h-20"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 pt-4">
                    <Button 
                      onClick={calculateComprehensivePricing}
                      className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <CalculatorIcon className="mr-2 h-4 w-4" />
                      Hitung Harga Jual
                    </Button>
                    <Button 
                      onClick={resetCalculator}
                      variant="outline"
                      className="h-11"
                    >
                      Reset Semua
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            {sellingPrice > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Unit Results */}
                <Card className="bg-white shadow-sm border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-800">Hasil Per Unit</CardTitle>
                    <Separator />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <div className="text-sm font-medium text-emerald-800 mb-1">Harga Jual Optimal</div>
                      <div className="text-2xl font-bold text-emerald-900">
                        {formatRupiah(sellingPrice)}
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="text-sm font-medium text-blue-800 mb-1">Keuntungan Bersih</div>
                      <div className="text-xl font-bold text-blue-900">
                        {formatRupiah(profit)}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <div className="text-xs font-medium text-purple-800 mb-1">Margin</div>
                        <div className="text-lg font-bold text-purple-900">
                          {marginPercentage.toFixed(1)}%
                        </div>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <div className="text-xs font-medium text-orange-800 mb-1">Markup</div>
                        <div className="text-lg font-bold text-orange-900">
                          {markupPercentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Bulk Results */}
                {quantity && parseFloat(quantity) > 1 && (
                  <Card className="bg-white shadow-sm border-slate-200">
                    <CardHeader>
                      <CardTitle className="text-lg text-slate-800">
                        Total Produksi ({quantity} unit)
                      </CardTitle>
                      <Separator />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="text-sm font-medium text-red-800 mb-1">Total HPP</div>
                        <div className="text-xl font-bold text-red-900">
                          {formatRupiah(totalCost)}
                        </div>
                      </div>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="text-sm font-medium text-green-800 mb-1">Total Pendapatan</div>
                        <div className="text-xl font-bold text-green-900">
                          {formatRupiah(totalRevenue)}
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="text-sm font-medium text-amber-800 mb-1">Total Keuntungan</div>
                        <div className="text-2xl font-bold text-amber-900">
                          {formatRupiah(totalProfit)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Analysis */}
                <Card className="bg-white shadow-sm border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-800">Analisis</CardTitle>
                    <Separator />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {competitiveAnalysis && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="text-sm font-medium text-yellow-800 mb-1">Analisis Kompetitif</div>
                        <div className="text-sm text-yellow-700">{competitiveAnalysis}</div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="text-sm">
                        <span className="font-medium text-slate-700">Break Even Point:</span>
                        <span className="ml-2 text-slate-600">{formatRupiah(totalCOGS)}</span>
                      </div>
                      
                      <div className="text-sm">
                        <span className="font-medium text-slate-700">ROI:</span>
                        <span className="ml-2 text-slate-600">{markupPercentage.toFixed(1)}%</span>
                      </div>
                      
                      {notes && (
                        <div className="pt-3 border-t">
                          <div className="text-sm font-medium text-slate-700 mb-1">Catatan:</div>
                          <div className="text-sm text-slate-600 bg-slate-50 p-3 rounded border">
                            {notes}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Enhanced Tips */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">💡 Panduan Lengkap HPP & Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-blue-700">
                  <div>
                    <h4 className="font-medium mb-3">Komponen HPP:</h4>
                    <ul className="space-y-1 text-blue-600">
                      <li>• Bahan baku: Material utama</li>
                      <li>• Tenaga kerja: Upah langsung</li>
                      <li>• Overhead: Listrik, sewa, dll</li>
                      <li>• Kemasan: Packaging & labeling</li>
                      <li>• Pengiriman: Ongkos kirim</li>
                      <li>• Pemasaran: Budget iklan</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Margin Industri:</h4>
                    <ul className="space-y-1 text-blue-600">
                      <li>• Makanan: 20-40%</li>
                      <li>• Fashion: 50-100%</li>
                      <li>• Elektronik: 10-30%</li>
                      <li>• Handmade: 60-200%</li>
                      <li>• Digital: 70-90%</li>
                      <li>• Jasa: 30-60%</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Tips Pricing:</h4>
                    <ul className="space-y-1 text-blue-600">
                      <li>• Riset harga kompetitor</li>
                      <li>• Pertimbangkan value proposition</li>
                      <li>• Test market dengan A/B testing</li>
                      <li>• Review berkala setiap quarter</li>
                      <li>• Monitor margin vs volume</li>
                      <li>• Sesuaikan dengan target market</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Calculator;
