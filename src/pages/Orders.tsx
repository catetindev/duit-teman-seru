
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
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
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
      <div className="space-y-8">
        {/* Header Section */}
        <OrdersHeader onAddNew={handleAddNew} />
        
        {/* Filters Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
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
        
        {/* Content Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
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
    </DashboardLayout>
  );
}
