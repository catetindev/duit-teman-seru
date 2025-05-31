
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

  // Create a reference to the OrdersContent component to call the handleOpenForm method
  const contentRef = React.useRef<{ handleOpenForm: () => void } | null>(null);

  const handleAddNew = () => {
    // Call the handleOpenForm method of OrdersContent
    contentRef.current?.handleOpenForm();
  };

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="flex flex-col h-full">
        {/* Main content area with proper spacing */}
        <div className="flex-1 p-4 md:p-6 space-y-4 md:space-y-6 pb-20 md:pb-6">
          {/* Page Header */}
          <div className="flex flex-col space-y-4">
            <OrdersHeader onAddNew={handleAddNew} />
            
            {/* Filters Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border p-4 shadow-sm">
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
            </div>
          </div>
          
          {/* Orders Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border shadow-sm overflow-hidden">
            <OrdersContent
              ref={contentRef}
              orders={filteredOrders}
              customers={customers}
              products={products}
              loading={loading}
              onDataChange={fetchData}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
