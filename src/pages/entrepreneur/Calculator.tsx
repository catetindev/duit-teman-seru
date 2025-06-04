
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Calculator as CalculatorIcon, Percent, TrendingUp, DollarSign } from 'lucide-react';
import { formatRupiah } from '@/utils/formatRupiah';

const Calculator = () => {
  const { isPremium } = useAuth();
  
  // State for basic calculations
  const [costPrice, setCostPrice] = useState<string>('');
  const [desiredMargin, setDesiredMargin] = useState<string>('');
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [profit, setProfit] = useState<number>(0);
  const [marginPercentage, setMarginPercentage] = useState<number>(0);

  // State for bulk calculations
  const [quantity, setQuantity] = useState<string>('');
  const [totalCost, setTotalCost] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [totalProfit, setTotalProfit] = useState<number>(0);

  const calculatePricing = () => {
    const cost = parseFloat(costPrice) || 0;
    const margin = parseFloat(desiredMargin) || 0;
    
    if (cost > 0 && margin > 0) {
      const selling = cost + (cost * margin / 100);
      const profitAmount = selling - cost;
      
      setSellingPrice(selling);
      setProfit(profitAmount);
      setMarginPercentage(margin);
      
      // Calculate bulk if quantity is provided
      const qty = parseFloat(quantity) || 1;
      setTotalCost(cost * qty);
      setTotalRevenue(selling * qty);
      setTotalProfit(profitAmount * qty);
    }
  };

  const resetCalculator = () => {
    setCostPrice('');
    setDesiredMargin('');
    setQuantity('');
    setSellingPrice(0);
    setProfit(0);
    setMarginPercentage(0);
    setTotalCost(0);
    setTotalRevenue(0);
    setTotalProfit(0);
  };

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6 px-2">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                <CalculatorIcon className="h-6 w-6 text-emerald-600" />
              </div>
              Kalkulator Harga
            </h1>
            <p className="text-slate-600">Hitung harga jual optimal untuk produk Anda</p>
          </div>

          {/* Content */}
          <div className="px-2 space-y-6">
            {/* Input Form */}
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                  Input Perhitungan
                </CardTitle>
                <Separator />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="cost-price" className="text-sm font-medium text-slate-700">
                      Harga Pokok/Modal (Rp)
                    </Label>
                    <Input
                      id="cost-price"
                      type="number"
                      placeholder="Masukkan harga modal..."
                      value={costPrice}
                      onChange={(e) => setCostPrice(e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="desired-margin" className="text-sm font-medium text-slate-700">
                      Margin Keuntungan (%)
                    </Label>
                    <Input
                      id="desired-margin"
                      type="number"
                      placeholder="Masukkan persentase margin..."
                      value={desiredMargin}
                      onChange={(e) => setDesiredMargin(e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="quantity" className="text-sm font-medium text-slate-700">
                      Kuantitas (opsional)
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="Masukkan jumlah produk..."
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="h-11"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={calculatePricing}
                    className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <CalculatorIcon className="mr-2 h-4 w-4" />
                    Hitung Harga
                  </Button>
                  <Button 
                    onClick={resetCalculator}
                    variant="outline"
                    className="h-11"
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {sellingPrice > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Single Product Results */}
                <Card className="bg-white shadow-sm border-slate-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      Hasil Per Unit
                    </CardTitle>
                    <Separator />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                        <div className="text-sm font-medium text-emerald-800 mb-1">Harga Jual</div>
                        <div className="text-2xl font-bold text-emerald-900">
                          {formatRupiah(sellingPrice)}
                        </div>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="text-sm font-medium text-blue-800 mb-1">Keuntungan</div>
                        <div className="text-xl font-bold text-blue-900">
                          {formatRupiah(profit)}
                        </div>
                      </div>

                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="text-sm font-medium text-purple-800 mb-1">Margin</div>
                        <div className="text-xl font-bold text-purple-900 flex items-center gap-1">
                          <Percent className="h-5 w-5" />
                          {marginPercentage.toFixed(1)}%
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
                        Hasil Total ({quantity} unit)
                      </CardTitle>
                      <Separator />
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <div className="text-sm font-medium text-red-800 mb-1">Total Modal</div>
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
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Tips */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800">💡 Tips Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                  <div>
                    <h4 className="font-medium mb-2">Margin yang Disarankan:</h4>
                    <ul className="space-y-1 text-blue-600">
                      <li>• Produk digital: 70-90%</li>
                      <li>• Makanan/minuman: 60-80%</li>
                      <li>• Fashion: 50-100%</li>
                      <li>• Elektronik: 10-30%</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Faktor Pertimbangan:</h4>
                    <ul className="space-y-1 text-blue-600">
                      <li>• Kompetitor pricing</li>
                      <li>• Target market</li>
                      <li>• Brand positioning</li>
                      <li>• Volume penjualan</li>
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
