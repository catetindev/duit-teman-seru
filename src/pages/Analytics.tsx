
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency } from '@/utils/formatUtils';
import { AnalyticsSummary } from '@/components/analytics/AnalyticsSummary';
import { IncomeExpenseChart } from '@/components/analytics/IncomeExpenseChart';
import { ExpenseBreakdownChart } from '@/components/analytics/ExpenseBreakdownChart';
import { AnalyticsHighlights } from '@/components/analytics/AnalyticsHighlights';
import { Transaction } from '@/hooks/useDashboardData';

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
      
      {/* Summary Cards */}
      <AnalyticsSummary transactions={transactions} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Income vs Expense Chart */}
        <IncomeExpenseChart 
          transactions={transactions}
          timeframe={timeframe}
          isLoading={isLoading}
        />
        
        {/* Expense Breakdown */}
        <ExpenseBreakdownChart 
          transactions={transactions}
          isLoading={isLoading}
        />
      </div>
      
      {/* Highlights Section */}
      <AnalyticsHighlights transactions={transactions} />
    </DashboardLayout>
  );
};

export default AnalyticsPage;
