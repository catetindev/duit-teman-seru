
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Users, ShoppingBag, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BusinessSummary } from './BusinessSummary';
import { BusinessTransactionButtons } from './BusinessTransactionButtons';
import { BusinessChart } from './BusinessChart';
import { CustomerOverview } from './CustomerOverview';
import { InvoiceReminder } from './InvoiceReminder';
import { useBusinessStats } from '@/hooks/entrepreneur/useBusinessStats';
import { Skeleton } from '@/components/ui/skeleton';

interface EntrepreneurDashboardProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
}

export function EntrepreneurDashboard({
  onAddIncome,
  onAddExpense
}: EntrepreneurDashboardProps) {
  const { totalCustomers, totalProducts, totalOrders, loading } = useBusinessStats();

  return (
    <div className="space-y-6">
      {/* Business Summary */}
      <BusinessSummary />
      
      {/* Quick Actions */}
      <BusinessTransactionButtons 
        onAddIncome={onAddIncome} 
        onAddExpense={onAddExpense} 
      />
      
      {/* Business Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">Total Customers</p>
              {loading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <h4 className="text-2xl font-bold">{totalCustomers}</h4>
              )}
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">Products</p>
              {loading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <h4 className="text-2xl font-bold">{totalProducts}</h4>
              )}
            </div>
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Package className="h-5 w-5 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">Orders</p>
              {loading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <h4 className="text-2xl font-bold">{totalOrders}</h4>
              )}
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Access Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pricing Calculator</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Calculate your product prices based on costs and desired profit margin</p>
            <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700">
              <Link to="/calculator">
                Open Calculator <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Invoice Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Create professional invoices for your customers quickly</p>
            <Button asChild variant="default" className="bg-purple-600 hover:bg-purple-700">
              <Link to="/invoices">
                Create Invoice <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Business Chart */}
          <BusinessChart />
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          {/* Invoice Reminder */}
          <InvoiceReminder />
          
          {/* Customer Overview (Replacing ClientTracker) */}
          <CustomerOverview />
        </div>
      </div>
    </div>
  );
}
