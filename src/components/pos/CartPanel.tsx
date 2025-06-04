
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { CartItem } from './CartItem';
import { PosProduct } from '@/types/pos';
import { formatRupiah } from '@/utils/formatRupiah';

interface CartPanelProps {
  cart: PosProduct[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  total: number;
}

export function CartPanel({ cart, onUpdateQuantity, onRemove, total }: CartPanelProps) {
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  return (
    <Card className="h-full bg-white shadow-sm border-slate-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Keranjang
          </CardTitle>
          {itemCount > 0 && (
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              {itemCount} item{itemCount > 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        <Separator />
      </CardHeader>

      <CardContent className="p-0 flex flex-col h-[calc(100%-100px)]">
        {cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <ShoppingCart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Keranjang masih kosong</p>
              <p className="text-sm text-slate-400 mt-1">Pilih produk untuk memulai transaksi</p>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-3 pb-4">
                {cart.map((product) => (
                  <CartItem
                    key={product.id}
                    product={product}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemove={onRemove}
                  />
                ))}
              </div>
            </ScrollArea>

            <div className="px-6 py-4 border-t bg-slate-50">
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-slate-700">Total</span>
                <span className="text-xl font-bold text-slate-800">
                  {formatRupiah(total)}
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
