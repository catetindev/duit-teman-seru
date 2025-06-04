
import React from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { InvoiceCustomerForm } from './InvoiceCustomerForm';
import { InvoiceItemsSection } from './InvoiceItemsSection';
import { InvoiceTotalsSection } from './InvoiceTotalsSection';
import { InvoicePaymentForm } from './InvoicePaymentForm';
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

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex-1"
          >
            {loading ? 'Saving...' : (invoice ? 'Update Invoice' : 'Create Invoice')}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
