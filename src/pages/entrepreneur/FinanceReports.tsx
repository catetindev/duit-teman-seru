
import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFinancialData } from '@/hooks/finance/useFinancialData';
import { FinancialSummaryCards } from '@/components/finance/reports/FinancialSummaryCards';
import { ComparisonCards } from '@/components/finance/reports/ComparisonCards';
import { ExpenseCategoryChart } from '@/components/finance/reports/ExpenseCategoryChart';
import { TopProductsTable } from '@/components/finance/reports/TopProductsTable';
import { IncomeExpenseChart } from '@/components/finance/reports/IncomeExpenseChart';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';
import { ArrowDownToLine, ArrowUpRight, Download, File, FileSpreadsheet, FilePdf, FileText, LineChart, Wallet } from 'lucide-react';
import { formatCurrency } from '@/utils/formatUtils';
import { exportFinanceReportAsExcel, exportFinanceReportAsPdf } from '@/utils/exportUtils';
import { Link } from 'react-router-dom';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

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

  // Generate sample chart data (in a real app, this would come from the API)
  const generateChartData = () => {
    // This would normally be generated from real data
    // For now we'll create dummy data to illustrate the concept
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

  // Generate business health indicator
  const getBusinessHealthStatus = () => {
    if (!comparison) return { text: 'Calculating...', color: 'text-gray-500' };
    
    if (comparison.profitChange >= 10) {
      return {
        emoji: '🔥',
        text: 'On Fire!',
        subtext: 'Your business is thriving with outstanding growth.',
        color: 'text-emerald-500'
      };
    } else if (comparison.profitChange > 0) {
      return {
        emoji: '📈',
        text: 'Growing',
        subtext: 'Your business is showing positive trends.',
        color: 'text-blue-500'
      };
    } else if (comparison.profitChange > -10) {
      return {
        emoji: '⚠️',
        text: 'Needs Attention',
        subtext: 'Your profits are declining slightly.',
        color: 'text-amber-500'
      };
    } else {
      return {
        emoji: '🚨',
        text: 'Action Required',
        subtext: 'Your business is facing significant challenges.',
        color: 'text-red-500'
      };
    }
  };

  const healthStatus = getBusinessHealthStatus();

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Laporan Keuangan</h1>
            <p className="text-muted-foreground">
              Comprehensive financial insights and reports for your business
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <DatePickerWithRange 
              date={dateRange} 
              onDateChange={handleDateRangeChange} 
            />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <Download className="h-4 w-4 mr-1" /> Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleExportExcel} className="cursor-pointer">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  <span>Export as Excel</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportPdf} className="cursor-pointer">
                  <FilePdf className="mr-2 h-4 w-4" />
                  <span>Export as PDF</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Business Health Card */}
        <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <span className="text-3xl">{healthStatus.emoji}</span>
                  <span>Business Health:</span>
                  <span className={healthStatus.color}>{healthStatus.text}</span>
                </h2>
                <p className="text-muted-foreground mt-1">{healthStatus.subtext}</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center">
                <span className="text-sm text-muted-foreground">
                  Based on your last month's performance
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Link to="/profit-loss">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <LineChart className="h-5 w-5 text-primary mb-1" />
                    <CardTitle>Laporan Untung Rugi</CardTitle>
                    <CardDescription>
                      Detailed income and expense analysis
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="ghost" className="w-full justify-start">
                      <ArrowUpRight className="mr-2 h-4 w-4" /> View Report
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
              
              <Link to="/invoices">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <FileText className="h-5 w-5 text-primary mb-1" />
                    <CardTitle>Invoice Manager</CardTitle>
                    <CardDescription>
                      Create and manage customer invoices
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="ghost" className="w-full justify-start">
                      <ArrowUpRight className="mr-2 h-4 w-4" /> Manage Invoices
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
              
              <Link to="/calculator">
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <Wallet className="h-5 w-5 text-primary mb-1" />
                    <CardTitle>HPP Calculator</CardTitle>
                    <CardDescription>
                      Calculate product costs and pricing
                    </CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="ghost" className="w-full justify-start">
                      <ArrowUpRight className="mr-2 h-4 w-4" /> Open Calculator
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            </div>
          </TabsContent>
          
          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Performance Trends</CardTitle>
                <CardDescription>
                  See how your business has performed over the last 6 months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <IncomeExpenseChart 
                  data={timeSeriesData} 
                  title="6-Month Financial Trend"
                  height={400}
                />
              </CardContent>
            </Card>
            
            {/* Additional trend analysis could go here */}
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
              <Card>
                <CardHeader>
                  <CardTitle>Business Insights</CardTitle>
                  <CardDescription>
                    Personalized recommendations for your business
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* This would typically be generated based on the actual business data */}
                    <div className="p-4 border rounded-lg bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900">
                      <h3 className="font-medium flex items-center gap-2">
                        <ArrowDownToLine className="h-4 w-4" />
                        Expense Optimization
                      </h3>
                      <p className="text-sm mt-1">
                        Your "{expenseCategories[0]?.category || 'Marketing'}" expenses are higher than average. 
                        Consider reviewing your spending in this category to improve profitability.
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900">
                      <h3 className="font-medium flex items-center gap-2">
                        <LineChart className="h-4 w-4" />
                        Growth Opportunity
                      </h3>
                      <p className="text-sm mt-1">
                        Your top product "{topProducts[0]?.name || 'Product A'}" contributes 
                        significantly to your revenue. Consider expanding this product line.
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
                      <h3 className="font-medium flex items-center gap-2">
                        <File className="h-4 w-4" />
                        Tax Planning
                      </h3>
                      <p className="text-sm mt-1">
                        Based on your current income of {formatCurrency(summary.totalIncome)}, 
                        consider scheduling a tax planning session before the quarter ends.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default FinanceReports;
