
import React, { forwardRef } from 'react';
import { format } from 'date-fns';
import { Invoice } from '@/types/finance';
import { Customer } from '@/types/entrepreneur';
import { formatCurrency } from '@/utils/formatUtils';

interface InvoicePdfProps {
  invoice: Invoice;
  customer: Customer;
  companyLogo?: string;
  companyName?: string;
  companyAddress?: string;
  companyContact?: string;
}

export const InvoicePdf = forwardRef<HTMLDivElement, InvoicePdfProps>(
  ({ 
    invoice, 
    customer,
    companyLogo = '/lovable-uploads/b28e4def-5cbc-49d0-b60d-a1bf06d6d0b5.png',
    companyName = 'Your Business Name',
    companyAddress = 'Your Business Address',
    companyContact = 'your@email.com | +62 123 456 7890',
  }, ref) => {
    // Parse invoice items
    const items = Array.isArray(invoice.items) 
      ? invoice.items 
      : JSON.parse(typeof invoice.items === 'string' ? invoice.items : JSON.stringify(invoice.items));
    
    return (
      <div ref={ref} className="bg-white p-8 max-w-4xl mx-auto text-black">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <img src={companyLogo} alt="Company Logo" className="h-16 mb-2" />
            <h1 className="text-2xl font-bold text-gray-800">{companyName}</h1>
            <p className="text-gray-600">{companyAddress}</p>
            <p className="text-gray-600">{companyContact}</p>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-800 mb-1">INVOICE</h2>
            <p className="font-medium text-gray-600">#{invoice.invoice_number}</p>
            <p className="text-gray-600 mt-3">
              <span className="font-semibold">Issue Date:</span> {format(new Date(invoice.created_at), 'dd MMM yyyy')}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">Due Date:</span> {format(new Date(invoice.payment_due_date), 'dd MMM yyyy')}
            </p>
            <div className={`mt-2 px-3 py-1 rounded-full text-xs inline-block font-medium
              ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                invoice.status === 'Overdue' ? 'bg-red-100 text-red-800' : 
                'bg-yellow-100 text-yellow-800'}`}
            >
              {invoice.status}
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="mt-10 bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Bill To:</p>
          <h3 className="text-xl font-bold text-gray-800">{customer.name}</h3>
          <p className="text-gray-600">{customer.email || 'No email provided'}</p>
          <p className="text-gray-600">{customer.phone || 'No phone provided'}</p>
        </div>

        {/* Invoice Items */}
        <div className="mt-8">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 text-left text-gray-700">Item</th>
                <th className="py-3 text-left text-gray-700">Qty</th>
                <th className="py-3 text-right text-gray-700">Unit Price</th>
                <th className="py-3 text-right text-gray-700">Amount</th>
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
                  <td className="py-4 text-right text-gray-700">{formatCurrency(item.unit_price)}</td>
                  <td className="py-4 text-right text-gray-700">{formatCurrency(item.total)}</td>
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
              <span className="text-gray-800">{formatCurrency(Number(invoice.subtotal))}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span className="text-gray-600">Tax:</span>
              <span className="text-gray-800">{formatCurrency(Number(invoice.tax))}</span>
            </div>
            {Number(invoice.discount) > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Discount:</span>
                <span className="text-gray-800">-{formatCurrency(Number(invoice.discount))}</span>
              </div>
            )}
            <div className="flex justify-between py-3 font-bold text-lg">
              <span>Total:</span>
              <span>{formatCurrency(Number(invoice.total))}</span>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        <div className="mt-10 border-t border-gray-200 pt-6">
          <h4 className="font-bold text-gray-700 mb-2">Payment Information</h4>
          <p className="text-gray-600">Method: {invoice.payment_method}</p>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h4 className="font-bold text-gray-700 mb-2">Notes</h4>
            <p className="text-gray-600 whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>Thank you for your business!</p>
        </div>
      </div>
    );
  }
);

InvoicePdf.displayName = "InvoicePdf";
