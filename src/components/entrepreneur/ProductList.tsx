import React from 'react';
import { Product } from '@/types/entrepreneur';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatUtils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'; // Added Card components

interface ProductListProps {
  products: Product[];
  loading: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductList({ products, loading, onEdit, onDelete }: ProductListProps) {
  if (loading) {
    return <div className="flex justify-center p-8">Loading products...</div>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/20">
        <p className="mb-4">No products found. Create your first product!</p>
      </div>
    );
  }

  const calculateProfit = (price: number, cost: number) => {
    return price - cost;
  };

  const calculateProfitMargin = (price: number, cost: number) => {
    if (price === 0) return 0;
    return ((price - cost) / price) * 100;
  };

  return (
    <div>
      {/* Desktop Table View */}
      <div className="hidden md:block border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produk/Layanan</TableHead>
              <TableHead className="hidden sm:table-cell">Tipe</TableHead>
              <TableHead className="hidden md:table-cell">Kategori</TableHead>
              <TableHead className="text-right">Harga</TableHead>
              <TableHead className="text-right hidden lg:table-cell">Modal</TableHead>
              <TableHead className="text-right hidden md:table-cell">Profit</TableHead>
              <TableHead className="text-right">Stok</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="hidden sm:flex">
                      <AvatarImage src={product.image_url} />
                      <AvatarFallback>{product.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      {product.is_best_seller && (
                        <Badge variant="secondary" className="mt-1">Lagi Hits!</Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant={product.type === 'product' ? 'default' : 'outline'}>
                    {product.type === 'product' ? 'Produk' : 'Layanan'}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">{product.category}</TableCell>
                <TableCell className="text-right">{formatCurrency(product.price, 'IDR')}</TableCell>
                <TableCell className="text-right hidden lg:table-cell">{formatCurrency(product.cost, 'IDR')}</TableCell>
                <TableCell className="text-right hidden md:table-cell">
                  <div>{formatCurrency(calculateProfit(product.price, product.cost), 'IDR')}</div>
                  <div className="text-xs text-muted-foreground">
                    {calculateProfitMargin(product.price, product.cost).toFixed(1)}%
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className={product.stock < 5 && product.type === 'product' ? 'text-red-500 font-medium' : ''}>
                    {product.type === 'product' ? product.stock : 'N/A'}
                  </div>
                  {product.stock < 5 && product.type === 'product' && (
                    <div className="text-xs text-red-500">Stok Tipis!</div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={product.status ? 'success' : 'destructive'}>
                    {product.status ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 md:gap-2">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(product)} title="Edit">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(product.id)} title="Delete">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 rounded-md">
                  <AvatarImage src={product.image_url} alt={product.name} />
                  <AvatarFallback>{product.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium text-base leading-tight">{product.name}</h3>
                    <div className="flex items-center gap-0.5"> {/* Reduced gap for tighter buttons */}
                      <Button variant="ghost" size="icon" onClick={() => onEdit(product)} className="h-7 w-7">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDelete(product.id)} className="h-7 w-7">
                        <Trash className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  {product.is_best_seller && (
                    <Badge variant="secondary" className="text-xs mb-2">Lagi Hits!</Badge>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-primary">{formatCurrency(product.price, 'IDR')}</p>
                    <Badge variant={product.status ? 'success' : 'destructive'} className="text-xs">
                      {product.status ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/50 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kategori:</span>
                  <span>{product.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipe:</span>
                  <Badge variant={product.type === 'product' ? 'default' : 'outline'} className="text-xs px-1.5 py-0.5">
                    {product.type === 'product' ? 'Produk' : 'Layanan'}
                  </Badge>
                </div>
                {product.type === 'product' && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stok:</span>
                    <span className={product.stock < 5 ? 'text-red-500 font-medium' : ''}>
                      {product.stock}
                      {product.stock < 5 && <span className="ml-1">(Stok Tipis!)</span>}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Modal:</span>
                  <span>{formatCurrency(product.cost, 'IDR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profit:</span>
                  <span>
                    {formatCurrency(calculateProfit(product.price, product.cost), 'IDR')}
                    <span className="text-muted-foreground ml-1">
                      ({calculateProfitMargin(product.price, product.cost).toFixed(1)}%)
                    </span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}