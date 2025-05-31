
import React from 'react';
import { Order } from '@/types/entrepreneur';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatRupiah } from '@/utils/formatRupiah';
import { OrderActions } from './OrderActions';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface OrdersTableProps {
  orders: Order[];
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Order['status']) => void;
}

export function OrdersTable({
  orders,
  onEdit,
  onDelete,
  onStatusChange
}: OrdersTableProps) {
  const isMobile = useIsMobile();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Canceled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  if (isMobile) {
    // Mobile card layout - Optimized for Android
    return (
      <div className="w-full p-3 space-y-3">
        {orders.map((order) => (
          <Card key={order.id} className="w-full overflow-hidden">
            <CardContent className="p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0 pr-2">
                  <h3 className="font-medium text-sm leading-tight truncate">
                    #{order.id.substring(0, 8)}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                    {order.customer?.name || 'Unknown Customer'}
                  </p>
                </div>
                <Badge className={`text-xs px-2 py-1 flex-shrink-0 ${getStatusColor(order.status)}`}>
                  {order.status}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-gray-500 dark:text-gray-400 text-xs">
                  {new Date(order.order_date).toLocaleDateString()}
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {formatRupiah(order.total)}
                </span>
              </div>

              <div className="flex justify-end">
                <OrderActions 
                  order={order} 
                  onEdit={onEdit} 
                  onDelete={onDelete}
                  onStatusChange={onStatusChange}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Desktop table layout - Responsive with horizontal scroll
  return (
    <div className="w-full">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
        <div className="min-w-full inline-block align-middle">
          <Table className="min-w-[600px]">
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800">
                <TableHead className="font-medium text-gray-900 dark:text-white w-[120px]">Order ID</TableHead>
                <TableHead className="font-medium text-gray-900 dark:text-white w-[100px]">Date</TableHead>
                <TableHead className="font-medium text-gray-900 dark:text-white min-w-[150px]">Customer</TableHead>
                <TableHead className="font-medium text-gray-900 dark:text-white text-right w-[120px]">Total</TableHead>
                <TableHead className="font-medium text-gray-900 dark:text-white w-[100px]">Status</TableHead>
                <TableHead className="font-medium text-gray-900 dark:text-white w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableCell className="font-mono text-sm">{order.id.substring(0, 8)}</TableCell>
                  <TableCell className="text-sm text-gray-600 dark:text-gray-300">
                    {new Date(order.order_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm text-gray-900 dark:text-white">
                    <div className="truncate max-w-[150px]">
                      {order.customer?.name || "Unknown"}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-gray-900 dark:text-white">
                    {formatRupiah(order.total)}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(order.status)}`}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <OrderActions 
                      order={order} 
                      onEdit={onEdit} 
                      onDelete={onDelete}
                      onStatusChange={onStatusChange}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
