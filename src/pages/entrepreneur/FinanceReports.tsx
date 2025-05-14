
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { startOfMonth, endOfMonth } from 'date-fns';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      <div className="space-y-6">
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

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {/* Income & Expenses Chart */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Income vs Expenses</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>

              {/* Expense Categories */}
              <Card>
                <CardHeader>
                  <CardTitle>Expense Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ExpenseCategoryChart data={expenseCategories} />
                </CardContent>
              </Card>
            </div>
            
            {/* Quick Access Cards */}
            <QuickAccessCards />
          </TabsContent>
          
          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-4">
            <TrendingChart data={timeSeriesData} />
          </TabsContent>
          
          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Top Products */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Selling Products</CardTitle>
                  <CardDescription>
                    Your best performing products by revenue
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TopProductsTable products={topProducts} />
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
    </DashboardLayout>
  );
};

export default FinanceReports;
