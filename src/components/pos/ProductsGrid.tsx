
import React from 'react';
import { ProductCard } from './ProductCard';
import { PosProduct } from '@/types/pos';
import { Package } from 'lucide-react';

interface ProductsGridProps {
  products: PosProduct[];
  onAddToCart: (product: PosProduct) => void;
  loading?: boolean;
}

export function ProductsGrid({ products, onAddToCart, loading }: ProductsGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-32 bg-slate-200 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Tidak ada produk tersedia</p>
          <p className="text-sm text-slate-400 mt-1">Tambahkan produk di menu Produk & Layanan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAdd={onAddToCart}
        />
      ))}
    </div>
  );
}
