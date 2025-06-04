
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUp, ArrowDown, TrendingUp, DollarSign, ShoppingCart, Users, Eye } from 'lucide-react';
import { useDashboardData } from '@/hooks/useDashboardData';
import { formatCurrency } from '@/utils/formatUtils';
import { useEntrepreneurMode } from '@/hooks/useEntrepreneurMode';

export default function EntrepreneurDashboard() {
  const { isPremium } = useAuth();
  const { isEntrepreneurMode } = useEntrepreneurMode();
  const { stats, transactions, loading } = useDashboardData();

  // Filter business transactions for display
  const businessTransactions = transactions.filter(t => t.is_business);
  const recentBusinessTransactions = businessTransactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const statsCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalIncome || 0, 'IDR'),
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      gradient: 'from-emerald-400 to-teal-500'
    },
    {
      title: 'Monthly Expenses',
      value: formatCurrency(stats?.totalExpenses || 0, 'IDR'),
      change: '-3.2%',
      trend: 'down',
      icon: ArrowDown,
      gradient: 'from-pink-400 to-rose-500'
    },
    {
      title: 'Net Profit',
      value: formatCurrency((stats?.totalIncome || 0) - (stats?.totalExpenses || 0), 'IDR'),
      change: '+8.1%',
      trend: 'up',
      icon: TrendingUp,
      gradient: 'from-violet-400 to-purple-500'
    },
    {
      title: 'Total Orders',
      value: '142',
      change: '+24%',
      trend: 'up',
      icon: ShoppingCart,
      gradient: 'from-blue-400 to-indigo-500'
    }
  ];

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="min-h-screen bg-slate-50">
        {/* Header Section */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  Business Dashboard
                </h1>
                <p className="text-slate-600 mt-1">
                  Track your business performance and growth
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-slate-50 border-slate-200">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                  Live Data
                </Badge>
                {isEntrepreneurMode && (
                  <Badge className="bg-slate-800 text-white">
                    💼 Business Mode
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat, index) => (
              <Card key={index} className="relative overflow-hidden border border-slate-200 bg-white">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`}></div>
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        {stat.trend === 'up' ? (
                          <ArrowUp className="h-4 w-4 text-emerald-500 mr-1" />
                        ) : (
                          <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm font-medium ${
                          stat.trend === 'up' ? 'text-emerald-600' : 'text-red-600'
                        }`}>
                          {stat.change}
                        </span>
                        <span className="text-slate-500 text-sm ml-1">vs last month</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-white border border-slate-200">
              <TabsTrigger value="overview" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
                📊 Overview
              </TabsTrigger>
              <TabsTrigger value="transactions" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
                💰 Transactions
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
                📈 Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <Card className="border border-slate-200 bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-slate-800">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start bg-emerald-500 hover:bg-emerald-600 text-white">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      New Sale
                    </Button>
                    <Button className="w-full justify-start bg-blue-500 hover:bg-blue-600 text-white">
                      <Users className="mr-2 h-4 w-4" />
                      Add Customer
                    </Button>
                    <Button className="w-full justify-start bg-violet-500 hover:bg-violet-600 text-white">
                      <Eye className="mr-2 h-4 w-4" />
                      View Reports
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border border-slate-200 bg-white">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold text-slate-800">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentBusinessTransactions.map((transaction, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${
                              transaction.type === 'income' ? 'bg-emerald-400' : 'bg-rose-400'
                            }`}></div>
                            <div>
                              <p className="font-medium text-slate-800 text-sm">{transaction.description}</p>
                              <p className="text-xs text-slate-500">{transaction.category}</p>
                            </div>
                          </div>
                          <span className={`font-semibold text-sm ${
                            transaction.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                          }`}>
                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount, transaction.currency)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <Card className="border border-slate-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-slate-800">Business Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">Transaction management interface coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card className="border border-slate-200 bg-white">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-slate-800">Business Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">Advanced analytics and reporting coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
}
