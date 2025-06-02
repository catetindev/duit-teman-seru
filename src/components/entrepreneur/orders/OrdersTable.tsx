
import React from 'react';
import { Order } from '@/types/entrepreneur';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatRupiah } from '@/utils/formatRupiah';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';
import { OrderCard } from '../OrderCard';

interface OrdersTableProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
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

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export function OrdersTable({ orders, onEdit, onDelete, onStatusChange }: OrdersTableProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    if (orders.length === 0) {
      return (
        <div className="text-center p-8 border rounded-lg bg-muted/20">
          <p className="mb-4">No orders found</p>
        </div>
      );
    }

    return (
      <div className="space-y-3 p-2">
        {orders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onEdit={() => onEdit(order)}
            onDelete={() => onDelete(order.id)}
          />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/20">
        <p className="mb-4">No orders found. Start making sales with POS or create your first order!</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Order ID</TableHead>
              <TableHead className="w-[140px]">Date</TableHead>
              <TableHead className="w-[150px]">Customer</TableHead>
              <TableHead className="w-[120px]">Items</TableHead>
              <TableHead className="hidden md:table-cell w-[120px]">Payment</TableHead>
              <TableHead className="text-right w-[100px]">Total</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const isPosOrder = order.id.startsWith('pos-');
              const displayId = isPosOrder ? `POS-${order.id.substring(4, 8)}` : order.id.substring(0, 8);
              
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span className="text-sm">{displayId}...</span>
                      {isPosOrder && (
                        <Badge variant="secondary" className="text-xs w-fit">POS</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(new Date(order.order_date))}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {order.customer?.name || 'Walk-in Customer'}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {Array.isArray(order.products) ? (
                        <div>
                          <span className="font-medium">{order.products.length} item(s)</span>
                          {order.products.length > 0 && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {order.products.slice(0, 2).map((product: any, index: number) => (
                                <div key={index}>
                                  {product.name} x{product.quantity}
                                </div>
                              ))}
                              {order.products.length > 2 && (
                                <div>+{order.products.length - 2} more...</div>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No items</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="space-y-1">
                      <div className="text-sm">{order.payment_method}</div>
                      {order.payment_proof_url && (
                        <a
                          href={order.payment_proof_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline block"
                        >
                          View proof
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatRupiah(order.total)}
                  </TableCell>
                  <TableCell>
                    {isPosOrder ? (
                      <Badge variant={getStatusBadgeVariant(order.status)} className="text-xs">
                        {order.status}
                      </Badge>
                    ) : (
                      <Select
                        value={order.status}
                        onValueChange={(value: Order['status']) => onStatusChange?.(order.id, value)}
                      >
                        <SelectTrigger className="w-full sm:w-28 h-8 px-2 text-xs">
                          <Badge variant={getStatusBadgeVariant(order.status)} className="truncate text-xs">
                            {order.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Paid">Paid</SelectItem>
                          <SelectItem value="Canceled">Canceled</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {!isPosOrder && (
                        <Button variant="ghost" size="icon" onClick={() => onEdit(order)} className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      {isPosOrder && (
                        <Button variant="ghost" size="icon" className="h-8 w-8" title="View POS Transaction">
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDelete(order.id)} 
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
