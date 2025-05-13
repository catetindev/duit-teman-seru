import React from 'react';
import { TopProduct } from '@/types/finance';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/utils/formatUtils'; // Updated import

interface TopProductsTableProps {
  products: TopProduct[];
}

export function TopProductsTable({ products }: TopProductsTableProps) {
  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 border rounded-md">
        <p className="text-muted-foreground">No product sales data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto"> {/* Added overflow-x-auto */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product/Service</TableHead>
            <TableHead className="text-right">Units Sold</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.name}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell className="text-right">{product.count}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(product.revenue, 'IDR')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}