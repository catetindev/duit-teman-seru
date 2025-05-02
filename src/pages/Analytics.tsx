
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatCurrency } from '@/components/dashboard/DashboardData';
import { 
  BarChart,
  ResponsiveContainer, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Calendar, TrendingUp, TrendingDown, PieChart as PieChartIcon } from 'lucide-react';

// Sample data for charts
const monthlyData = [
  { name: 'Jan', income: 8000000, expense: 6500000 },
  { name: 'Feb', income: 7500000, expense: 7000000 },
  { name: 'Mar', income: 9000000, expense: 6800000 },
  { name: 'Apr', income: 8800000, expense: 7200000 },
  { name: 'May', income: 8200000, expense: 6900000 },
  { name: 'Jun', income: 9500000, expense: 7100000 }
];

const pieData = [
  { name: 'Food', value: 2500000, color: '#8884d8' },
  { name: 'Transport', value: 1500000, color: '#83a6ed' },
  { name: 'Entertainment', value: 1000000, color: '#8dd1e1' },
  { name: 'Shopping', value: 800000, color: '#82ca9d' },
  { name: 'Bills', value: 2200000, color: '#a4de6c' },
  { name: 'Other', value: 800000, color: '#d0ed57' }
];

const topSpendingCategories = [
  { category: 'Food', amount: 2500000, icon: '🍔' },
  { category: 'Bills', amount: 2200000, icon: '📄' },
  { category: 'Transport', amount: 1500000, icon: '🚗' }
];

const AnalyticsPage = () => {
  const { t } = useLanguage();
  const { isPremium } = useAuth();
  const [timeframe, setTimeframe] = useState('month');
  
  // Calculate summary values
  const totalIncome = 9500000; // Sample data
  const totalExpense = 7100000; // Sample data
  const balance = totalIncome - totalExpense;
  
  // Format numbers 
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };
  
  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Grafik Transaksi Kamu</h1>
        <p className="text-muted-foreground mt-1">Visualize and analyze your financial data</p>
      </div>
      
      <Tabs defaultValue="month" className="mb-6">
        <TabsList>
          <TabsTrigger value="month" onClick={() => setTimeframe('month')}>This Month</TabsTrigger>
          <TabsTrigger value="quarter" onClick={() => setTimeframe('quarter')}>Last 3 Months</TabsTrigger>
          <TabsTrigger value="year" onClick={() => setTimeframe('year')}>This Year</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center text-green-700 dark:text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              Total Income
            </CardDescription>
            <CardTitle className="text-2xl text-green-700 dark:text-green-400">
              {formatCurrency(totalIncome, 'IDR')}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border-red-200">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center text-red-700 dark:text-red-400">
              <TrendingDown className="w-4 h-4 mr-1" />
              Total Expense
            </CardDescription>
            <CardTitle className="text-2xl text-red-700 dark:text-red-400">
              {formatCurrency(totalExpense, 'IDR')}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center text-blue-700 dark:text-blue-400">
              <Calendar className="w-4 h-4 mr-1" />
              Balance
            </CardDescription>
            <CardTitle className={`text-2xl ${balance >= 0 ? 'text-blue-700 dark:text-blue-400' : 'text-red-700 dark:text-red-400'}`}>
              {formatCurrency(balance, 'IDR')}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Income vs Expense Chart */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <BarChart className="w-5 h-5 mr-2" />
              Income vs Expense
            </CardTitle>
            <CardDescription>Comparison over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer 
                config={{ 
                  income: { label: 'Income', color: '#22c55e' },
                  expense: { label: 'Expense', color: '#ef4444' }  
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => {
                        if (value >= 1000000) return `${value / 1000000}M`;
                        return `${value / 1000}K`;
                      }}
                    />
                    <Tooltip 
                      content={({active, payload}) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-2 border rounded shadow-sm">
                              <p className="text-sm font-medium">{payload[0].payload.name}</p>
                              <p className="text-xs text-green-600">
                                Income: {formatCurrency(payload[0].value as number, 'IDR')}
                              </p>
                              <p className="text-xs text-red-600">
                                Expense: {formatCurrency(payload[1].value as number, 'IDR')}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="income" fill="var(--color-income)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" fill="var(--color-expense)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Expense Breakdown */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <PieChartIcon className="w-5 h-5 mr-2" />
              Expense Breakdown
            </CardTitle>
            <CardDescription>By category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={45}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => [formatCurrency(value, 'IDR'), 'Amount']} 
                  />
                  <Legend layout="vertical" verticalAlign="bottom" align="center" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Highlights Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Highlights</CardTitle>
          <CardDescription>Key insights from your financial data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Top Spending Categories */}
            <div>
              <h3 className="text-sm font-medium mb-2">Top Spending Categories</h3>
              <div className="space-y-3">
                {topSpendingCategories.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.category}</span>
                    </div>
                    <span className="font-medium">{formatCurrency(item.amount, 'IDR')}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Highest Spending Day */}
            <div>
              <h3 className="text-sm font-medium mb-2">Highest Spending Day</h3>
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm">Wednesday, 12 May</p>
                <p className="font-medium text-lg mt-1">{formatCurrency(1250000, 'IDR')}</p>
                <p className="text-xs text-muted-foreground mt-1">3 transactions</p>
              </div>
            </div>
            
            {/* Transaction Stats */}
            <div>
              <h3 className="text-sm font-medium mb-2">Transaction Stats</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-xs text-muted-foreground">Transactions</p>
                  <p className="font-medium text-lg">24</p>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-xs text-muted-foreground">Avg Per Day</p>
                  <p className="font-medium text-lg">{formatCurrency(250000, 'IDR')}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
