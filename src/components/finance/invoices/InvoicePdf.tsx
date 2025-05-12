
import React, { forwardRef } from 'react';
import { format } from 'date-fns';
import { Invoice } from '@/types/finance';
import { Customer } from '@/types/entrepreneur';
import { formatRupiah } from '@/utils/formatRupiah';
import { useInvoiceCustomization } from '@/contexts/InvoiceCustomizationContext';

interface InvoicePdfProps {
  invoice: Invoice;
  customer: Customer;
}

export const InvoicePdf = forwardRef<HTMLDivElement, InvoicePdfProps>(
  ({ invoice, customer }, ref) => {
    // Use the invoice customization context
    const { logoUrl, showLogo, businessName } = useInvoiceCustomization();
    
    // Parse invoice items
    const items = Array.isArray(invoice.items) 
      ? invoice.items 
      : JSON.parse(typeof invoice.items === 'string' ? invoice.items : JSON.stringify(invoice.items));
    
    // Default logo if none provided and showing is enabled
    const defaultLogo = '/lovable-uploads/b28e4def-5cbc-49d0-b60d-a1bf06d6d0b5.png';
    const displayLogo = showLogo ? (logoUrl || defaultLogo) : null;

    return (
      <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto text-black">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            {displayLogo && (
              <img src={displayLogo} alt="Logo Perusahaan" className="h-16 mb-2 object-contain" />
            )}
            <h1 className="text-2xl font-bold text-gray-800">{businessName}</h1>
            <p className="text-gray-600">Alamat Perusahaan Anda</p>
            <p className="text-gray-600">email@perusahaan.com | +62 123 456 7890</p>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-800 mb-1">FAKTUR</h2>
            <p className="font-medium text-gray-600">#{invoice.invoice_number}</p>
            <p className="text-gray-600 mt-3">
              <span className="font-semibold">Tanggal:</span> {format(new Date(invoice.created_at), 'dd MMM yyyy')}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Jatuh Tempo:</span> {format(new Date(invoice.payment_due_date), 'dd MMM yyyy')}
            </p>
            <div className={`mt-2 px-3 py-1 rounded-full text-xs inline-block font-medium
              ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                invoice.status === 'Overdue' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'}`}
            >
              {invoice.status === 'Paid' ? 'Lunas' : 
               invoice.status === 'Overdue' ? 'Terlambat' : 'Belum Bayar'}
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mt-10 bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Kepada:</p>
          <h3 className="text-xl font-bold text-gray-800">{customer.name}</h3>
          <p className="text-gray-600">{customer.email || 'Email tidak tersedia'}</p>
          <p className="text-gray-600">{customer.phone || 'No. Telepon tidak tersedia'}</p>
        </div>

        {/* Invoice Items */}
        <div className="mt-8">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 text-left text-gray-700">Item</th>
                <th className="py-3 text-left text-gray-700">Qty</th>
                <th className="py-3 text-right text-gray-700">Harga Satuan</th>
                <th className="py-3 text-right text-gray-700">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item: any, index: number) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-4">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
                  </td>
                  <td className="py-4 text-gray-700">{item.quantity}</td>
                  <td className="py-4 text-right text-gray-700">{formatRupiah(item.unit_price)}</td>
                  <td className="py-4 text-right text-gray-700">{formatRupiah(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-6 flex justify-end">
          <div className="w-80">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-gray-800">{formatRupiah(Number(invoice.subtotal))}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Pajak:</span>
              <span className="text-gray-800">{formatRupiah(Number(invoice.tax))}</span>
            </div>
            {Number(invoice.discount) > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Diskon:</span>
                <span className="text-gray-800">-{formatRupiah(Number(invoice.discount))}</span>
              </div>
            )}
            <div className="flex justify-between py-3 font-bold text-lg">
              <span>Total:</span>
              <span>{formatRupiah(Number(invoice.total))}</span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="mt-10 border-t border-gray-200 pt-6">
          <h4 className="font-bold text-gray-700 mb-2">Informasi Pembayaran</h4>
          <p className="text-gray-600">Metode: {invoice.payment_method === 'Transfer' ? 'Transfer Bank' : invoice.payment_method}</p>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h4 className="font-bold text-gray-700 mb-2">Catatan</h4>
            <p className="text-gray-600 whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>Terima kasih atas kerjasamanya!</p>
        </div>
      </div>
    );
  }
);

InvoicePdf.displayName = "InvoicePdf";
