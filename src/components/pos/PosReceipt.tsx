
import React, { forwardRef } from 'react';
import { PosTransaction } from '@/hooks/usePos';
import { formatRupiah } from '@/utils/formatRupiah';
import { formatDate } from '@/utils/formatUtils';

interface PosReceiptProps {
  transaction: PosTransaction;
}

export const PosReceipt = forwardRef<HTMLDivElement, PosReceiptProps>(
  ({ transaction }, ref) => {
    const currentDate = new Date();
    
    return (
      <div ref={ref} className="bg-white p-8 max-w-md mx-auto font-sans">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">STRUK PEMBAYARAN</h2>
          <p className="text-sm text-gray-600">{formatDate(currentDate)}</p>
        </div>

        {transaction.nama_pembeli && (
          <div className="mb-4">
            <p><strong>Pembeli:</strong> {transaction.nama_pembeli}</p>
          </div>
        )}

        <div className="mb-6">
          <div className="border-b border-gray-300 pb-2 mb-2">
            <div className="grid grid-cols-12 font-bold">
              <div className="col-span-6">Item</div>
              <div className="col-span-2 text-right">Qty</div>
              <div className="col-span-4 text-right">Subtotal</div>
            </div>
          </div>

          {transaction.produk.map((item) => (
            <div key={item.id} className="grid grid-cols-12 py-1">
              <div className="col-span-6">
                <p>{item.nama}</p>
                <p className="text-xs text-gray-500">{formatRupiah(item.harga)}/item</p>
              </div>
              <div className="col-span-2 text-right">{item.qty}</div>
              <div className="col-span-4 text-right">{formatRupiah(item.harga * item.qty)}</div>
            </div>
          ))}

          <div className="border-t border-gray-300 mt-4 pt-4">
            <div className="flex justify-between font-bold">
              <span>TOTAL</span>
              <span>{formatRupiah(transaction.total)}</span>
            </div>
            
            {transaction.metode_pembayaran === 'Cash' && transaction.uang_diterima && (
              <>
                <div className="flex justify-between mt-2">
                  <span>Tunai</span>
                  <span>{formatRupiah(transaction.uang_diterima)}</span>
                </div>
                
                <div className="flex justify-between mt-1 font-bold">
                  <span>Kembali</span>
                  <span>{formatRupiah(transaction.kembalian || 0)}</span>
                </div>
              </>
            )}

            <div className="mt-2 text-gray-600">
              <span>Metode Pembayaran: {transaction.metode_pembayaran}</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>Terima kasih atas kunjungan Anda!</p>
          <p>Powered by Catatuy POS System</p>
        </div>
      </div>
    );
  }
);

PosReceipt.displayName = "PosReceipt";
