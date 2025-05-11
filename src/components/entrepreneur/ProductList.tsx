
import React from 'react';
import { Product } from '@/types/entrepreneur';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatUtils';

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

  // Calculate profit margin
  const calculateProfit = (price: number, cost: number) => {
    return price - cost;
  };

  const calculateProfitMargin = (price: number, cost: number) => {
    if (price === 0) return 0;
    return ((price - cost) / price) * 100;
  };

  return (
    <div className="overflow-x-auto border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product/Service</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Cost</TableHead>
            <TableHead className="text-right">Profit</TableHead>
            <TableHead className="text-right">Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={product.image_url} />
                    <AvatarFallback>{product.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    {product.is_best_seller && (
                      <Badge variant="secondary" className="mt-1">Best Seller</Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={product.type === 'product' ? 'default' : 'outline'}>
                  {product.type}
                </Badge>
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell className="text-right">{formatCurrency(product.price)}</TableCell>
              <TableCell className="text-right">{formatCurrency(product.cost)}</TableCell>
              <TableCell className="text-right">
                <div>{formatCurrency(calculateProfit(product.price, product.cost))}</div>
                <div className="text-xs text-muted-foreground">
                  {calculateProfitMargin(product.price, product.cost).toFixed(1)}%
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className={product.stock < 5 && product.type === 'product' ? 'text-red-500 font-medium' : ''}>
                  {product.type === 'product' ? product.stock : '—'}
                </div>
                {product.stock < 5 && product.type === 'product' && (
                  <div className="text-xs text-red-500">Low stock!</div>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={product.status ? 'success' : 'destructive'}>
                  {product.status ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
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
  );
}
