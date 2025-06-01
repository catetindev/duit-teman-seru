import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    <div className="space-y-4">
      {/* Subtotal */}
      <div className="flex items-center justify-between text-sm">
        <Label>Subtotal</Label>
        <span className="font-medium">{formatCurrency(form.watch('subtotal'), 'IDR')}</span>
      </div>

      {/* Tax Rate */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label htmlFor="tax-rate">Pajak</Label>
          <div className="flex items-center gap-1">
            <Input
              id="tax-rate"
              type="number"
              min="0"
              max="100"
              value={taxRate}
              onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
              className="w-16 text-right"
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        </div>
        <span className="font-medium text-sm">{formatCurrency((form.watch('subtotal') * taxRate) / 100, 'IDR')}</span>
      </div>

      {/* Discount */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label htmlFor="discount">Diskon</Label>
          <Input
            id="discount"
            type="number"
            min="0"
            value={discountAmount}
            onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
            className="w-32 text-right"
          />
        </div>
        <span className="font-medium text-sm text-destructive">-{formatCurrency(discountAmount, 'IDR')}</span>
      </div>

      <div className="h-px bg-muted my-4" />

      {/* Total */}
      <div className="flex items-center justify-between">
        <Label className="text-lg">Total</Label>
        <span className="text-lg font-bold">{formatCurrency(form.watch('total'), 'IDR')}</span>
      </div>

      {form.formState.errors.total && (
        <p className="text-sm text-destructive mt-1">
          {form.formState.errors.total.message as string}
        </p>
      )}
    </div>
  );
}
