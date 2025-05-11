
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product } from '@/types/entrepreneur';
import { formatCurrency } from '@/utils/formatUtils';
import { InvoiceItemRow } from './InvoiceItemRow';

interface InvoiceItemsSectionProps {
  form: UseFormReturn<any>;
  fields: any[];
  products: Product[];
  onAddProduct: (productId: string) => void;
  onAddEmptyItem: () => void;
  onRemove: (index: number) => void;
  calculateItemTotal: (index: number) => void;
}

export function InvoiceItemsSection({
  form,
  fields,
  products,
  onAddProduct,
  onAddEmptyItem,
  onRemove,
  calculateItemTotal
}: InvoiceItemsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Invoice Items</h3>
        <div className="flex items-center gap-2">
          <Select onValueChange={onAddProduct}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Add from products" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} - {formatCurrency(Number(product.price))}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={onAddEmptyItem}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </Button>
        </div>
      </div>

      <div className="border rounded-md">
        <div className="grid grid-cols-12 gap-2 p-3 bg-muted font-medium text-sm">
          <div className="col-span-4">Item</div>
          <div className="col-span-2">Qty</div>
          <div className="col-span-2">Unit Price</div>
          <div className="col-span-3">Total</div>
          <div className="col-span-1"></div>
        </div>

        {fields.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No items added yet
          </div>
        ) : (
          fields.map((field, index) => (
            <InvoiceItemRow 
              key={field.id} 
              index={index} 
              form={form} 
              onRemove={() => onRemove(index)} 
              calculateItemTotal={calculateItemTotal}
            />
          ))
        )}
      </div>
      {form.formState.errors.items?.message && (
        <p className="text-sm text-destructive">
          {form.formState.errors.items.message as string}
        </p>
      )}
    </div>
  );
}
