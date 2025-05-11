
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface InvoiceItemRowProps {
  index: number;
  form: UseFormReturn<any>;
  onRemove: () => void;
  calculateItemTotal: (index: number) => void;
}

export function InvoiceItemRow({ index, form, onRemove, calculateItemTotal }: InvoiceItemRowProps) {
  return (
    <div className="grid grid-cols-12 gap-2 p-3 border-t items-center">
      <div className="col-span-4">
        <Input
          {...form.register(`items.${index}.name`)}
          placeholder="Item name"
          className="mb-1"
        />
        <Input
          {...form.register(`items.${index}.description`)}
          placeholder="Description (optional)"
          className="text-xs"
        />
        {form.formState.errors.items?.[index]?.name && (
          <p className="text-xs text-destructive mt-1">
            {form.formState.errors.items[index]?.name?.message as string}
          </p>
        )}
      </div>
      <div className="col-span-2">
        <Input
          type="number"
          min="1"
          {...form.register(`items.${index}.quantity`, {
            valueAsNumber: true,
            onChange: () => calculateItemTotal(index),
          })}
        />
        {form.formState.errors.items?.[index]?.quantity && (
          <p className="text-xs text-destructive mt-1">
            {form.formState.errors.items[index]?.quantity?.message as string}
          </p>
        )}
      </div>
      <div className="col-span-2">
        <Input
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
      <div className="col-span-3">
        <Input
          type="number"
          readOnly
          {...form.register(`items.${index}.total`, {
            valueAsNumber: true,
          })}
        />
      </div>
      <div className="col-span-1 text-right">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    </div>
  );
}
