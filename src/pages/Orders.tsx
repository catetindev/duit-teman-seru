
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
      <div className="min-h-screen w-full overflow-x-hidden">
        {/* Mobile-optimized container with proper spacing */}
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 space-y-3 sm:space-y-4 lg:space-y-6 pb-20 sm:pb-6">
          {/* Page Header - Mobile First */}
          <div className="w-full space-y-3 sm:space-y-4">
            <OrdersHeader onAddNew={handleAddNew} />
            
            {/* Filters Section - Responsive */}
            <div className="w-full bg-white dark:bg-gray-800 rounded-lg border shadow-sm overflow-hidden">
              <div className="p-3 sm:p-4">
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
          </div>
          
          {/* Orders Content - Responsive Container */}
          <div className="w-full bg-white dark:bg-gray-800 rounded-lg border shadow-sm">
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
