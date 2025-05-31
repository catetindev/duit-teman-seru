
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
import { ScrollArea } from '@/components/ui/scroll-area';

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
    // Mobile card layout - Fully responsive
    return (
      <div className="w-full">
        <div className="space-y-2 px-1">
          {orders.map((order) => (
            <Card key={order.id} className="w-full shadow-sm border border-gray-200 dark:border-gray-700">
              <CardContent className="p-3">
                <div className="space-y-3">
                  {/* Header Row */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                          #{order.id.substring(0, 8)}
                        </h3>
                        <Badge className={`text-xs px-2 py-0.5 ${getStatusColor(order.status)}`}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {order.customer?.name || 'Unknown Customer'}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0">
                      <OrderActions 
                        order={order} 
                        onEdit={onEdit} 
                        onDelete={onDelete}
                        onStatusChange={onStatusChange}
                      />
                    </div>
                  </div>
                  
                  {/* Details Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(order.order_date).toLocaleDateString('id-ID', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="font-semibold text-base text-gray-900 dark:text-white">
                      {formatRupiah(order.total)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Desktop table layout with proper responsive scroll
  return (
    <div className="w-full">
      {/* Responsive table container with horizontal scroll */}
      <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
        <ScrollArea className="w-full">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <TableHead className="font-semibold text-gray-900 dark:text-white w-[140px] px-4 py-3">
                    Order ID
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white w-[120px] px-4 py-3">
                    Date
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white min-w-[180px] px-4 py-3">
                    Customer
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white text-right w-[140px] px-4 py-3">
                    Total
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white w-[120px] px-4 py-3">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 dark:text-white w-[120px] px-4 py-3">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow 
                    key={order.id} 
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <TableCell className="px-4 py-3">
                      <span className="font-mono text-sm text-gray-900 dark:text-white">
                        {order.id.substring(0, 8)}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {new Date(order.order_date).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: 'short'
                        })}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="max-w-[160px]">
                        <span className="text-sm text-gray-900 dark:text-white truncate block">
                          {order.customer?.name || "Unknown"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <span className="font-semibold text-sm text-gray-900 dark:text-white">
                        {formatRupiah(order.total)}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3">
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
        </ScrollArea>
      </div>
    </div>
  );
}
