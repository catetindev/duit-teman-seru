
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto py-4 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        {/* Business Performance Section */}
        <BusinessSummary />

        {/* Quick Actions Section */}
        <BusinessTransactionButtons onAddIncome={onAddIncome} onAddExpense={onAddExpense} />
        
        {/* Business Stats Grid - Clean minimalist cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-2xl sm:rounded-3xl overflow-hidden h-full">
            <CardContent className="p-4 sm:p-5 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1 truncate">Customers</p>
                  {loading ? (
                    <Skeleton className="h-6 sm:h-8 w-12 sm:w-16 mb-1" />
                  ) : (
                    <h4 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-1">{totalCustomers}</h4>
                  )}
                  <p className="text-xs text-emerald-600 font-medium">+12% bulan ini</p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-2xl sm:rounded-3xl overflow-hidden h-full">
            <CardContent className="p-4 sm:p-5 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1 truncate">Products</p>
                  {loading ? (
                    <Skeleton className="h-6 sm:h-8 w-12 sm:w-16 mb-1" />
                  ) : (
                    <h4 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-1">{totalProducts}</h4>
                  )}
                  <p className="text-xs text-emerald-600 font-medium">+5% minggu ini</p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-2xl sm:rounded-3xl overflow-hidden h-full">
            <CardContent className="p-4 sm:p-5 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1 truncate">Orders</p>
                  {loading ? (
                    <Skeleton className="h-6 sm:h-8 w-12 sm:w-16 mb-1" />
                  ) : (
                    <h4 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-1">{totalOrders}</h4>
                  )}
                  <p className="text-xs text-emerald-600 font-medium">+24% hari ini</p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-2xl sm:rounded-3xl overflow-hidden h-full">
            <CardContent className="p-4 sm:p-5 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1 truncate">Reports</p>
                  <h4 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-1">2</h4>
                  <p className="text-xs text-slate-500 font-medium">Siap dilihat</p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                  <BarChart2 className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Business Tools - Clean minimalist layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-2xl sm:rounded-3xl overflow-hidden h-full">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg lg:text-xl font-semibold flex items-center text-slate-900">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-3">
                  <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                Pricing Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
              <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 leading-relaxed">
                Hitung harga produk berdasarkan biaya dan margin keuntungan 💰
              </p>
              <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 rounded-xl h-10 sm:h-12 font-medium text-sm sm:text-base">
                <Link to="/calculator" className="flex items-center justify-center">
                  Buka Calculator 
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-2xl sm:rounded-3xl overflow-hidden h-full">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg lg:text-xl font-semibold flex items-center text-slate-900">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mr-3">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                Invoice Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 sm:px-6 pb-4 sm:pb-6">
              <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6 leading-relaxed">
                Buat invoice profesional untuk pelanggan dengan cepat ✨
              </p>
              <Button asChild className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-0 rounded-xl h-10 sm:h-12 font-medium text-sm sm:text-base">
                <Link to="/invoices" className="flex items-center justify-center">
                  Buat Invoice 
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="xl:col-span-2">
            <BusinessChart />
          </div>
          
          <div className="xl:col-span-1 space-y-4 sm:space-y-6">
            <InvoiceReminder />
            <CustomerOverview />
            <TopProductsList />
          </div>
        </div>
      </div>
    </div>
  );
}
