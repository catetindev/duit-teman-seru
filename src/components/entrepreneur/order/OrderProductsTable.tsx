
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { OrderProduct, Product } from '@/types/entrepreneur';
import { formatCurrency } from '@/utils/formatUtils';

interface OrderProductsTableProps {
  products: Product[];
  orderProducts: OrderProduct[];
  onProductChange: (index: number, field: keyof OrderProduct, value: string | number) => void;
  onRemoveProduct: (index: number) => void;
}

export function OrderProductsTable({
  products,
  orderProducts,
  onProductChange,
  onRemoveProduct,
}: OrderProductsTableProps) {
  if (orderProducts.length === 0) {
    return (
      <div className="text-center p-4 border rounded-md bg-muted/20">
        No products added yet. Click "Add Product" to begin.
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className="w-24">Quantity</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="w-16"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderProducts.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <Select
                  value={item.product_id}
                  onValueChange={(value) => onProductChange(index, 'product_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(product => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} ({product.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <Input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => onProductChange(index, 'quantity', parseInt(e.target.value) || 1)}
                />
              </TableCell>
              <TableCell className="text-right">
                {item.price ? formatCurrency(item.price) : '-'}
              </TableCell>
              <TableCell className="text-right font-medium">
                {item.price ? formatCurrency(item.price * (item.quantity || 0)) : '-'}
              </TableCell>
              <TableCell>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveProduct(index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
