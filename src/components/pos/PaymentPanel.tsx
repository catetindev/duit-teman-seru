
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { CreditCard, DollarSign, RotateCcw } from 'lucide-react';
import { PosTransaction } from '@/types/pos';
import { formatRupiah } from '@/utils/formatRupiah';

interface PaymentPanelProps {
  transaction: PosTransaction;
  onPaymentMethodChange: (method: string) => void;
  onCashReceivedChange: (amount: number) => void;
  onCustomerNameChange: (name: string) => void;
  onSaveTransaction: () => Promise<boolean>;
  onResetTransaction: () => void;
  loading?: boolean;
}

export function PaymentPanel({
  transaction,
  onPaymentMethodChange,
  onCashReceivedChange,
  onCustomerNameChange,
  onSaveTransaction,
  onResetTransaction,
  loading = false
}: PaymentPanelProps) {
  const handleSave = async () => {
    await onSaveTransaction();
  };

  const isDisabled = transaction.produk.length === 0 || loading;
  const showCashFields = transaction.metode_pembayaran === 'Cash';
  
  return (
    <Card className="bg-white shadow-sm border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Pembayaran
        </CardTitle>
        <Separator />
      </CardHeader>
      
      <CardContent className="space-y-4">
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
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700">
            Metode Pembayaran
          </Label>
          <Select
            value={transaction.metode_pembayaran}
            onValueChange={onPaymentMethodChange}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Pilih metode pembayaran" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Cash">Tunai</SelectItem>
              <SelectItem value="Transfer">Transfer Bank</SelectItem>
              <SelectItem value="E-Wallet">E-Wallet</SelectItem>
              <SelectItem value="Debit Card">Kartu Debit</SelectItem>
              <SelectItem value="Credit Card">Kartu Kredit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Cash Payment Fields */}
        {showCashFields && (
          <>
            <div className="space-y-2">
              <Label htmlFor="cash-received" className="text-sm font-medium text-slate-700">
                Uang Diterima
              </Label>
              <Input
                id="cash-received"
                type="number"
                placeholder="0"
                value={transaction.uang_diterima || ''}
                onChange={(e) => onCashReceivedChange(Number(e.target.value))}
                className="h-10"
              />
            </div>

            {transaction.uang_diterima && transaction.uang_diterima >= transaction.total && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-800 font-medium">Kembalian:</span>
                  <span className="text-green-900 font-bold">
                    {formatRupiah(transaction.kembalian || 0)}
                  </span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Total Summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-slate-600">Subtotal:</span>
            <span className="font-medium text-slate-800">
              {formatRupiah(transaction.total)}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-slate-800">Total:</span>
            <span className="text-xl font-bold text-blue-600">
              {formatRupiah(transaction.total)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <Button
            onClick={handleSave}
            disabled={isDisabled}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            {loading ? 'Memproses...' : 'Selesaikan Transaksi'}
          </Button>
          
          <Button
            onClick={onResetTransaction}
            variant="outline"
            className="w-full h-11"
            disabled={loading}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Transaksi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
