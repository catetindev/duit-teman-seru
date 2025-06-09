
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
      <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
                Grafik Transaksi Kamu
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                Visualize and analyze your financial data
              </p>
            </div>
            
            {/* Time filter tabs */}
            <Tabs value={timeframe} className="w-full sm:w-auto">
              <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:grid-cols-none">
                <TabsTrigger 
                  value="month" 
                  onClick={() => setTimeframe('month')} 
                  className="text-xs sm:text-sm px-3 py-2"
                >
                  This Month
                </TabsTrigger>
                <TabsTrigger 
                  value="quarter" 
                  onClick={() => setTimeframe('quarter')} 
                  className="text-xs sm:text-sm px-3 py-2"
                >
                  Last 3 Months
                </TabsTrigger>
                <TabsTrigger 
                  value="year" 
                  onClick={() => setTimeframe('year')} 
                  className="text-xs sm:text-sm px-3 py-2"
                >
                  This Year
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {/* Summary Cards */}
        <div className="w-full">
          <AnalyticsSummary transactions={transactions} />
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Income vs Expense Chart */}
          <div className="w-full">
            <IncomeExpenseChart 
              transactions={transactions}
              timeframe={timeframe}
              isLoading={isLoading}
            />
          </div>
          
          {/* Expense Breakdown */}
          <div className="w-full">
            <ExpenseBreakdownChart 
              transactions={transactions}
              isLoading={isLoading}
            />
          </div>
        </div>
        
        {/* Highlights Section */}
        <div className="w-full">
          <AnalyticsHighlights transactions={transactions} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
