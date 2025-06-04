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
  return <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        {/* Header Section - Clean and minimal */}
        

        {/* Business Performance Section */}
        <BusinessSummary />

        {/* Quick Actions Section */}
        <BusinessTransactionButtons onAddIncome={onAddIncome} onAddExpense={onAddExpense} />
        
        {/* Business Stats Grid - Clean cards without shadows */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="bg-white border border-slate-200 rounded-2xl overflow-hidden h-full">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-500 mb-1 truncate">Customers</p>
                  {loading ? <Skeleton className="h-8 w-16" /> : <h4 className="text-2xl lg:text-3xl font-bold text-slate-800">{totalCustomers}</h4>}
                  <p className="text-xs text-emerald-600 font-medium mt-1">+12% this month</p>
                </div>
                <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-2xl bg-sky-100 flex items-center justify-center">
                  <Users className="h-6 lg:h-7 w-6 lg:w-7 text-sky-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-slate-200 rounded-2xl overflow-hidden h-full">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-500 mb-1 truncate">Products</p>
                  {loading ? <Skeleton className="h-8 w-16" /> : <h4 className="text-2xl lg:text-3xl font-bold text-slate-800">{totalProducts}</h4>}
                  <p className="text-xs text-emerald-600 font-medium mt-1">+5% this week</p>
                </div>
                <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                  <Package className="h-6 lg:h-7 w-6 lg:w-7 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-slate-200 rounded-2xl overflow-hidden h-full">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-500 mb-1 truncate">Orders</p>
                  {loading ? <Skeleton className="h-8 w-16" /> : <h4 className="text-2xl lg:text-3xl font-bold text-slate-800">{totalOrders}</h4>}
                  <p className="text-xs text-emerald-600 font-medium mt-1">+24% today</p>
                </div>
                <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-2xl bg-orange-100 flex items-center justify-center">
                  <ShoppingBag className="h-6 lg:h-7 w-6 lg:w-7 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-slate-200 rounded-2xl overflow-hidden h-full">
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-500 mb-1 truncate">Reports</p>
                  <h4 className="text-2xl lg:text-3xl font-bold text-slate-800">2</h4>
                  <p className="text-xs text-slate-400 font-medium mt-1">Ready to view</p>
                </div>
                <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-2xl bg-violet-100 flex items-center justify-center">
                  <BarChart2 className="h-6 lg:h-7 w-6 lg:w-7 text-violet-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Business Tools - Clean layout without shadows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border border-slate-200 rounded-2xl overflow-hidden h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg lg:text-xl font-semibold flex items-center text-slate-800">
                <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center mr-3">
                  <Calculator className="h-5 w-5 text-blue-600" />
                </div>
                Pricing Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-6 pb-6">
              <p className="text-slate-600 mb-6 leading-relaxed">
                Calculate your product prices based on costs and profit margin to maximize your earnings 💰
              </p>
              <Button asChild className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl h-12 font-medium">
                <Link to="/calculator" className="flex items-center justify-center">
                  Open Calculator 
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-slate-200 rounded-2xl overflow-hidden h-full">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg lg:text-xl font-semibold flex items-center text-slate-800">
                <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center mr-3">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                Invoice Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-6 pb-6">
              <p className="text-slate-600 mb-6 leading-relaxed">
                Create professional invoices for your customers quickly and efficiently ✨
              </p>
              <Button asChild className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl h-12 font-medium">
                <Link to="/invoices" className="flex items-center justify-center">
                  Create Invoice 
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          <div className="xl:col-span-2">
            <BusinessChart />
          </div>
          
          <div className="xl:col-span-1 space-y-6">
            <InvoiceReminder />
            <CustomerOverview />
            <TopProductsList />
          </div>
        </div>
      </div>
    </div>;
}