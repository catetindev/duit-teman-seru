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
    <div className="group flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all duration-200 hover:border-slate-300">
      <div className="h-8 w-8 rounded-lg bg-purple-50 flex items-center justify-center text-base transition-transform duration-200 group-hover:scale-105">
        <span role="img" aria-label="produk">🧃</span>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-slate-800 truncate">{product.nama}</h3>
        <p className="text-xs text-slate-500">
          {formatRupiah(product.harga)} × {product.qty} = {" "}
          <span className="font-medium text-slate-700">{formatRupiah(product.harga * product.qty)}</span>
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <Input
          type="number"
          value={product.qty}
          onChange={handleQuantityChange}
          className="w-14 h-7 text-center text-xs px-1"
          min="1"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(product.id)}
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 hover:bg-red-50"
        >
          <Trash2 size={14} />
        </Button>
      </div>
    </div>
  );
}
