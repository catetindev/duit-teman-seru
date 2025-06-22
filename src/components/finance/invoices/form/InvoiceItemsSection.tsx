
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product } from '@/types/entrepreneur';
import { formatCurrency } from '@/utils/formatUtils';
import { InvoiceItemCard } from './InvoiceItemCard';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Select onValueChange={onAddProduct}>
            <SelectTrigger>
              <SelectValue placeholder="🔍 Cari produk..." />
            </SelectTrigger>
            <SelectContent>
              <div className="max-h-[300px] overflow-y-auto">
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    <div className="flex justify-between items-center w-full">
                      <span>{product.name}</span>
                      <span className="text-muted-foreground">
                        {formatCurrency(Number(product.price), 'IDR')}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onAddEmptyItem}
          className="sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" /> Item Baru
        </Button>
      </div>

      {/* Items List */}
      {fields.length === 0 ? (
        <div className="text-center p-8 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">Belum ada item. Pilih produk atau tambahkan item baru.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <InvoiceItemCard
              key={field.id}
              index={index}
              form={form}
              onRemove={() => onRemove(index)}
              calculateItemTotal={calculateItemTotal}
            />
          ))}
        </div>
      )}

      {form.formState.errors.items?.message && (
        <p className="text-sm text-destructive">
          {form.formState.errors.items.message as string}
        </p>
      )}
    </div>
  );
}
