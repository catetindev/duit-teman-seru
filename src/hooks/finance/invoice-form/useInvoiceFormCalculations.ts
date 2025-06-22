
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
    if (!items || !items[index]) return;
    
    const item = items[index];
    const quantity = Number(item.quantity) || 0;
    const unitPrice = Number(item.unit_price) || 0;
    const total = quantity * unitPrice;
    
    // Use setValue with shouldValidate to ensure reactivity
    form.setValue(`items.${index}.total`, total, { shouldValidate: true });
    
    // Trigger recalculation after a brief delay to ensure state updates
    setTimeout(() => calculateTotals(), 0);
  };

  const calculateTotals = () => {
    const items = form.getValues('items');
    if (!items || !Array.isArray(items)) return;
    
    const subtotal = items.reduce((sum, item) => {
      const total = Number(item?.total) || 0;
      return sum + total;
    }, 0);
    
    const taxAmount = (subtotal * taxRate) / 100;
    const total = Math.max(0, subtotal + taxAmount - discountAmount);

    // Update all totals with validation triggers
    form.setValue('subtotal', subtotal, { shouldValidate: true });
    form.setValue('tax', taxAmount, { shouldValidate: true });
    form.setValue('discount', discountAmount, { shouldValidate: true });
    form.setValue('total', total, { shouldValidate: true });
  };

  // Recalculate when tax rate or discount changes
  useEffect(() => {
    calculateTotals();
  }, [taxRate, discountAmount]);

  return {
    calculateItemTotal,
    calculateTotals
  };
}
