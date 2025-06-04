
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { CartItem } from '@/types/pos';
import { formatRupiah } from '@/utils/formatRupiah';

interface CartPanelProps {
  cart: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  total: number;
}

export function CartPanel({ cart, onUpdateQuantity, onRemove, total }: CartPanelProps) {
  if (cart.length === 0) {
    return (
      <Card className="bg-white shadow-sm border-slate-200 h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-slate-800 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Keranjang
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <ShoppingCart className="h-8 w-8 text-slate-400" />
          </div>
          <p className="text-slate-500 text-sm">Keranjang kosong</p>
          <p className="text-slate-400 text-xs mt-1">Pilih produk untuk memulai transaksi</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm border-slate-200 h-full flex flex-col">
      <CardHeader className="pb-3 flex-shrink-0">
        <CardTitle className="text-lg text-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Keranjang
          </div>
          <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {cart.length} item
          </span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4 sm:px-6">
          <div className="space-y-3 py-2">
            {cart.map((item) => (
              <div key={item.id} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-slate-800 text-sm line-clamp-2 flex-1 mr-2">
                    {item.nama}
                  </h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(item.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, Math.max(0, item.qty - 1))}
                      className="h-7 w-7 p-0"
                      disabled={item.qty <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    
                    <span className="font-medium text-slate-800 min-w-[2rem] text-center">
                      {item.qty}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, item.qty + 1)}
                      className="h-7 w-7 p-0"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xs text-slate-500">
                      {formatRupiah(item.harga)} × {item.qty}
                    </div>
                    <div className="font-semibold text-slate-800">
                      {formatRupiah(item.harga * item.qty)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        
        {/* Total */}
        <div className="border-t border-slate-200 p-4 sm:p-6 bg-slate-50/50 flex-shrink-0">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-slate-800">Total</span>
            <span className="text-xl font-bold text-blue-600">{formatRupiah(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
