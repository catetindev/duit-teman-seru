
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Order, Customer, Product } from '@/types/entrepreneur';
import { OrdersTable } from './OrdersTable';
import { OrdersEmptyState } from './OrdersEmptyState';
import { OrdersLoadingState } from './OrdersLoadingState';
import OrderFormDialog from '@/components/entrepreneur/OrderFormDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface OrdersContentProps {
  orders: Order[];
  customers: Customer[];
  products: Product[];
  loading: boolean;
  onDataChange: () => void;
  onDelete?: (id: string) => Promise<boolean>;
}

export interface OrdersContentRef {
  handleOpenForm: () => void;
}

export const OrdersContent = forwardRef<OrdersContentRef, OrdersContentProps>(
  ({ orders, customers, products, loading, onDataChange, onDelete }, ref) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();
    const { toast } = useToast();
    const { user } = useAuth();

    useImperativeHandle(ref, () => ({
      handleOpenForm: () => {
        setSelectedOrder(undefined);
        setIsFormOpen(true);
      }
    }));

    const handleEdit = (order: Order) => {
      setSelectedOrder(order);
      setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
      if (onDelete) {
        // Use the provided delete function from useOrders
        const success = await onDelete(id);
        if (success) {
          onDataChange();
        }
        return;
      }

      // Fallback to original delete logic
      if (!user?.id) {
        toast({
          title: 'Error',
          description: 'User not authenticated',
          variant: 'destructive',
        });
        return;
      }

      if (confirm('Are you sure you want to delete this order?')) {
        try {
          console.log('Deleting order:', id);
          
          const { error } = await supabase
            .from('orders')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);
          
          if (error) {
            console.error('Error deleting order:', error);
            throw error;
          }

          toast({
            title: 'Success',
            description: 'Order deleted successfully',
          });
          
          onDataChange();
        } catch (error: any) {
          console.error('Error deleting order:', error);
          toast({
            title: 'Error',
            description: error.message || 'Failed to delete order',
            variant: 'destructive',
          });
        }
      }
    };

    const handleStatusChange = async (id: string, status: Order['status']) => {
      if (!user?.id) {
        toast({
          title: 'Error',
          description: 'User not authenticated',
          variant: 'destructive',
        });
        return;
      }

      try {
        console.log('Updating order status:', id, status);
        
        const { error } = await supabase
          .from('orders')
          .update({ status })
          .eq('id', id)
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error updating order status:', error);
          throw error;
        }

        toast({
          title: 'Success',
          description: 'Order status updated successfully',
        });
        
        onDataChange();
      } catch (error: any) {
        console.error('Error updating order status:', error);
        toast({
          title: 'Error',
          description: error.message || 'Failed to update order status',
          variant: 'destructive',
        });
      }
    };

    const handleFormSubmit = () => {
      setIsFormOpen(false);
      setSelectedOrder(undefined);
      onDataChange();
    };

    if (loading) {
      return <OrdersLoadingState />;
    }

    if (orders.length === 0) {
      return <OrdersEmptyState onOpenForm={() => setIsFormOpen(true)} />;
    }

    return (
      <div className="w-full">
        <div className="p-3 sm:p-4 lg:p-6">
          <OrdersTable
            orders={orders}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        </div>

        <OrderFormDialog
          open={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedOrder(undefined);
          }}
          order={selectedOrder || null}
          customers={customers}
          products={products}
          onSubmitSuccess={handleFormSubmit}
        />
      </div>
    );
  }
);

OrdersContent.displayName = 'OrdersContent';
