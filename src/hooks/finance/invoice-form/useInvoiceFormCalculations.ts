
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { InvoiceFormData } from '@/components/finance/invoices/form/invoiceFormSchema';

interface UseInvoiceFormCalculationsProps {
  form: UseFormReturn<InvoiceFormData>;
  taxRate: number;
  discountAmount: number;
}

export function useInvoiceFormCalculations({
  form,
  taxRate,
  discountAmount
}: UseInvoiceFormCalculationsProps) {
  const calculateItemTotal = (index: number) => {
    const items = form.getValues('items');
    const item = items[index];
    const total = item.quantity * item.price;
    
    form.setValue(`items.${index}.total`, total);
    calculateTotals();
  };

  const calculateTotals = () => {
    const items = form.getValues('items');
    const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
    const taxAmount = (subtotal * taxRate) / 100;
    const total = subtotal + taxAmount - discountAmount;

    form.setValue('subtotal', subtotal);
    form.setValue('tax', taxAmount);
    form.setValue('discount', discountAmount);
    form.setValue('total', Math.max(0, total));
  };

  useEffect(() => {
    calculateTotals();
  }, [taxRate, discountAmount]);

  return {
    calculateItemTotal,
    calculateTotals
  };
}
