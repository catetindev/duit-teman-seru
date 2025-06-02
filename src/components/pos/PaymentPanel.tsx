
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
    <Card className="bg-white shadow-lg">
      <CardHeader className="pb-4 bg-gradient-to-r from-emerald-50 to-teal-50">
        <CardTitle className="text-xl font-semibold text-emerald-700 flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          💳 Pembayaran
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="customer-name" className="text-sm font-medium text-gray-700">
              👤 Nama Pembeli (Opsional)
            </Label>
            <Input
              id="customer-name"
              placeholder="Masukkan nama pembeli..."
              value={transaction.nama_pembeli || ''}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              className="border-gray-300 focus:border-emerald-400 focus:ring-emerald-400"
            />
          </div>
          
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">💳 Metode Pembayaran</Label>
            <RadioGroup 
              value={transaction.metode_pembayaran} 
              onValueChange={(value: 'Cash' | 'Bank Transfer' | 'QRIS') => onPaymentMethodChange(value)}
              className="flex flex-col space-y-3"
            >
              <div className="flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer hover:bg-green-50 transition-colors border-gray-200 hover:border-green-300">
                <RadioGroupItem value="Cash" id="cash" className="text-green-600" />
                <Label htmlFor="cash" className="flex items-center cursor-pointer font-medium">
                  <Banknote size={20} className="mr-3 text-green-600" />
                  💵 Tunai
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer hover:bg-blue-50 transition-colors border-gray-200 hover:border-blue-300">
                <RadioGroupItem value="Bank Transfer" id="bank" className="text-blue-600" />
                <Label htmlFor="bank" className="flex items-center cursor-pointer font-medium">
                  <CreditCard size={20} className="mr-3 text-blue-600" />
                  🏦 Transfer Bank
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 border-2 rounded-lg p-4 cursor-pointer hover:bg-purple-50 transition-colors border-gray-200 hover:border-purple-300">
                <RadioGroupItem value="QRIS" id="qris" className="text-purple-600" />
                <Label htmlFor="qris" className="flex items-center cursor-pointer font-medium">
                  <QrCode size={20} className="mr-3 text-purple-600" />
                  📱 QRIS
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {transaction.metode_pembayaran === 'Cash' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cash-received" className="text-sm font-medium text-gray-700">
                  💰 Uang Diterima
                </Label>
                <Input
                  id="cash-received"
                  placeholder="Rp0"
                  value={cashReceived}
                  onChange={handleCashReceivedChange}
                  className="text-lg font-medium border-gray-300 focus:border-green-400 focus:ring-green-400"
                />
              </div>
              
              {transaction.kembalian !== undefined && (
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-lg border-2 border-emerald-200">
                  <div className="font-medium text-emerald-700 mb-1">💸 Kembalian</div>
                  <div className="text-2xl font-bold">
                    {transaction.kembalian >= 0 
                      ? <span className="text-green-600">{formatRupiah(transaction.kembalian)}</span>
                      : <span className="text-red-500">Kurang {formatRupiah(Math.abs(transaction.kembalian))}</span>
                    }
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 border-t border-gray-200">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg mb-4">
              <div className="font-medium text-gray-700 mb-1">💰 Total Pembayaran</div>
              <div className="text-3xl font-bold text-purple-700">
                {formatRupiah(transaction.total)}
              </div>
            </div>
          
            <div className="flex gap-3">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-3 text-lg shadow-lg"
                disabled={loading || !isPaymentValid()}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                💾 Simpan Transaksi
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={onResetTransaction}
                className="flex-1 border-2 border-gray-300 hover:bg-gray-50 font-semibold py-3 text-lg"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                🔄 Transaksi Baru
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
