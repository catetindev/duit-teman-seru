
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { OrdersHeader } from '@/components/entrepreneur/orders/OrdersHeader';
import { OrdersFilters } from '@/components/entrepreneur/orders/OrdersFilters';
import { OrdersContent } from '@/components/entrepreneur/orders/OrdersContent';
import { useOrders } from '@/components/entrepreneur/orders/useOrders';

export default function Orders() {
  const { isPremium } = useAuth();
  
  const {
    orders: filteredOrders,
    customers,
    products,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    customerFilter,
    setCustomerFilter,
    dateRange,
    setDateRange,
    fetchData
  } = useOrders();

  const handleAddNew = () => {
    // This function is passed to the header component
  };

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="p-4 md:p-6">
        <OrdersHeader onAddNew={handleAddNew} />
        
        <OrdersFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          customerFilter={customerFilter}
          setCustomerFilter={setCustomerFilter}
          dateRange={dateRange}
          setDateRange={setDateRange}
          customers={customers}
        />
        
        <OrdersContent
          orders={filteredOrders}
          customers={customers}
          products={products}
          loading={loading}
          onDataChange={fetchData}
        />
      </div>
    </DashboardLayout>
  );
}
