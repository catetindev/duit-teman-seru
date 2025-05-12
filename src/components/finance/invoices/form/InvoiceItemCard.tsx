import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/utils/formatUtils';

interface InvoiceItemCardProps {
  index: number;
  form: UseFormReturn<any>;
  onRemove: () => void;
  calculateItemTotal: (index: number) => void;
}

export function InvoiceItemCard({ index, form, onRemove, calculateItemTotal }: InvoiceItemCardProps) {
  // Watch form values for this specific item
  const item = form.watch(`items.${index}`);

  return (
    <Card className="p-4 space-y-3">
      <div className="flex justify-between items-start">
        {/* Item Name & Description */}
        <div className="flex-1 pr-4">
          <Label htmlFor={`items.${index}.name`} className="sr-only">Item Name</Label>
          <Input
            id={`items.${index}.name`}
            {...form.register(`items.${index}.name`)}
            placeholder="Nama Item"
            className="mb-1 text-base font-medium"
          />
          {form.formState.errors.items?.[index]?.name && (
            <p className="text-xs text-destructive mt-1">
              {form.formState.errors.items[index]?.name?.message as string}
            </p>
          )}
          
          <Label htmlFor={`items.${index}.description`} className="sr-only">Description</Label>
          <Input
            id={`items.${index}.description`}
            {...form.register(`items.${index}.description`)}
            placeholder="Deskripsi (opsional)"
            className="text-sm"
          />
        </div>
        
        {/* Remove Button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="flex-shrink-0 text-destructive hover:text-destructive/80"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Quantity and Unit Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor={`items.${index}.quantity`} className="text-sm">Jumlah</Label>
          <Input
            id={`items.${index}.quantity`}
            type="number"
            min="1"
            {...form.register(`items.${index}.quantity`, {
              valueAsNumber: true,
              onChange: () => calculateItemTotal(index),
            })}
            className="text-center"
          />
          {form.formState.errors.items?.[index]?.quantity && (
            <p className="text-xs text-destructive mt-1">
              {form.formState.errors.items[index]?.quantity?.message as string}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor={`items.${index}.unit_price`} className="text-sm">Harga Satuan</Label>
          <Input
            id={`items.${index}.unit_price`}
            type="number"
            min="0"
            step="0.01"
            {...form.register(`items.${index}.unit_price`, {
              valueAsNumber: true,
              onChange: () => calculateItemTotal(index),
            })}
          />
          {form.formState.errors.items?.[index]?.unit_price && (
            <p className="text-xs text-destructive mt-1">
              {form.formState.errors.items[index]?.unit_price?.message as string}
            </p>
          )}
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center pt-3 border-t">
        <span className="font-medium">Total:</span>
        <span className="font-bold text-lg">
          {formatCurrency(item.total || 0, 'IDR')}
        </span>
      </div>
    </Card>
  );
}