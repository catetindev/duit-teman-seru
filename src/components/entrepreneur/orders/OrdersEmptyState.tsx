
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface OrdersEmptyStateProps {
  onOpenForm: () => void;
}

export function OrdersEmptyState({ onOpenForm }: OrdersEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 border border-dashed rounded-lg">
      <h3 className="text-lg font-medium mb-2">No orders found</h3>
      <p className="text-muted-foreground mb-4">Get started by creating a new order</p>
      <Button onClick={onOpenForm} className="flex items-center gap-2">
        <Plus className="h-4 w-4" /> Create New Order
      </Button>
    </div>
  );
}
