
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Users, ShoppingBag, Package, ArrowRight, BarChart2 } from 'lucide-react';
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
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="space-y-6">
      {/* Business Summary with improved revenue calculation */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <BusinessSummary />
      </motion.div>
      
      {/* Quick Actions */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.1 }}
      >
        <BusinessTransactionButtons 
          onAddIncome={onAddIncome} 
          onAddExpense={onAddExpense} 
        />
      </motion.div>
      
      {/* Business Stats */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="bg-white dark:bg-gray-800 border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">Customers</p>
              {loading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <h4 className="text-2xl font-bold">{totalCustomers}</h4>
              )}
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">Products</p>
              {loading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <h4 className="text-2xl font-bold">{totalProducts}</h4>
              )}
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">Orders</p>
              {loading ? (
                <Skeleton className="h-8 w-16 mt-1" />
              ) : (
                <h4 className="text-2xl font-bold">{totalOrders}</h4>
              )}
            </div>
            <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 border-none shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">Reports</p>
              <h4 className="text-2xl font-bold">2</h4>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <BarChart2 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Quick Access Modules */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-900 overflow-hidden group">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <span className="bg-blue-100 dark:bg-blue-800/60 p-2 rounded-full mr-3">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </span>
              Pricing Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Calculate your product prices based on costs and profit margin</p>
            <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700 transition-all group-hover:translate-x-1">
              <Link to="/calculator" className="flex items-center">
                Open Calculator <ArrowRight className="ml-2 h-4 w-4 group-hover:ml-3 transition-all" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-900 overflow-hidden group">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <span className="bg-purple-100 dark:bg-purple-800/60 p-2 rounded-full mr-3">
                <TrendingDown className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </span>
              Invoice Generator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">Create professional invoices for your customers quickly</p>
            <Button asChild variant="default" className="bg-purple-600 hover:bg-purple-700 transition-all group-hover:translate-x-1">
              <Link to="/invoices" className="flex items-center">
                Create Invoice <ArrowRight className="ml-2 h-4 w-4 group-hover:ml-3 transition-all" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Main Content Grid */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2">
          {/* Business Chart */}
          <BusinessChart />
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          {/* Invoice Reminder */}
          <InvoiceReminder />
          
          {/* Customer Overview */}
          <CustomerOverview />

          {/* Top Products */}
          <TopProductsList />
        </div>
      </motion.div>
    </div>
  );
}
