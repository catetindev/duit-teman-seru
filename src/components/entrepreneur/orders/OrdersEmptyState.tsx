
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface OrdersEmptyStateProps {
  onOpenForm: () => void;
}

export function OrdersEmptyState({ onOpenForm }: OrdersEmptyStateProps) {
  return (
    <div className="w-full p-6">
      <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-4">
            <Plus className="h-8 w-8 text-purple-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-sm">
            Create your first order to start tracking sales and customer transactions.
          </p>
          <Button onClick={onOpenForm} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Create First Order
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
