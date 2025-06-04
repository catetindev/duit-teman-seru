
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
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2 font-inter">
            Let's build your dream biz 🚀
          </h1>
          <p className="text-slate-600 text-lg">
            Track your progress and grow your business one step at a time
          </p>
        </motion.div>

        {/* Business Summary */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.1 }}
        >
          <BusinessSummary />
        </motion.div>
        
        {/* Quick Actions */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ delay: 0.2 }}
        >
          <BusinessTransactionButtons 
            onAddIncome={onAddIncome} 
            onAddExpense={onAddExpense} 
          />
        </motion.div>
        
        {/* Business Stats Grid */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div variants={fadeIn}>
            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-slate-500 mb-1">Customers</p>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <h4 className="text-3xl font-bold text-slate-800">{totalCustomers}</h4>
                    )}
                    <p className="text-xs text-emerald-600 font-medium mt-1">+12% this month</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-sky-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-7 w-7 text-sky-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeIn}>
            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-slate-500 mb-1">Products</p>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <h4 className="text-3xl font-bold text-slate-800">{totalProducts}</h4>
                    )}
                    <p className="text-xs text-emerald-600 font-medium mt-1">+5% this week</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-emerald-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Package className="h-7 w-7 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeIn}>
            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-slate-500 mb-1">Orders</p>
                    {loading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      <h4 className="text-3xl font-bold text-slate-800">{totalOrders}</h4>
                    )}
                    <p className="text-xs text-emerald-600 font-medium mt-1">+24% today</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-coral-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <ShoppingBag className="h-7 w-7 text-coral-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeIn}>
            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-slate-500 mb-1">Reports</p>
                    <h4 className="text-3xl font-bold text-slate-800">2</h4>
                    <p className="text-xs text-slate-400 font-medium mt-1">Ready to view</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-violet-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BarChart2 className="h-7 w-7 text-violet-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        
        {/* Business Tools */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div variants={fadeIn}>
            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold flex items-center text-slate-800">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center mr-3">
                    <Calculator className="h-5 w-5 text-blue-600" />
                  </div>
                  Pricing Calculator
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Calculate your product prices based on costs and profit margin to maximize your earnings 💰
                </p>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 font-medium group-hover:scale-[1.02] transition-transform duration-300">
                  <Link to="/calculator" className="flex items-center justify-center">
                    Open Calculator 
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={fadeIn}>
            <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold flex items-center text-slate-800">
                  <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center mr-3">
                    <FileText className="h-5 w-5 text-purple-600" />
                  </div>
                  Invoice Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-600 mb-6 leading-relaxed">
                  Create professional invoices for your customers quickly and efficiently ✨
                </p>
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-12 font-medium group-hover:scale-[1.02] transition-transform duration-300">
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
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          <motion.div variants={fadeIn} className="lg:col-span-2">
            <BusinessChart />
          </motion.div>
          
          <motion.div variants={fadeIn} className="lg:col-span-1 space-y-6">
            <InvoiceReminder />
            <CustomerOverview />
            <TopProductsList />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
