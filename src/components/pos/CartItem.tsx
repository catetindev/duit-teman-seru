
import React from 'react';
import { PosProduct } from '@/types/pos';
import { formatRupiah } from '@/utils/formatRupiah';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Minus, Plus } from 'lucide-react';

interface CartItemProps {
  product: PosProduct;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
}

export function CartItem({ product, onUpdateQuantity, onRemove }: CartItemProps) {
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      onUpdateQuantity(product.id, value);
    }
  };

  const increaseQuantity = () => {
    onUpdateQuantity(product.id, product.qty + 1);
  };

  const decreaseQuantity = () => {
    if (product.qty > 1) {
      onUpdateQuantity(product.id, product.qty - 1);
    }
  };
  
  return (
    <div className="group flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all duration-200 hover:border-slate-300 bg-white">
      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-purple-50 flex items-center justify-center text-base sm:text-lg transition-transform duration-200 group-hover:scale-105">
        <span role="img" aria-label="produk">🧃</span>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-sm sm:text-base font-medium text-slate-800 truncate mb-1">
          {product.nama}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500">
          {formatRupiah(product.harga)} × {product.qty} = {" "}
          <span className="font-medium text-slate-700">
            {formatRupiah(product.harga * product.qty)}
          </span>
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Quantity Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={decreaseQuantity}
            disabled={product.qty <= 1}
            className="h-6 w-6 sm:h-8 sm:w-8 rounded-md"
          >
            <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          
          <Input
            type="number"
            value={product.qty}
            onChange={handleQuantityChange}
            className="w-12 sm:w-16 h-6 sm:h-8 text-center text-xs sm:text-sm px-1 rounded-md"
            min="1"
          />
          
          <Button
            variant="outline"
            size="icon"
            onClick={increaseQuantity}
            className="h-6 w-6 sm:h-8 sm:w-8 rounded-md"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(product.id)}
          className="h-6 w-6 sm:h-8 sm:w-8 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md"
        >
          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>
    </div>
  );
}
