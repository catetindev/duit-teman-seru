
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { formatRupiah, parseRupiah } from '@/utils/formatRupiah';
import { PosTransaction } from '@/types/pos';
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

  const paymentMethods = [
    {
      value: 'Cash' as const,
      label: 'Tunai',
      icon: Banknote,
      color: 'emerald',
      description: 'Pembayaran dengan uang tunai'
    },
    {
      value: 'Bank Transfer' as const,
      label: 'Transfer Bank',
      icon: CreditCard,
      color: 'blue',
      description: 'Transfer melalui rekening bank'
    },
    {
      value: 'QRIS' as const,
      label: 'QRIS',
      icon: QrCode,
      color: 'purple',
      description: 'Scan QRIS untuk pembayaran digital'
    }
  ];

  return (
    <Card className="bg-white shadow-sm border-slate-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Pembayaran
        </CardTitle>
        <Separator />
      </CardHeader>
      
      <CardContent className="space-y-4">
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {/* Customer Name */}
          <div className="space-y-2">
            <Label htmlFor="customer-name" className="text-sm font-medium text-slate-700">
              Nama Pembeli (Opsional)
            </Label>
            <Input
              id="customer-name"
              placeholder="Masukkan nama pembeli..."
              value={transaction.nama_pembeli || ''}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              className="h-10"
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-slate-700">Metode Pembayaran</Label>
            <RadioGroup 
              value={transaction.metode_pembayaran} 
              onValueChange={onPaymentMethodChange}
              className="space-y-2"
            >
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const isSelected = transaction.metode_pembayaran === method.value;
                
                return (
                  <div key={method.value} className={`flex items-center space-x-3 border rounded-lg p-3 cursor-pointer transition-all duration-200 hover:bg-slate-50 ${
                    isSelected 
                      ? `border-${method.color}-500 bg-${method.color}-50/50` 
                      : 'border-slate-200'
                  }`}>
                    <RadioGroupItem value={method.value} id={method.value} />
                    <Label htmlFor={method.value} className="flex items-center cursor-pointer flex-1">
                      <div className={`h-8 w-8 rounded-lg bg-${method.color}-50 flex items-center justify-center mr-3`}>
                        <Icon className={`h-4 w-4 text-${method.color}-500`} />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-700">{method.label}</span>
                        <p className="text-xs text-slate-500">{method.description}</p>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Cash Input */}
          {transaction.metode_pembayaran === 'Cash' && (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="cash-received" className="text-sm font-medium text-slate-700">
                  Uang Diterima
                </Label>
                <Input
                  id="cash-received"
                  placeholder="Rp 0"
                  value={cashReceived}
                  onChange={handleCashReceivedChange}
                  className="h-10"
                />
              </div>
              
              {transaction.kembalian !== undefined && (
                <div className="bg-slate-50 rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600">Kembalian</span>
                    <span className={`font-bold ${
                      transaction.kembalian >= 0 
                        ? 'text-emerald-600' 
                        : 'text-red-500'
                    }`}>
                      {transaction.kembalian >= 0 
                        ? formatRupiah(transaction.kembalian)
                        : `Kurang ${formatRupiah(Math.abs(transaction.kembalian))}`
                      }
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <Separator />

          {/* Total & Actions */}
          <div className="space-y-4">
            <div className="bg-slate-50 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-600">Total Pembayaran</div>
                  <div className="text-xl font-bold text-slate-800">
                    {formatRupiah(transaction.total)}
                  </div>
                </div>
                {transaction.produk.length > 0 && (
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-emerald-600" />
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white"
                disabled={loading || !isPaymentValid()}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onResetTransaction}
                className="h-11 w-11"
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
