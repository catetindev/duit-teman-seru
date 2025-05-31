
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

  const contentRef = React.useRef<{ handleOpenForm: () => void } | null>(null);

  const handleAddNew = () => {
    contentRef.current?.handleOpenForm();
  };

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="min-h-screen w-full">
        {/* Main container with proper responsive spacing */}
        <div className="w-full max-w-full mx-auto space-y-4 sm:space-y-6">
          {/* Header Section - Fixed padding */}
          <div className="px-3 sm:px-4 lg:px-6 pt-4 sm:pt-6">
            <OrdersHeader onAddNew={handleAddNew} />
          </div>
          
          {/* Filters Section - Responsive container */}
          <div className="px-3 sm:px-4 lg:px-6">
            <div className="w-full bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
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
          
          {/* Content Section - Full width with responsive padding */}
          <div className="w-full">
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 sm:mx-3 sm:border sm:rounded-lg sm:shadow-sm lg:mx-6">
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
          
          {/* Bottom padding for mobile navigation */}
          <div className="pb-20 sm:pb-6" />
        </div>
      </div>
    </DashboardLayout>
  );
}
