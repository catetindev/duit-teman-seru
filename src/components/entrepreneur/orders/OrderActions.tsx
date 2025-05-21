
import React from 'react';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/entrepreneur';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Trash2, ChevronDown } from 'lucide-react';

interface OrderActionsProps {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: Order['status']) => void;
}

export function OrderActions({ 
  order, 
  onEdit, 
  onDelete, 
  onStatusChange 
}: OrderActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEdit(order)}
      >
        <Edit className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(order.id)}
      >
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            {order.status} <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem 
            onClick={() => onStatusChange(order.id, 'Pending')}
            disabled={order.status === 'Pending'}
          >
            Pending
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onStatusChange(order.id, 'Paid')}
            disabled={order.status === 'Paid'}
          >
            Paid
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => onStatusChange(order.id, 'Canceled')}
            disabled={order.status === 'Canceled'}
          >
            Canceled
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
