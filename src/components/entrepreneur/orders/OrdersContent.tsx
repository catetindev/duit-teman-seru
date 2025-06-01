
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Order, Customer, Product } from '@/types/entrepreneur';
import { OrdersTable } from './OrdersTable';
import { OrdersEmptyState } from './OrdersEmptyState';
import { OrdersLoadingState } from './OrdersLoadingState';
import OrderFormDialog from '@/components/entrepreneur/OrderFormDialog';

interface OrdersContentProps {
  orders: Order[];
  customers: Customer[];
  products: Product[];
  loading: boolean;
  onDataChange: () => void;
}

export interface OrdersContentRef {
  handleOpenForm: () => void;
}

export const OrdersContent = forwardRef<OrdersContentRef, OrdersContentProps>(
  ({ orders, customers, products, loading, onDataChange }, ref) => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | undefined>();

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
      if (confirm('Are you sure you want to delete this order?')) {
        try {
          // Delete logic here
          onDataChange();
        } catch (error) {
          console.error('Error deleting order:', error);
        }
      }
    };

    const handleStatusChange = async (id: string, status: Order['status']) => {
      try {
        // Status update logic here
        onDataChange();
      } catch (error) {
        console.error('Error updating order status:', error);
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
