
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Receipt, Printer, Trash2 } from 'lucide-react';
import { PosTransaction } from '@/types/pos';
import { formatRupiah } from '@/utils/formatRupiah';
import { formatDate } from '@/utils/formatUtils';
import { PosReceipt } from './PosReceipt';

interface RecentTransactionsProps {
  transactions: any[];
  onDelete: (id: string) => void;
  loading: boolean;
}

export function RecentTransactions({ transactions, onDelete, loading }: RecentTransactionsProps) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
  });

  const handlePrintTransaction = (transaction: any) => {
    // Create a temporary receipt component for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .receipt { max-width: 300px; margin: 0 auto; }
              .header { text-align: center; margin-bottom: 20px; }
              .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
              .total { border-top: 1px solid #000; padding-top: 10px; margin-top: 10px; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <h2>STRUK PEMBAYARAN</h2>
                <p>${formatDate(new Date())}</p>
              </div>
              ${transaction.nama_pembeli ? `<p><strong>Pembeli:</strong> ${transaction.nama_pembeli}</p>` : ''}
              <div class="items">
                ${transaction.produk?.map((item: any) => `
                  <div class="item">
                    <span>${item.nama} x${item.qty}</span>
                    <span>${formatRupiah(item.harga * item.qty)}</span>
                  </div>
                `).join('') || ''}
              </div>
              <div class="total">
                <div class="item">
                  <span>TOTAL</span>
                  <span>${formatRupiah(transaction.total)}</span>
                </div>
                <p>Metode Pembayaran: ${transaction.metode_pembayaran}</p>
              </div>
              <div style="text-align: center; margin-top: 30px;">
                <p>Terima kasih atas kunjungan Anda!</p>
                <p>Powered by Catatuy POS System</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDelete = (txId: string) => {
    if (window.confirm('Yakin ingin menghapus transaksi ini?')) {
      onDelete(txId);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Transaksi Terakhir
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
          <Receipt className="h-5 w-5" />
          Transaksi Terakhir
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Receipt className="h-12 w-12 mx-auto mb-2 text-slate-300" />
            <p>Belum ada transaksi hari ini</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-800 truncate">
                    {tx.nama_pembeli || "Customer"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {formatDate(new Date(tx.waktu_transaksi))} • {tx.metode_pembayaran}
                  </p>
                  <p className="text-sm font-medium text-green-600">
                    {formatRupiah(tx.total)}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePrintTransaction(tx)}
                    className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(tx.id)}
                    className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
