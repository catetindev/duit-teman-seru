import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Product } from '@/types/entrepreneur';
import { formatCurrency } from '@/utils/formatUtils';
import { InvoiceItemRow } from './InvoiceItemRow';
import { InvoiceItemCard } from './InvoiceItemCard'; // Import the new component
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile hook

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
  const isMobile = useIsMobile(); // Use the hook

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h3 className="font-medium">Item Faktur</h3>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <Select onValueChange={onAddProduct}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Tambah dari produk" />
            </SelectTrigger>
            <SelectContent>
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name} - {formatCurrency(Number(product.price), 'IDR')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onAddEmptyItem}
            className="w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-1" /> Tambah Item Manual
          </Button>
        </div>
      </div>

      {fields.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground border rounded-md">
          Belum ada item ditambahkan
        </div>
      ) : (
        // Render different view based on screen size
        isMobile ? (
          // Mobile Card View
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
        ) : (
          // Desktop Table View
          <div className="border rounded-md overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-12 gap-2 p-3 bg-muted font-medium text-sm">
                <div className="col-span-4">Item</div>
                <div className="col-span-2">Jumlah</div>
                <div className="col-span-2">Harga Satuan</div>
                <div className="col-span-3">Jumlah</div>
                <div className="col-span-1"></div>
              </div>

              {fields.map((field, index) => (
                <InvoiceItemRow
                  key={field.id}
                  index={index}
                  form={form}
                  onRemove={() => onRemove(index)}
                  calculateItemTotal={calculateItemTotal}
                />
              ))}
            </div>
          </div>
        )
      )}

      {form.formState.errors.items?.message && (
        <p className="text-sm text-destructive">
          {form.formState.errors.items.message as string}
        </p>
      )}
    </div>
  );
}