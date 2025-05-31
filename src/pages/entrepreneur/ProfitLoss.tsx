
import React, { useEffect, useState } from 'react';
import { DateRange } from 'react-day-picker';
import { startOfMonth, endOfMonth } from 'date-fns';
import { Plus } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FinancialSummaryCards } from '@/components/finance/reports/FinancialSummaryCards';
import { IncomeExpenseChart } from '@/components/finance/reports/IncomeExpenseChart';
import { ExpensesTable } from '@/components/finance/expenses/ExpensesTable';
import { ExpenseDialog } from '@/components/finance/expenses/ExpenseDialog';
import { ExpenseCategoryChart } from '@/components/finance/reports/ExpenseCategoryChart';
import { BusinessExpense } from '@/types/finance';
import { useBusinessExpenses } from '@/hooks/finance/useBusinessExpenses';
import { useFinancialData } from '@/hooks/finance/useFinancialData';
import { toast } from '@/hooks/use-toast';
import { exportProfitLossAsExcel, exportProfitLossAsPdf } from '@/utils/exportUtils';
import { FinanceHeader } from '@/components/finance/reports/FinanceHeader';
import { DateRangeOptions } from '@/components/finance/reports/DateRangeOptions';
import { RecentExpenses } from '@/components/finance/expenses/RecentExpenses';
import { IncomeOverview } from '@/components/finance/reports/IncomeOverview';

const ProfitLoss = () => {
  const { isPremium } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<BusinessExpense | undefined>(undefined);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });

  // Hooks for data fetching
  const { 
    expenses, 
    categories,
    loading: expensesLoading,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense
  } = useBusinessExpenses();

  const {
    summary,
    expenseCategories,
    loading: financialDataLoading,
    fetchFinancialData
  } = useFinancialData();

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

      exportProfitLossAsExcel(summary, expenseCategories, expenses, {
        from: dateRange.from,
        to: dateRange.to || dateRange.from
      });

      toast({
        title: 'Report downloaded! 🎉',
        description: 'Your profit & loss report has been exported as Excel',
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

      exportProfitLossAsPdf(summary, expenseCategories, expenses, {
        from: dateRange.from,
        to: dateRange.to || dateRange.from
      });

      toast({
        title: 'Report downloaded! 🎉',
        description: 'Your profit & loss report has been exported as PDF',
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

  // Prepare chart data
  const [chartData, setChartData] = useState<any[]>([]);

  // Function to prepare chart data from expenses and income
  const prepareChartData = async () => {
    if (!dateRange.from || !dateRange.to) return;

    try {
      // Get data for the selected range
      await fetchFinancialData({
        from: dateRange.from,
        to: dateRange.to || dateRange.from
      });

      // Prepare data for chart based on the range
      const data = [
        {
          name: dateRange.from.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          income: summary.totalIncome,
          expenses: summary.totalExpenses,
          profit: summary.netProfit
        }
      ];
      setChartData(data);
    } catch (error) {
      console.error("Error preparing chart data:", error);
    }
  };

  // Handle adding or updating an expense
  const handleExpenseSubmit = async (data: Omit<BusinessExpense, 'id' | 'user_id' | 'created_at'>) => {
    if (selectedExpense) {
      await updateExpense({ ...selectedExpense, ...data });
    } else {
      await addExpense(data);
    }
    setIsExpenseDialogOpen(false);
    setSelectedExpense(undefined);
    
    // Refresh data
    if (dateRange.from && dateRange.to) {
      fetchExpenses({ from: dateRange.from, to: dateRange.to });
      prepareChartData();
    }
  };

  // Handle expense edit
  const handleEditExpense = (expense: BusinessExpense) => {
    setSelectedExpense(expense);
    setIsExpenseDialogOpen(true);
  };

  // Handle expense delete
  const handleDeleteExpense = async (id: string) => {
    await deleteExpense(id);
    
    // Refresh data
    if (dateRange.from && dateRange.to) {
      prepareChartData();
    }
  };

  // Initialize data loading
  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      fetchExpenses({ from: dateRange.from, to: dateRange.to });
      prepareChartData();
    }
  }, [dateRange]);

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="min-h-screen w-full overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6 space-y-3 sm:space-y-4 lg:space-y-6 pb-20 sm:pb-6">
          {/* Header */}
          <FinanceHeader
            title="Laporan Untung Rugi"
            subtitle="Track your income, expenses, and profitability over time"
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            onExportExcel={handleExportExcel}
            onExportPdf={handleExportPdf}
          />

          <DateRangeOptions onSelect={handleDateRangeChange} />

          {/* Summary Cards */}
          <FinancialSummaryCards 
            data={summary}
            loading={financialDataLoading} 
          />

          {/* Tabs - Mobile Optimized */}
          <Tabs 
            defaultValue="overview" 
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full space-y-3 sm:space-y-4"
          >
            <div className="w-full overflow-x-auto">
              <TabsList className="inline-flex min-w-max grid-cols-3 md:w-[400px]">
                <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
                <TabsTrigger value="income" className="text-xs sm:text-sm">Income</TabsTrigger>
                <TabsTrigger value="expenses" className="text-xs sm:text-sm">Expenses</TabsTrigger>
              </TabsList>
            </div>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="w-full space-y-3 sm:space-y-4">
              {/* Chart */}
              <div className="w-full overflow-x-auto">
                <IncomeExpenseChart data={chartData} />
              </div>
              
              {/* Stats Grid */}
              <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
                {/* Expenses by Category */}
                <ExpenseCategoryChart data={expenseCategories} />
                
                {/* Recent Expenses */}
                <RecentExpenses 
                  expenses={expenses} 
                  onViewAll={() => setSelectedTab('expenses')} 
                />
              </div>
            </TabsContent>
            
            {/* Income Tab */}
            <TabsContent value="income" className="w-full space-y-3 sm:space-y-4">
              {/* Income Overview */}
              <IncomeOverview summary={summary} />
            </TabsContent>
            
            {/* Expenses Tab */}
            <TabsContent value="expenses" className="w-full space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <h3 className="text-base sm:text-lg font-medium">Expenses</h3>
                <Button 
                  onClick={() => {
                    setSelectedExpense(undefined);
                    setIsExpenseDialogOpen(true);
                  }}
                  className="w-full sm:w-auto"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Add Expense
                </Button>
              </div>
              
              <div className="w-full overflow-x-auto">
                <ExpensesTable 
                  expenses={expenses}
                  onEdit={handleEditExpense}
                  onDelete={handleDeleteExpense}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Expense Dialog */}
          <ExpenseDialog
            open={isExpenseDialogOpen}
            onClose={() => {
              setIsExpenseDialogOpen(false);
              setSelectedExpense(undefined);
            }}
            expense={selectedExpense}
            categories={categories}
            onSubmit={handleExpenseSubmit}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfitLoss;
