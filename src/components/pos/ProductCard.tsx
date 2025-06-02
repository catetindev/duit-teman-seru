import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatRupiah } from '@/utils/formatRupiah';
import { PosProduct } from '@/hooks/usePos';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: PosProduct;
  onAdd: (product: PosProduct) => void;
}

export function ProductCard({ product, onAdd }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:bg-slate-50 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm cursor-pointer">
      <CardContent className="p-3 flex flex-col gap-2" onClick={() => onAdd(product)}>
        <div className="flex justify-between items-start">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-base transform transition-transform duration-200 group-hover:scale-110">
            <span role="img" aria-label="produk">🧃</span>
          </div>
          <div className="h-7 w-7 rounded-full bg-slate-800 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
            <Plus size={14} />
          </div>
        </div>
        
        <div>
          <div className="text-xs font-medium text-slate-800 line-clamp-2 min-h-[2rem]">
            {product.nama}
          </div>
          <div className="mt-1 text-sm font-semibold text-slate-800">{formatRupiah(product.harga)}</div>
        </div>
      </CardContent>
    </Card>
  );
}
