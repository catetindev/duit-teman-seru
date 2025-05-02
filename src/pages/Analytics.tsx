
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatCurrency } from '@/hooks/useDashboardData';
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

const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658', '#ff8042', '#ff5252'];

interface Transaction {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
}

interface MonthlyData {
  name: string;
  income: number;
  expense: number;
}

interface CategoryExpense {
  name: string;
  value: number;
  color: string;
}

interface TopSpendingCategory {
  category: string;
  amount: number;
  icon: string;
}

const categoryIcons: Record<string, string> = {
  'food': '🍔',
  'transport': '🚗',
  'entertainment': '🎬',
  'shopping': '🛍️',
  'bills': '📄',
  'housing': '🏠',
  'health': '🏥',
  'education': '🎓',
  'travel': '✈️',
  'other': '📦'
};

const AnalyticsPage = () => {
  const { t } = useLanguage();
  const { isPremium, user } = useAuth();
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'year'>('month');
  
  const getStartDate = () => {
    const now = new Date();
    if (timeframe === 'month') {
      return new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (timeframe === 'quarter') {
      return new Date(now.getFullYear(), now.getMonth() - 2, 1);
    } else {
      return new Date(now.getFullYear(), 0, 1);
    }
  };
  
  // Query to fetch transactions
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['analytics-transactions', timeframe, user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const startDate = getStartDate();
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .gte('date', startDate.toISOString().split('T')[0]);
        
      if (error) throw error;
      
      return data as Transaction[];
    },
    enabled: !!user?.id
  });
  
  // Monthly data for bar chart
  const monthlyData = React.useMemo(() => {
    if (!transactions.length) return [];
    
    const data: Record<string, MonthlyData> = {};
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = timeframe === 'month' 
        ? `${date.getDate()}/${monthNames[date.getMonth()]}`
        : monthNames[date.getMonth()];
      
      if (!data[monthYear]) {
        data[monthYear] = { name: monthYear, income: 0, expense: 0 };
      }
      
      if (transaction.type === 'income') {
        data[monthYear].income += Number(transaction.amount);
      } else {
        data[monthYear].expense += Number(transaction.amount);
      }
    });
    
    return Object.values(data);
  }, [transactions, timeframe]);
  
  // Expense breakdown for pie chart
  const pieData = React.useMemo(() => {
    if (!transactions.length) return [];
    
    const expensesByCategory: Record<string, number> = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const category = transaction.category;
        if (!expensesByCategory[category]) {
          expensesByCategory[category] = 0;
        }
        expensesByCategory[category] += Number(transaction.amount);
      });
    
    return Object.entries(expensesByCategory).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length]
    }));
  }, [transactions]);
  
  // Top spending categories
  const topSpendingCategories = React.useMemo(() => {
    if (!transactions.length) return [];
    
    const expensesByCategory: Record<string, number> = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const category = transaction.category;
        if (!expensesByCategory[category]) {
          expensesByCategory[category] = 0;
        }
        expensesByCategory[category] += Number(transaction.amount);
      });
    
    return Object.entries(expensesByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, amount]) => ({
        category,
        amount,
        icon: categoryIcons[category.toLowerCase()] || '📊'
      }));
  }, [transactions]);
  
  // Day with highest spending
  const highestSpendingDay = React.useMemo(() => {
    if (!transactions.length) return null;
    
    const expensesByDay: Record<string, { total: number, count: number, date: Date }> = {};
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(transaction => {
        const day = transaction.date;
        if (!expensesByDay[day]) {
          expensesByDay[day] = { total: 0, count: 0, date: new Date(day) };
        }
        expensesByDay[day].total += Number(transaction.amount);
        expensesByDay[day].count++;
      });
    
    const highestDay = Object.values(expensesByDay)
      .sort((a, b) => b.total - a.total)[0];
    
    if (!highestDay) return null;
    
    return {
      date: highestDay.date,
      amount: highestDay.total,
      count: highestDay.count
    };
  }, [transactions]);
  
  // Calculate summary values
  const totalIncome = React.useMemo(() => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }, [transactions]);
  
  const totalExpense = React.useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }, [transactions]);
  
  const balance = totalIncome - totalExpense;
  
  // Average expense per day
  const averageDailyExpense = React.useMemo(() => {
    if (!transactions.length) return 0;
    
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    if (!expenseTransactions.length) return 0;
    
    const days = new Set(expenseTransactions.map(t => t.date)).size;
    return days > 0 ? totalExpense / days : 0;
  }, [transactions, totalExpense]);
  
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
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : monthlyData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center">
                <p>No transaction data available for this period</p>
              </div>
            ) : (
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
            )}
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
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : pieData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center">
                <p>No expense data available for this period</p>
              </div>
            ) : (
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
            )}
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
              {topSpendingCategories.length > 0 ? (
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
              ) : (
                <div className="p-3 bg-muted rounded-md text-center">
                  <p>No data available</p>
                </div>
              )}
            </div>
            
            {/* Highest Spending Day */}
            <div>
              <h3 className="text-sm font-medium mb-2">Highest Spending Day</h3>
              {highestSpendingDay ? (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm">
                    {highestSpendingDay.date.toLocaleDateString('en-US', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'short'
                    })}
                  </p>
                  <p className="font-medium text-lg mt-1">
                    {formatCurrency(highestSpendingDay.amount, 'IDR')}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {highestSpendingDay.count} transactions
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-muted rounded-md text-center">
                  <p>No data available</p>
                </div>
              )}
            </div>
            
            {/* Transaction Stats */}
            <div>
              <h3 className="text-sm font-medium mb-2">Transaction Stats</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-xs text-muted-foreground">Transactions</p>
                  <p className="font-medium text-lg">{transactions.length}</p>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-xs text-muted-foreground">Avg Per Day</p>
                  <p className="font-medium text-lg">
                    {formatCurrency(averageDailyExpense, 'IDR')}
                  </p>
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
