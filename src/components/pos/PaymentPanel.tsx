import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatRupiah, parseRupiah } from '@/utils/formatRupiah';
import { PosTransaction } from '@/hooks/usePos';
import { CreditCard, Banknote, QrCode, ShoppingCart, RotateCcw } from 'lucide-react';

interface PaymentPanelProps {
  transaction: PosTransaction;
  onPaymentMethodChange: (method: 'Cash' | 'Bank Transfer' | 'QRIS') => void;
  onCashReceivedChange: (amount: number) => void;
  onCustomerNameChange: (name: string) => void;
  onSaveTransaction: () => void;
  onResetTransaction: () => void;
  loading: boolean;
}

export function PaymentPanel({ 
  transaction, 
  onPaymentMethodChange,
  onCashReceivedChange,
  onCustomerNameChange, 
  onSaveTransaction,
  onResetTransaction,
  loading
}: PaymentPanelProps) {
  const [cashReceived, setCashReceived] = useState<string>('');
  
  useEffect(() => {
    if (transaction.uang_diterima) {
      setCashReceived(formatRupiah(transaction.uang_diterima));
    } else {
      setCashReceived('');
    }
  }, [transaction.uang_diterima]);

  const handleCashReceivedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCashReceived(value);
    
    const numericValue = parseRupiah(value);
    if (!isNaN(numericValue)) {
      onCashReceivedChange(numericValue);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSaveTransaction();
  };

  const isPaymentValid = () => {
    if (transaction.produk.length === 0) return false;
    if (transaction.metode_pembayaran === 'Cash') {
      return transaction.uang_diterima && transaction.uang_diterima >= transaction.total;
    }
    return true;
  };

  return (
    <Card className="bg-white rounded-2xl border border-slate-200/60 shadow-sm">
      <CardHeader className="py-4 px-6 bg-gradient-to-b from-slate-50 to-white border-b">
        <CardTitle className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Pembayaran
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer-name" className="text-xs font-medium text-slate-600">
              Nama Pembeli (Opsional)
            </Label>
            <Input
              id="customer-name"
              placeholder="Masukkan nama pembeli..."
              value={transaction.nama_pembeli || ''}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              className="h-9 text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-slate-600">Metode Pembayaran</Label>
            <RadioGroup 
              value={transaction.metode_pembayaran} 
              onValueChange={(value: 'Cash' | 'Bank Transfer' | 'QRIS') => onPaymentMethodChange(value)}
              className="grid grid-cols-1 gap-2"
            >
              <div className="flex items-center space-x-2 border rounded-xl p-3 cursor-pointer hover:bg-slate-50 transition-all duration-200 data-[state=checked]:border-emerald-500 data-[state=checked]:bg-emerald-50/50" data-state={transaction.metode_pembayaran === 'Cash' ? 'checked' : 'unchecked'}>
                <RadioGroupItem value="Cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center cursor-pointer flex-1">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center mr-3">
                    <Banknote className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700">Tunai</span>
                    <p className="text-xs text-slate-500">Pembayaran dengan uang tunai</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-xl p-3 cursor-pointer hover:bg-slate-50 transition-all duration-200 data-[state=checked]:border-blue-500 data-[state=checked]:bg-blue-50/50" data-state={transaction.metode_pembayaran === 'Bank Transfer' ? 'checked' : 'unchecked'}>
                <RadioGroupItem value="Bank Transfer" id="bank" />
                <Label htmlFor="bank" className="flex items-center cursor-pointer flex-1">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                    <CreditCard className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700">Transfer Bank</span>
                    <p className="text-xs text-slate-500">Transfer melalui rekening bank</p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-xl p-3 cursor-pointer hover:bg-slate-50 transition-all duration-200 data-[state=checked]:border-purple-500 data-[state=checked]:bg-purple-50/50" data-state={transaction.metode_pembayaran === 'QRIS' ? 'checked' : 'unchecked'}>
                <RadioGroupItem value="QRIS" id="qris" />
                <Label htmlFor="qris" className="flex items-center cursor-pointer flex-1">
                  <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center mr-3">
                    <QrCode className="h-4 w-4 text-purple-500" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-700">QRIS</span>
                    <p className="text-xs text-slate-500">Scan QRIS untuk pembayaran digital</p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {transaction.metode_pembayaran === 'Cash' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cash-received" className="text-xs font-medium text-slate-600">
                  Uang Diterima
                </Label>
                <Input
                  id="cash-received"
                  placeholder="Rp0"
                  value={cashReceived}
                  onChange={handleCashReceivedChange}
                  className="text-sm h-9"
                />
              </div>
              {transaction.kembalian !== undefined && (
                <div className="bg-slate-50 rounded-xl border p-3">
                  <div className="text-xs font-medium text-slate-600 mb-1">Kembalian</div>
                  <div className="text-base font-semibold">
                    {transaction.kembalian >= 0 
                      ? <span className="text-emerald-600">{formatRupiah(transaction.kembalian)}</span>
                      : <span className="text-red-500">Kurang {formatRupiah(Math.abs(transaction.kembalian))}</span>
                    }
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t space-y-4">
            <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl border p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-xs font-medium text-slate-600">Total Pembayaran</div>
                  <div className="text-lg font-bold text-slate-800 mt-0.5">
                    {formatRupiah(transaction.total)}
                  </div>
                </div>
                {transaction.produk.length > 0 && (
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-slate-600" />
                  </div>
                )}
              </div>
              
              {!isPaymentValid() && transaction.produk.length > 0 && (
                <div className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg mt-2">
                  {transaction.metode_pembayaran === 'Cash' && transaction.uang_diterima < transaction.total 
                    ? 'Jumlah uang yang diterima kurang dari total pembayaran'
                    : 'Mohon lengkapi detail pembayaran'}
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1 bg-[#35e974] hover:bg-[#2ed367] text-black h-11 text-sm transition-all duration-200 disabled:opacity-50"
                disabled={loading || !isPaymentValid()}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onResetTransaction}
                className="h-11 w-11 border-slate-200 hover:bg-red-50 hover:text-red-500 transition-colors duration-200"
                title="Reset transaksi"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
