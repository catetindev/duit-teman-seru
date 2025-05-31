
import React from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus } from 'lucide-react';

interface OrdersEmptyStateProps {
  onOpenForm: () => void;
}

export function OrdersEmptyState({ onOpenForm }: OrdersEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mb-4">
        <ShoppingCart className="h-8 w-8 text-amber-600 dark:text-amber-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        No orders yet
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
        Start creating orders to track your business transactions and manage customer purchases.
      </p>
      <Button 
        onClick={onOpenForm}
        className="bg-amber-500 hover:bg-amber-600 text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create First Order
      </Button>
    </div>
  );
}
