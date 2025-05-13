import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Users, ShoppingBag, Package, ArrowRight, FileText, CalculatorIcon, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BusinessSummary } from './BusinessSummary';
import { BusinessTransactionButtons } from './BusinessTransactionButtons';
import { BusinessChart } from './BusinessChart';
import { ClientTracker } from './CustomerData'; // Changed CustomerData to ClientTracker
import { InvoiceReminder } from './InvoiceReminder';
import { useEntrepreneurData } from '@/hooks/useEntrepreneurData'; // Import the new hook
import { formatCurrency } from '@/utils/formatUtils';

interface EntrepreneurDashboardProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
}

export function EntrepreneurDashboard({
  onAddIncome,
  onAddExpense
}: EntrepreneurDashboardProps) {
  const { stats, chartData, loading, refreshData } = useEntrepreneurData();

  const statCards = [
    { title: "Total Customers", value: stats.totalCustomers, icon: <Users className="h-6 w-6 text-blue-500" />, color: "blue", link: "/customers" },
    { title: "Products", value: stats.totalProducts, icon: <Package className="h-6 w-6 text-purple-500" />, color: "purple", link: "/products" },
    { title: "Orders", value: stats.totalOrders, icon: <ShoppingBag className="h-6 w-6 text-green-500" />, color: "green", link: "/orders" },
  ];

  const quickAccessModules = [
    { title: "Pricing Calculator", description: "Calculate product prices based on costs and desired profit margin", icon: <CalculatorIcon className="h-5 w-5 text-indigo-500" />, link: "/calculator", buttonText: "Open Calculator", color: "indigo" },
    { title: "Invoice Generator", description: "Create professional invoices for your customers quickly", icon: <FileText className="h-5 w-5 text-teal-500" />, link: "/invoices", buttonText: "Create Invoice", color: "teal" },
    { title: "Financial Reports", description: "View detailed financial statements and analytics", icon: <LineChart className="h-5 w-5 text-pink-500" />, link: "/finance-reports", buttonText: "View Reports", color: "pink" },
  ];

  return (
    <div className="space-y-8">
      {/* Business Summary */}
      <BusinessSummary 
        totalIncome={stats.totalIncome} 
        totalExpenses={stats.totalExpenses}
        netProfit={stats.netProfit} 
        currency="IDR"
      />
      
      {/* Quick Actions */}
      <BusinessTransactionButtons 
        onAddIncome={onAddIncome} 
        onAddExpense={onAddExpense} 
      />
      
      {/* Business Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map(card => (
          <Card key={card.title} className={`hover:shadow-md transition-shadow duration-300 border-l-4 border-${card.color}-500`}>
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">{card.title}</p>
                <h4 className="text-3xl font-bold text-gray-800 dark:text-white">
                  {loading ? <span className="animate-pulse">...</span> : card.value}
                </h4>
              </div>
              <div className={`h-12 w-12 rounded-full bg-${card.color}-100 dark:bg-${card.color}-900/30 flex items-center justify-center`}>
                {card.icon}
              </div>
            </CardContent>
            <Button asChild variant="ghost" size="sm" className={`w-full justify-start text-xs text-${card.color}-600 dark:text-${card.color}-400 rounded-t-none`}>
              <Link to={card.link}>
                View Details <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </Card>
        ))}
      </div>
      
      {/* Quick Access Modules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickAccessModules.map(module => (
          <Card key={module.title} className={`bg-gradient-to-br from-${module.color}-50 to-${module.color}-100 border-${module.color}-200 dark:from-${module.color}-900/30 dark:to-${module.color}-800/30 dark:border-${module.color}-700 hover:shadow-md transition-shadow duration-300`}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 mb-1">
                {module.icon}
                <CardTitle className="text-lg font-semibold">{module.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 h-16">{module.description}</p> {/* Fixed height for description */}
              <Button asChild variant="outline" className={`w-full bg-white/70 dark:bg-black/30 border-${module.color}-300 dark:border-${module.color}-600 text-${module.color}-700 dark:text-${module.color}-300 hover:bg-${module.color}-100 dark:hover:bg-${module.color}-700/50`}>
                <Link to={module.link}>
                  {module.buttonText} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Business Chart */}
          <BusinessChart data={chartData} loading={loading} />
        </div>
        
        <div className="lg:col-span-1 space-y-8">
          {/* Customer Data */}
          <ClientTracker /> {/* Changed CustomerData to ClientTracker */}
          
          {/* Invoice Reminder */}
          <InvoiceReminder />
        </div>
      </div>
    </div>
  );
}