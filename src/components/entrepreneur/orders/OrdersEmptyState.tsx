
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Plus } from 'lucide-react';

interface OrdersEmptyStateProps {
  onOpenForm: () => void;
}

export function OrdersEmptyState({ onOpenForm }: OrdersEmptyStateProps) {
  return (
    <div className="w-full p-4">
      <Card className="border-dashed border-2 border-border/50">
        <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            You haven't created any orders yet. Start by creating your first order or check if you have any POS transactions that should appear here.
          </p>
          <Button onClick={onOpenForm} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create First Order
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
