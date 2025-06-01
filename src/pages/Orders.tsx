
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useEntrepreneurMode } from '@/hooks/useEntrepreneurMode';
import { OrdersHeader } from '@/components/entrepreneur/orders/OrdersHeader';
import { OrdersFilters } from '@/components/entrepreneur/orders/OrdersFilters';
import { OrdersContent } from '@/components/entrepreneur/orders/OrdersContent';
import { useOrders } from '@/components/entrepreneur/orders/useOrders';
import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Orders() {
  const { isPremium } = useAuth();
  const { isEntrepreneurMode } = useEntrepreneurMode();
  
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

  // Show locked state if not in entrepreneur mode
  if (!isEntrepreneurMode) {
    return (
      <DashboardLayout isPremium={isPremium}>
        <div className="p-6">
          <Card className="max-w-md mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <Lock className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold mb-2">Orders & Transactions</h3>
              <p className="text-muted-foreground mb-6">
                Switch to Entrepreneur mode to access orders and transactions.
              </p>
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                variant="outline"
              >
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

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
