
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/utils/formatUtils';

interface InvoiceTotalsSectionProps {
  form: UseFormReturn<any>;
  taxRate: number;
  discountAmount: number;
  setTaxRate: (rate: number) => void;
  setDiscountAmount: (amount: number) => void;
}

export function InvoiceTotalsSection({ 
  form, 
  taxRate, 
  discountAmount, 
  setTaxRate, 
  setDiscountAmount 
}: InvoiceTotalsSectionProps) {
  return (
    <div className="bg-muted p-4 rounded-lg space-y-4">
      <h3 className="font-medium">Invoice Summary</h3>

      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>{formatCurrency(form.watch('subtotal'))}</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Tax ({taxRate}%):</span>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              max="100"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              className="w-16 text-right"
            />
            <span>%</span>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <span>Discount:</span>
          <div>
            <Input
              type="number"
              min="0"
              value={discountAmount}
              onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
              className="w-32 text-right"
            />
          </div>
        </div>

        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>{formatCurrency(form.watch('total'))}</span>
          </div>
          {form.formState.errors.total && (
            <p className="text-sm text-destructive">
              {form.formState.errors.total.message as string}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
