
import React, { useState } from 'react';
import { Order, Customer, Product } from '@/types/entrepreneur';
import OrderList from '@/components/entrepreneur/OrderList';
import OrderFormDialog from '@/components/entrepreneur/OrderFormDialog';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import { updateProductStock } from '@/utils/inventoryUtils';

interface OrdersContentProps {
  orders: Order[];
  customers: Customer[];
  products: Product[];
  loading: boolean;
  onDataChange: () => void;
}

export function OrdersContent({
  orders,
  customers,
  products,
  loading,
  onDataChange
}: OrdersContentProps) {
  const { t } = useLanguage();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  const handleEdit = (order: Order) => {
    setSelectedOrder(order);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      // Get order details first to check status and restore stock if needed
      const { data: orderToDelete, error: fetchError } = await supabase
        .from('orders')
        .select('payment_proof_url, status, products')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;

      // If order was paid, restore the stock
      if (orderToDelete && orderToDelete.status === 'Paid') {
        const productsData = orderToDelete.products;
        if (Array.isArray(productsData)) {
          // Pass the products data as-is, the inventoryUtils will handle the parsing
          await updateProductStock(productsData, false); // false = restore stock
        }
      }
      
      // Delete payment proof if exists
      if (orderToDelete?.payment_proof_url) {
        const imagePath = orderToDelete.payment_proof_url.split('/').pop();
        if (imagePath) {
          await supabase.storage.from('products').remove([imagePath]);
        }
      }
      
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      onDataChange();
      toast({
        title: 'Success',
        description: 'Order deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete order',
        variant: 'destructive',
      });
    }
  };

  const handleStatusChange = async (id: string, status: Order['status']) => {
    try {
      // Get current order data first
      const { data: currentOrder, error: fetchError } = await supabase
        .from('orders')
        .select('status, products')
        .eq('id', id)
        .single();
        
      if (fetchError) throw fetchError;
      
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
      
      // Handle stock changes based on status change
      if (currentOrder) {
        const previousStatus = currentOrder.status;
        const newStatus = status;
        
        // If order was canceled and is now marked as paid, reduce stock
        if (previousStatus === 'Canceled' && newStatus === 'Paid') {
          // Pass the products data as-is, the inventoryUtils will handle the parsing
          await updateProductStock(currentOrder.products, true);
        }
        // If order was paid and is now canceled, restore stock
        else if (previousStatus === 'Paid' && newStatus === 'Canceled') {
          // Pass the products data as-is, the inventoryUtils will handle the parsing
          await updateProductStock(currentOrder.products, false);
        }
      }
      
      onDataChange();
      
      toast({
        title: 'Status Updated',
        description: `Order status changed to ${t(`order.status.${status.toLowerCase()}`)}`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update status',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitSuccess = () => {
    onDataChange();
    setIsFormOpen(false);
  };

  const handleOpenForm = () => {
    setSelectedOrder(null);
    setIsFormOpen(true);
  };

  return (
    <>
      {/* Orders List */}
      <OrderList 
        orders={orders}
        loading={loading} 
        onEdit={handleEdit} 
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />

      {/* Order Form Dialog */}
      <OrderFormDialog 
        open={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        order={selectedOrder} 
        onSubmitSuccess={handleSubmitSuccess}
        customers={customers}
        products={products}
      />
    </>
  );
}
