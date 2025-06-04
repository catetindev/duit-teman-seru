
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
import { motion } from 'framer-motion';

interface EntrepreneurDashboardProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
}

export function EntrepreneurDashboard({
  onAddIncome,
  onAddExpense
}: EntrepreneurDashboardProps) {
  const { totalCustomers, totalProducts, totalOrders, loading } = useBusinessStats();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        {/* Header Section - Modern and clean */}
        <motion.div 
          variants={fadeIn} 
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-slate-100"
        >
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Welcome to Your Business Dashboard
              </h1>
              <motion.div 
                className="shrink-0"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-medium bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-200 shadow-sm">
                  <span className="mr-1.5">🚀</span>
                  Business Mode
                </div>
              </motion.div>
            </div>
            <p className="text-base text-slate-600">
              Let's build your dream business together
            </p>
          </div>
        </motion.div>

        {/* Business Performance Section */}
        <motion.div variants={fadeIn}>
          <BusinessSummary />
        </motion.div>

        {/* Quick Actions Section */}
        <motion.div variants={fadeIn}>
          <BusinessTransactionButtons onAddIncome={onAddIncome} onAddExpense={onAddExpense} />
        </motion.div>
        
        {/* Business Stats Grid - Modern cards */}
        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          <motion.div variants={fadeIn}>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group h-full">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-500 mb-1 truncate">Customers</p>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <h4 className="text-2xl lg:text-3xl font-bold text-slate-800">{totalCustomers}</h4>
                    )}
                    <p className="text-xs text-emerald-600 font-medium mt-1">+12% this month</p>
                  </div>
                  <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-2xl bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <Users className="h-6 lg:h-7 w-6 lg:w-7 text-sky-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeIn}>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group h-full">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-500 mb-1 truncate">Products</p>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <h4 className="text-2xl lg:text-3xl font-bold text-slate-800">{totalProducts}</h4>
                    )}
                    <p className="text-xs text-emerald-600 font-medium mt-1">+5% this week</p>
                  </div>
                  <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <Package className="h-6 lg:h-7 w-6 lg:w-7 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeIn}>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group h-full">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-500 mb-1 truncate">Orders</p>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <h4 className="text-2xl lg:text-3xl font-bold text-slate-800">{totalOrders}</h4>
                    )}
                    <p className="text-xs text-emerald-600 font-medium mt-1">+24% today</p>
                  </div>
                  <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-2xl bg-gradient-to-br from-coral-100 to-coral-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <ShoppingBag className="h-6 lg:h-7 w-6 lg:w-7 text-coral-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeIn}>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group h-full">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-500 mb-1 truncate">Reports</p>
                    <h4 className="text-2xl lg:text-3xl font-bold text-slate-800">2</h4>
                    <p className="text-xs text-slate-400 font-medium mt-1">Ready to view</p>
                  </div>
                  <div className="h-12 w-12 lg:h-14 lg:w-14 rounded-2xl bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    <BarChart2 className="h-6 lg:h-7 w-6 lg:w-7 text-violet-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        
        {/* Business Tools - Modern layout */}
        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <motion.div variants={fadeIn}>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg lg:text-xl font-semibold flex items-center text-slate-800">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mr-3 shadow-sm">
                    <Calculator className="h-5 w-5 text-blue-600" />
                  </div>
                  Pricing Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-6 pb-6">
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Calculate your product prices based on costs and profit margin to maximize your earnings 💰
                </p>
                <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl h-12 font-medium group-hover:scale-[1.02] transition-transform duration-300 shadow-lg">
                  <Link to="/calculator" className="flex items-center justify-center">
                    Open Calculator 
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeIn}>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden group h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg lg:text-xl font-semibold flex items-center text-slate-800">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center mr-3 shadow-sm">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  Invoice Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-6 pb-6">
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Create professional invoices for your customers quickly and efficiently ✨
                </p>
                <Button asChild className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl h-12 font-medium group-hover:scale-[1.02] transition-transform duration-300 shadow-lg">
                  <Link to="/invoices" className="flex items-center justify-center">
                    Create Invoice 
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        
        {/* Main Content Grid */}
        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8"
        >
          <motion.div variants={fadeIn} className="xl:col-span-2">
            <BusinessChart />
          </motion.div>
          
          <motion.div variants={fadeIn} className="xl:col-span-1 space-y-6">
            <InvoiceReminder />
            <CustomerOverview />
            <TopProductsList />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
