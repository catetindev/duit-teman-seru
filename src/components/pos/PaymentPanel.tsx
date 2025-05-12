
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { formatRupiah, parseRupiah } from '@/utils/formatRupiah';
import { PosTransaction } from '@/hooks/usePos';
import { CreditCard, Banknote, QrCode } from 'lucide-react';

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

  return (
    <Card className="bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold text-purple-700">Pembayaran</CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer-name">Nama Pembeli (Opsional)</Label>
            <Input
              id="customer-name"
              placeholder="Nama pembeli..."
              value={transaction.nama_pembeli || ''}
              onChange={(e) => onCustomerNameChange(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Metode Pembayaran</Label>
            <RadioGroup 
              value={transaction.metode_pembayaran} 
              onValueChange={(value: 'Cash' | 'Bank Transfer' | 'QRIS') => onPaymentMethodChange(value)}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-slate-50 transition-colors">
                <RadioGroupItem value="Cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center cursor-pointer">
                  <Banknote size={16} className="mr-2" />
                  Tunai
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-slate-50 transition-colors">
                <RadioGroupItem value="Bank Transfer" id="bank" />
                <Label htmlFor="bank" className="flex items-center cursor-pointer">
                  <CreditCard size={16} className="mr-2" />
                  Transfer Bank
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-slate-50 transition-colors">
                <RadioGroupItem value="QRIS" id="qris" />
                <Label htmlFor="qris" className="flex items-center cursor-pointer">
                  <QrCode size={16} className="mr-2" />
                  QRIS
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          {transaction.metode_pembayaran === 'Cash' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cash-received">Uang Diterima</Label>
                <Input
                  id="cash-received"
                  placeholder="Rp0"
                  value={cashReceived}
                  onChange={handleCashReceivedChange}
                  className="text-lg font-medium"
                />
              </div>
              
              {transaction.kembalian !== undefined && (
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <div className="font-medium text-purple-700">Kembalian</div>
                  <div className="text-xl font-bold">
                    {transaction.kembalian >= 0 
                      ? formatRupiah(transaction.kembalian) 
                      : <span className="text-red-500">Kurang {formatRupiah(Math.abs(transaction.kembalian))}</span>
                    }
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-4">
            <div className="font-medium">Total Pembayaran</div>
            <div className="text-2xl font-bold text-purple-700 mb-4">
              {formatRupiah(transaction.total)}
            </div>
          
            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
                disabled={loading || transaction.produk.length === 0 || (transaction.metode_pembayaran === 'Cash' && (!transaction.uang_diterima || transaction.uang_diterima < transaction.total))}
              >
                Simpan Transaksi
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={onResetTransaction}
                className="flex-1"
              >
                Transaksi Baru
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
