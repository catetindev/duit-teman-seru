
import React from 'react';
import { PosProduct } from '@/hooks/usePos';
import { formatRupiah } from '@/utils/formatRupiah';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';

interface CartItemProps {
  product: PosProduct;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ product, onUpdateQuantity, onRemove }: CartItemProps) {
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      onUpdateQuantity(product.id, value);
    }
  };
  
  return (
    <div className="flex items-center justify-between p-3 border-b last:border-b-0">
      <div className="flex-1">
        <h3 className="font-medium">{product.nama}</h3>
        <p className="text-sm text-muted-foreground">
          {formatRupiah(product.harga)} x {product.qty} = {formatRupiah(product.harga * product.qty)}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={product.qty}
          onChange={handleQuantityChange}
          className="w-16 text-center"
          min="1"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(product.id)}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 size={18} />
        </Button>
      </div>
    </div>
  );
}
