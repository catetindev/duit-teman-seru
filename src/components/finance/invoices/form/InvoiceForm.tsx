
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { InvoiceCustomerForm } from './InvoiceCustomerForm';
import { InvoiceItemsSection } from './InvoiceItemsSection';
import { InvoiceTotalsSection } from './InvoiceTotalsSection';
import { InvoicePaymentForm } from './InvoicePaymentForm';
import { LogoUploader } from './LogoUploader';
import { Customer, Product } from '@/types/entrepreneur';
import { Invoice } from '@/types/finance';
import { useInvoiceForm } from '@/hooks/finance/useInvoiceForm';

interface InvoiceFormProps {
  customers: Customer[];
  products: Product[];
  invoice?: Invoice | null;
  onSuccess: () => void;
  onClose: () => void;
}

export function InvoiceForm({
  customers,
  products,
  invoice,
  onSuccess,
  onClose
}: InvoiceFormProps) {
  const {
    form,
    fields,
    customers: updatedCustomers,
    loading,
    taxRate,
    discountAmount,
    setTaxRate,
    setDiscountAmount,
    refreshCustomers,
    addProduct,
    addEmptyItem,
    calculateItemTotal,
    remove,
    onSubmit
  } = useInvoiceForm({
    customers,
    products,
    invoice,
    onSuccess,
    onClose
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Logo Upload Section */}
        <div className="border-b pb-4">
          <h3 className="text-lg font-medium mb-4">Logo & Business Info</h3>
          <LogoUploader />
        </div>
        
        <InvoiceCustomerForm 
          form={form} 
          customers={updatedCustomers}
          onCustomerAdded={refreshCustomers}
        />
        
        <InvoiceItemsSection 
          form={form} 
          fields={fields}
          products={products}
          onAddProduct={addProduct}
          onAddEmptyItem={addEmptyItem}
          onRemove={remove}
          calculateItemTotal={calculateItemTotal}
        />
        
        <InvoiceTotalsSection 
          form={form}
          taxRate={taxRate}
          discountAmount={discountAmount}
          setTaxRate={setTaxRate}
          setDiscountAmount={setDiscountAmount}
        />
        
        <InvoicePaymentForm form={form} />

        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? 'Menyimpan...' : (invoice ? 'Update Invoice' : 'Buat Invoice')}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Batal
          </Button>
        </div>
      </form>
    </Form>
  );
}
