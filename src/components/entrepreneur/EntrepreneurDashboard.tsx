
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Users, ShoppingBag, Package, ArrowRight, BarChart2, Calculator, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BusinessSummary } from './BusinessSummary';
import { BusinessTransactionButtons } from './BusinessTransactionButtons';
import { BusinessChart } from './BusinessChart';
import { CustomerOverview } from './CustomerOverview';
import { InvoiceReminder } from './InvoiceReminder';
import { useBusinessStats } from '@/hooks/entrepreneur/useBusinessStats';
import { Skeleton } from '@/components/ui/skeleton';
import { TopProductsList } from './TopProductsList';

interface EntrepreneurDashboardProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
}

export function EntrepreneurDashboard({
  onAddIncome,
  onAddExpense
}: EntrepreneurDashboardProps) {
  const {
    totalCustomers,
    totalProducts,
    totalOrders,
    loading
  } = useBusinessStats();

  return (
    <div className="space-y-6">
      {/* Business Performance Section */}
      <BusinessSummary />

      {/* Quick Actions Section */}
      <BusinessTransactionButtons onAddIncome={onAddIncome} onAddExpense={onAddExpense} />
      
      {/* Business Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1 truncate">Customers</p>
                {loading ? (
                  <Skeleton className="h-6 w-12 mb-1" />
                ) : (
                  <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">{totalCustomers}</h4>
                )}
                <p className="text-xs text-emerald-600 font-medium">+12% this month</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-sky-100 flex items-center justify-center">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-sky-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1 truncate">Products</p>
                {loading ? (
                  <Skeleton className="h-6 w-12 mb-1" />
                ) : (
                  <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">{totalProducts}</h4>
                )}
                <p className="text-xs text-emerald-600 font-medium">+5% this week</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Package className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1 truncate">Orders</p>
                {loading ? (
                  <Skeleton className="h-6 w-12 mb-1" />
                ) : (
                  <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">{totalOrders}</h4>
                )}
                <p className="text-xs text-emerald-600 font-medium">+24% today</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-slate-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1 truncate">Reports</p>
                <h4 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">2</h4>
                <p className="text-xs text-slate-500 font-medium">Ready to view</p>
              </div>
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-violet-100 flex items-center justify-center">
                <BarChart2 className="h-4 w-4 sm:h-5 sm:w-5 text-violet-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Business Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-white border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg font-semibold flex items-center text-slate-900">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                <Calculator className="h-4 w-4 text-blue-600" />
              </div>
              Pricing Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Calculate product prices based on costs and profit margins 💰
            </p>
            <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0 h-10 font-medium">
              <Link to="/calculator" className="flex items-center justify-center">
                Open Calculator 
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg font-semibold flex items-center text-slate-900">
              <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center mr-3">
                <FileText className="h-4 w-4 text-purple-600" />
              </div>
              Invoice Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Create professional invoices for customers quickly ✨
            </p>
            <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white border-0 h-10 font-medium">
              <Link to="/invoices" className="flex items-center justify-center">
                Create Invoice 
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <BusinessChart />
        </div>
        
        <div className="xl:col-span-1 space-y-4">
          <InvoiceReminder />
          <CustomerOverview />
          <TopProductsList />
        </div>
      </div>
    </div>
  );
}
