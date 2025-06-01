
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Package } from 'lucide-react';

interface OrdersHeaderProps {
  onAddNew: () => void;
}

export function OrdersHeader({ onAddNew }: OrdersHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Orders & Transactions
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your orders and POS transactions
          </p>
        </div>
      </div>
      
      <Button 
        onClick={onAddNew}
        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">New Order</span>
        <span className="sm:hidden">New</span>
      </Button>
    </div>
  );
}
