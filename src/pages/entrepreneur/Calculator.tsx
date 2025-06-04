
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calculator as CalculatorIcon, TrendingUp, Percent } from 'lucide-react';
import { formatRupiah, parseRupiah } from '@/utils/formatRupiah';
import { useAuth } from '@/contexts/AuthContext';

const Calculator = () => {
  const { isPremium } = useAuth();
  const [modalAwal, setModalAwal] = useState<string>('');
  const [biayaProduksi, setBiayaProduksi] = useState<string>('');
  const [biayaOperasional, setBiayaOperasional] = useState<string>('');
  const [marginKeuntungan, setMarginKeuntungan] = useState<string>('20');
  const [hasil, setHasil] = useState<{
    hpp: number;
    hargaJual: number;
    keuntungan: number;
  } | null>(null);

  const hitungHPP = () => {
    const modal = parseRupiah(modalAwal);
    const produksi = parseRupiah(biayaProduksi);
    const operasional = parseRupiah(biayaOperasional);
    const margin = parseFloat(marginKeuntungan) || 0;

    if (modal > 0) {
      const hpp = modal + produksi + operasional;
      const hargaJual = hpp + (hpp * margin / 100);
      const keuntungan = hargaJual - hpp;

      setHasil({
        hpp,
        hargaJual,
        keuntungan
      });
    }
  };

  const resetForm = () => {
    setModalAwal('');
    setBiayaProduksi('');
    setBiayaOperasional('');
    setMarginKeuntungan('20');
    setHasil(null);
  };

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
              <CalculatorIcon className="h-8 w-8 text-amber-600" />
              Kalkulator HPP
            </h1>
            <p className="text-slate-600">Hitung Harga Pokok Penjualan dan tentukan harga jual yang optimal</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Form */}
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800">Input Biaya</CardTitle>
                <Separator />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="modal-awal" className="text-sm font-medium text-slate-700">
                    Modal Awal / Harga Beli
                  </Label>
                  <Input
                    id="modal-awal"
                    placeholder="Rp 0"
                    value={modalAwal}
                    onChange={(e) => setModalAwal(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biaya-produksi" className="text-sm font-medium text-slate-700">
                    Biaya Produksi (Opsional)
                  </Label>
                  <Input
                    id="biaya-produksi"
                    placeholder="Rp 0"
                    value={biayaProduksi}
                    onChange={(e) => setBiayaProduksi(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="biaya-operasional" className="text-sm font-medium text-slate-700">
                    Biaya Operasional (Opsional)
                  </Label>
                  <Input
                    id="biaya-operasional"
                    placeholder="Rp 0"
                    value={biayaOperasional}
                    onChange={(e) => setBiayaOperasional(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="margin-keuntungan" className="text-sm font-medium text-slate-700">
                    Margin Keuntungan (%)
                  </Label>
                  <div className="relative">
                    <Input
                      id="margin-keuntungan"
                      type="number"
                      placeholder="20"
                      value={marginKeuntungan}
                      onChange={(e) => setMarginKeuntungan(e.target.value)}
                      className="h-12 text-base pr-10"
                    />
                    <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={hitungHPP} 
                    className="flex-1 h-12 bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    <CalculatorIcon className="mr-2 h-4 w-4" />
                    Hitung HPP
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetForm}
                    className="h-12 px-6 border-slate-300"
                  >
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="bg-white shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-600" />
                  Hasil Perhitungan
                </CardTitle>
                <Separator />
              </CardHeader>
              <CardContent>
                {hasil ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="bg-slate-50 rounded-xl p-4 border">
                        <div className="text-sm font-medium text-slate-600 mb-1">Harga Pokok Penjualan (HPP)</div>
                        <div className="text-xl font-bold text-slate-800">
                          {formatRupiah(hasil.hpp)}
                        </div>
                      </div>

                      <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                        <div className="text-sm font-medium text-emerald-700 mb-1">Harga Jual Disarankan</div>
                        <div className="text-2xl font-bold text-emerald-800">
                          {formatRupiah(hasil.hargaJual)}
                        </div>
                      </div>

                      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                        <div className="text-sm font-medium text-amber-700 mb-1">Keuntungan per Unit</div>
                        <div className="text-xl font-bold text-amber-800">
                          {formatRupiah(hasil.keuntungan)}
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <h4 className="font-medium text-blue-800 mb-2">Analisis:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Margin keuntungan: {marginKeuntungan}%</li>
                        <li>• HPP mencakup semua biaya produksi</li>
                        <li>• Harga jual sudah termasuk margin keuntungan</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <CalculatorIcon className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500">Hasil perhitungan akan muncul di sini</p>
                      <p className="text-sm text-slate-400 mt-1">Masukkan nilai dan klik "Hitung HPP"</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Tips */}
          <Card className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-800 mb-3">💡 Tips Menentukan Harga Jual:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                <div>
                  <p>• <strong>Riset pasar:</strong> Bandingkan dengan kompetitor</p>
                  <p>• <strong>Margin fleksibel:</strong> Sesuaikan dengan target market</p>
                </div>
                <div>
                  <p>• <strong>Biaya tersembunyi:</strong> Jangan lupa biaya marketing</p>
                  <p>• <strong>Volume penjualan:</strong> Pertimbangkan quantity discount</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Calculator;
