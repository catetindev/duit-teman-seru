import React from 'react';
import { Order } from '@/types/entrepreneur';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/utils/formatUtils'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface OrderListProps {
  orders: Order[];
  loading: boolean;
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Order['status']) => void;
}

export default function OrderList({ orders, loading, onEdit, onDelete, onStatusChange }: OrderListProps) {
  if (loading) {
    return <div className="flex justify-center p-8">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/20">
        <p className="mb-4">No orders found. Create your first order!</p>
      </div>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'success';
      case 'Pending':
        return 'default';
      case 'Canceled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="overflow-x-auto border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead className="hidden sm:table-cell">Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="hidden md:table-cell">Payment</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">
                <span className="block sm:hidden">{order.id.substring(0, 4)}...</span>
                <span className="hidden sm:block">{order.id.substring(0, 8)}...</span>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                {formatDate(new Date(order.order_date))}
              </TableCell>
              <TableCell>
                {order.customer?.name || 'Unknown Customer'}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="space-y-1">
                  <div>{order.payment_method}</div>
                  {order.payment_proof_url && (
                    <a 
                      href={order.payment_proof_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline"
                    >
                      View proof
                    </a>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(order.total, 'IDR')}
              </TableCell>
              <TableCell>
                <Select
                  value={order.status}
                  onValueChange={(value: Order['status']) => onStatusChange(order.id, value)}
                >
                  <SelectTrigger className="w-full sm:w-32 h-8 px-2 text-xs sm:text-sm">
                    <Badge variant={getStatusBadgeVariant(order.status)} className="truncate">
                      {order.status}
                    </Badge>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 md:gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(order)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(order.id)}>
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