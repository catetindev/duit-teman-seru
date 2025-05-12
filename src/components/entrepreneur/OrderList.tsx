import React from 'react';
import { Order } from '@/types/entrepreneur';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/utils/formatUtils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card'; // Import Card components
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile hook

interface OrderListProps {
  orders: Order[];
  loading: boolean;
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Order['status']) => void;
}

export default function OrderList({ orders, loading, onEdit, onDelete, onStatusChange }: OrderListProps) {
  const isMobile = useIsMobile(); // Use the hook

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

  // Render mobile card view
  if (isMobile) {
    return (
      <div className="md:hidden space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-base leading-tight">Order #{order.id.substring(0, 8)}...</h3>
                  <p className="text-sm text-muted-foreground">{order.customer?.name || 'Unknown Customer'}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(order)} className="h-7 w-7">
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => onDelete(order.id)} className="h-7 w-7 text-destructive">
                    <Trash className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm mb-2">
                 <span className="text-muted-foreground">{formatDate(new Date(order.order_date))}</span>
                 <span className="font-semibold text-lg">{formatCurrency(order.total, 'IDR')}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="text-muted-foreground">{order.payment_method}</div>
                <Select
                  value={order.status}
                  onValueChange={(value: Order['status']) => onStatusChange(order.id, value)}
                >
                  <SelectTrigger className="w-full max-w-[120px] h-7 px-2 text-xs">
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
              </div>
              
              {order.payment_proof_url && (
                <div className="mt-2 text-right">
                  <a 
                    href={order.payment_proof_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-500 hover:underline"
                  >
                    View payment proof
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Render desktop table view
  return (
    <div className="hidden md:block border rounded-lg overflow-x-auto">
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