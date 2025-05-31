
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { startOfMonth, endOfMonth } from 'date-fns';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFinancialData } from '@/hooks/finance/useFinancialData';
import { FinancialSummaryCards } from '@/components/finance/reports/FinancialSummaryCards';
import { ComparisonCards } from '@/components/finance/reports/ComparisonCards';
import { ExpenseCategoryChart } from '@/components/finance/reports/ExpenseCategoryChart';
import { TopProductsTable } from '@/components/finance/reports/TopProductsTable';
import { IncomeExpenseChart } from '@/components/finance/reports/IncomeExpenseChart';
import { toast } from '@/hooks/use-toast';
import { exportFinanceReportAsExcel, exportFinanceReportAsPdf } from '@/utils/exportUtils';
import { BusinessHealthCard } from '@/components/finance/reports/BusinessHealthCard';
import { FinanceHeader } from '@/components/finance/reports/FinanceHeader';
import { QuickAccessCards } from '@/components/finance/reports/QuickAccessCards';
import { BusinessInsights } from '@/components/finance/reports/BusinessInsights';
import { TrendingChart } from '@/components/finance/reports/TrendingChart';

const FinanceReports = () => {
  const { isPremium } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });

  const { 
    summary,
    comparison, 
    expenseCategories,
    topProducts,
    loading,
    fetchFinancialData
  } = useFinancialData();

  // Generate chart data for the income vs expenses over time
  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);

  // Generate sample chart data
  const generateChartData = () => {
    // For demo purposes - in a real app, this would come from API
    const currentMonth = new Date().getMonth();
    const data = [];
    
    for (let i = 0; i < 6; i++) {
      const month = new Date();
      month.setMonth(currentMonth - 5 + i);
      
      // Create randomized but somewhat realistic data
      const income = Math.floor(Math.random() * 10000000) + 5000000;
      const expenses = Math.floor(Math.random() * 7000000) + 3000000;
      const profit = income - expenses;
      
      data.push({
        name: format(month, 'MMM yyyy'),
        income,
        expenses,
        profit
      });
    }
    
    setTimeSeriesData(data);
  };

  // Handle date range change
  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from) {
      setDateRange(range);
    }
  };

  // Handle export actions
  const handleExportExcel = () => {
    try {
      if (!dateRange.from || !dateRange.to) {
        toast({
          title: 'Date range required',
          description: 'Please select a date range before exporting',
          variant: 'destructive'
        });
        return;
      }

      exportFinanceReportAsExcel(summary, expenseCategories, topProducts, {
        from: dateRange.from,
        to: dateRange.to || dateRange.from
      });

      toast({
        title: 'Report downloaded! 🎉',
        description: 'Your finance report has been exported as Excel',
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Export failed',
        description: 'There was a problem generating your Excel report',
        variant: 'destructive'
      });
    }
  };

  const handleExportPdf = () => {
    try {
      if (!dateRange.from || !dateRange.to) {
        toast({
          title: 'Date range required',
          description: 'Please select a date range before exporting',
          variant: 'destructive'
        });
        return;
      }

      exportFinanceReportAsPdf(summary, expenseCategories, topProducts, {
        from: dateRange.from,
        to: dateRange.to || dateRange.from
      });

      toast({
        title: 'Report downloaded! 🎉',
        description: 'Your finance report has been exported as PDF',
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: 'Export failed',
        description: 'There was a problem generating your PDF report',
        variant: 'destructive'
      });
    }
  };

  // Load financial data when date range changes
  useEffect(() => {
    if (dateRange.from) {
      fetchFinancialData({
        from: dateRange.from,
        to: dateRange.to || dateRange.from
      });
    }
    
    generateChartData();
  }, [dateRange]);

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="min-h-screen w-full overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 space-y-3 sm:space-y-4 lg:space-y-6 pb-20 sm:pb-6">
          {/* Header */}
          <FinanceHeader
            title="Laporan Keuangan"
            subtitle="Comprehensive financial insights and reports for your business"
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            onExportExcel={handleExportExcel}
            onExportPdf={handleExportPdf}
          />

          {/* Business Health Card */}
          <BusinessHealthCard comparison={comparison} />

          {/* Summary */}
          {comparison ? (
            <ComparisonCards data={comparison} />
          ) : (
            <FinancialSummaryCards data={summary} loading={loading} />
          )}

          {/* Tabs - Mobile Optimized */}
          <Tabs defaultValue="overview" className="w-full space-y-3 sm:space-y-4">
            <div className="w-full overflow-x-auto">
              <TabsList className="inline-flex min-w-max">
                <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
                <TabsTrigger value="trends" className="text-xs sm:text-sm">Trends</TabsTrigger>
                <TabsTrigger value="insights" className="text-xs sm:text-sm">Insights</TabsTrigger>
              </TabsList>
            </div>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="w-full space-y-3 sm:space-y-4">
              <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-3">
                {/* Income & Expenses Chart */}
                <Card className="lg:col-span-2">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg">Income vs Expenses</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <div className="w-full overflow-x-auto">
                      <IncomeExpenseChart 
                        data={[
                          {
                            name: format(dateRange.from || new Date(), 'MMM yyyy'),
                            income: summary.totalIncome,
                            expenses: summary.totalExpenses,
                            profit: summary.netProfit
                          }
                        ]}
                        height={300}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Expense Categories */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg">Expense Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <ExpenseCategoryChart data={expenseCategories} />
                  </CardContent>
                </Card>
              </div>
              
              {/* Quick Access Cards */}
              <QuickAccessCards />
            </TabsContent>
            
            {/* Trends Tab */}
            <TabsContent value="trends" className="w-full space-y-3 sm:space-y-4">
              <div className="w-full overflow-x-auto">
                <TrendingChart data={timeSeriesData} />
              </div>
            </TabsContent>
            
            {/* Insights Tab */}
            <TabsContent value="insights" className="w-full space-y-3 sm:space-y-4">
              <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
                {/* Top Products */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base sm:text-lg">Top Selling Products</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Your best performing products by revenue
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-3 sm:p-6">
                    <div className="w-full overflow-x-auto">
                      <TopProductsTable products={topProducts} />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Business Tips */}
                <BusinessInsights 
                  expenseCategories={expenseCategories}
                  topProducts={topProducts}
                  summary={summary}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FinanceReports;
