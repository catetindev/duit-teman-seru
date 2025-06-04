
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/utils/formatRupiah';
import { PosProduct } from '@/types/pos';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: PosProduct;
  onAdd: (product: PosProduct) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:bg-slate-50 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-md cursor-pointer rounded-xl">
      <CardContent className="p-3 sm:p-4 flex flex-col gap-2 sm:gap-3" onClick={() => onAdd(product)}>
        <div className="flex justify-between items-start">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-50 flex items-center justify-center text-base sm:text-lg transform transition-transform duration-200 group-hover:scale-110">
            <span role="img" aria-label="produk">🧃</span>
          </div>
          <div className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-slate-800 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
            <Plus size={12} className="sm:hidden" />
            <Plus size={14} className="hidden sm:block" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="text-xs sm:text-sm font-medium text-slate-800 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] mb-1 sm:mb-2">
            {product.nama}
          </div>
          <div className="text-sm sm:text-base font-semibold text-slate-800">
            {formatRupiah(product.harga)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
