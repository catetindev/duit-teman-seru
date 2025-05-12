
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
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02] cursor-pointer bg-white">
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="text-lg font-medium">{product.nama}</div>
        <div className="text-lg font-bold text-purple-600">{formatRupiah(product.harga)}</div>
        <Button 
          onClick={() => onAdd(product)} 
          className="w-full bg-gradient-to-r from-[#9AD0EC] to-[#B8E2F2] hover:from-[#7ABCD8] hover:to-[#A0D8E9] text-gray-800"
        >
          <Plus size={16} className="mr-2" />
          Tambah
        </Button>
      </CardContent>
    </Card>
  );
}
