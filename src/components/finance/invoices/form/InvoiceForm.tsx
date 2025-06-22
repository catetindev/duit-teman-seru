
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

  // Direct form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== FORM SUBMIT TRIGGERED ===');
    
    // Get form values
    const formValues = form.getValues();
    console.log('Form values:', formValues);
    
    // Check for validation errors
    const errors = form.formState.errors;
    console.log('Form errors:', errors);
    
    if (Object.keys(errors).length > 0) {
      console.log('Form has validation errors, not submitting');
      return;
    }
    
    // Call our submit handler directly
    onSubmit(formValues);
  };

  return (
    <div className="space-y-6">
      {/* Logo Upload Section */}
      <div className="border-b pb-4">
        <h3 className="text-lg font-medium mb-4">Logo & Business Info</h3>
        <LogoUploader />
      </div>
      
      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              {loading ? 'Saving...' : (invoice ? 'Update Invoice' : 'Create Invoice')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
