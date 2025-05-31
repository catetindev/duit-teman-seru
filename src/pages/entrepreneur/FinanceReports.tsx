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
import { useIsMobile } from '@/hooks/use-mobile';

const FinanceReports = () => {
  const { isPremium } = useAuth();
  const isMobile = useIsMobile();
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

  const [timeSeriesData, setTimeSeriesData] = useState<any[]>([]);

  const generateChartData = () => {
    const currentMonth = new Date().getMonth();
    const data = [];
    
    for (let i = 0; i < 6; i++) {
      const month = new Date();
      month.setMonth(currentMonth - 5 + i);
      
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

  const handleDateRangeChange = (range: DateRange | undefined) => {
    if (range?.from) {
      setDateRange(range);
    }
  };

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
        <div className="w-full max-w-7xl mx-auto px-2 sm:px-3 lg:px-6 py-2 sm:py-3 lg:py-6 space-y-2 sm:space-y-3 lg:space-y-6 pb-20 sm:pb-6">
          {/* Header - Fully Responsive */}
          <div className="w-full">
            <FinanceHeader
              title="Laporan Keuangan"
              subtitle="Comprehensive financial insights and reports for your business"
              dateRange={dateRange}
              onDateRangeChange={handleDateRangeChange}
              onExportExcel={handleExportExcel}
              onExportPdf={handleExportPdf}
            />
          </div>

          {/* Business Health Card - Mobile Optimized */}
          <div className="w-full overflow-hidden">
            <BusinessHealthCard comparison={comparison} />
          </div>

          {/* Summary - Responsive */}
          <div className="w-full">
            {comparison ? (
              <ComparisonCards data={comparison} />
            ) : (
              <FinancialSummaryCards data={summary} loading={loading} />
            )}
          </div>

          {/* Tabs - Mobile Optimized */}
          <Tabs defaultValue="overview" className="w-full space-y-2 sm:space-y-3 lg:space-y-4">
            <div className="w-full overflow-x-auto">
              <TabsList className="inline-flex min-w-max h-8 sm:h-9 md:h-10">
                <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 sm:px-3">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="trends" className="text-xs sm:text-sm px-2 sm:px-3">
                  Trends
                </TabsTrigger>
                <TabsTrigger value="insights" className="text-xs sm:text-sm px-2 sm:px-3">
                  Insights
                </TabsTrigger>
              </TabsList>
            </div>
            
            {/* Overview Tab - Mobile First */}
            <TabsContent value="overview" className="w-full space-y-2 sm:space-y-3 lg:space-y-4">
              <div className="grid gap-2 sm:gap-3 lg:gap-4 grid-cols-1 lg:grid-cols-3">
                {/* Income & Expenses Chart */}
                <Card className="lg:col-span-2 overflow-hidden">
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-sm sm:text-base lg:text-lg">Income vs Expenses</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-3 lg:p-6">
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
                        height={isMobile ? 250 : 300}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Expense Categories */}
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-sm sm:text-base lg:text-lg">Expense Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-3 lg:p-6">
                    <ExpenseCategoryChart data={expenseCategories} />
                  </CardContent>
                </Card>
              </div>
              
              {/* Quick Access Cards */}
              <div className="w-full overflow-hidden">
                <QuickAccessCards />
              </div>
            </TabsContent>
            
            {/* Trends Tab - Mobile Optimized */}
            <TabsContent value="trends" className="w-full space-y-2 sm:space-y-3 lg:space-y-4">
              <div className="w-full overflow-hidden">
                <TrendingChart data={timeSeriesData} />
              </div>
            </TabsContent>
            
            {/* Insights Tab - Mobile Optimized */}
            <TabsContent value="insights" className="w-full space-y-2 sm:space-y-3 lg:space-y-4">
              <div className="grid gap-2 sm:gap-3 lg:gap-4 grid-cols-1 md:grid-cols-2">
                {/* Top Products */}
                <Card className="overflow-hidden">
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="text-sm sm:text-base lg:text-lg">Top Selling Products</CardTitle>
                    <CardDescription className="text-xs sm:text-sm">
                      Your best performing products by revenue
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-3 lg:p-6">
                    <div className="w-full overflow-x-auto">
                      <TopProductsTable products={topProducts} />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Business Tips */}
                <div className="w-full overflow-hidden">
                  <BusinessInsights 
                    expenseCategories={expenseCategories}
                    topProducts={topProducts}
                    summary={summary}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FinanceReports;
