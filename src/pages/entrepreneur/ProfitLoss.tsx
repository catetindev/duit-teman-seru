import React, { useEffect, useState } from 'react';
import { format, subDays, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { Download, FileText, Plus, FileSpreadsheet } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FinancialSummaryCards } from '@/components/finance/reports/FinancialSummaryCards';
import { IncomeExpenseChart } from '@/components/finance/reports/IncomeExpenseChart';
import { ExpensesTable } from '@/components/finance/expenses/ExpensesTable';
import { ExpenseDialog } from '@/components/finance/expenses/ExpenseDialog';
import { ExpenseCategoryChart } from '@/components/finance/reports/ExpenseCategoryChart';
import { BusinessExpense } from '@/types/finance';
import { useBusinessExpenses } from '@/hooks/finance/useBusinessExpenses';
import { useFinancialData } from '@/hooks/finance/useFinancialData';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { exportProfitLossAsExcel, exportProfitLossAsPdf } from '@/utils/exportUtils';
import { toast } from '@/hooks/use-toast';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

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
      // This is a simplified example - in a real app, you'd aggregate by day/week/month
      const data = [
        {
          name: format(dateRange.from, 'MMM yyyy'),
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

  // List of quick date range options
  const dateRangeOptions = [
    { label: 'Last 7 days', range: { from: subDays(new Date(), 7), to: new Date() } },
    { label: 'Last 30 days', range: { from: subDays(new Date(), 30), to: new Date() } },
    { label: 'This Month', range: { from: startOfMonth(new Date()), to: new Date() } },
    { label: 'Last Month', range: { 
      from: startOfMonth(new Date(new Date().getFullYear(), new Date().getMonth() - 1)), 
      to: endOfMonth(new Date(new Date().getFullYear(), new Date().getMonth() - 1)) 
    }}
  ];

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Laporan Untung Rugi</h1>
            <p className="text-muted-foreground">
              Track your income, expenses, and profitability over time
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
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
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Export as PDF</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Summary Cards */}
        <FinancialSummaryCards 
          data={summary}
          loading={financialDataLoading} 
        />

        {/* Tabs */}
        <Tabs 
          defaultValue="overview" 
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-3 md:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Chart */}
            <IncomeExpenseChart data={chartData} />
            
            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Expenses by Category */}
              <ExpenseCategoryChart data={expenseCategories} />
              
              {/* Recent Expenses */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-md font-medium">
                    Recent Expenses
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 gap-1"
                    onClick={() => setSelectedTab('expenses')}
                  >
                    View All <FileText className="h-4 w-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {expenses.slice(0, 5).map((expense) => (
                      <div 
                        key={expense.id} 
                        className="flex items-center justify-between border-b pb-2"
                      >
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 text-primary p-1 rounded-full">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{expense.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(parseISO(expense.date), 'dd MMM yyyy')}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-medium">
                          -{Intl.NumberFormat('id-ID', { 
                            style: 'currency', 
                            currency: 'IDR',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          }).format(Number(expense.amount))}
                        </p>
                      </div>
                    ))}
                    
                    {expenses.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">
                        No recent expenses
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Income Tab */}
          <TabsContent value="income" className="space-y-4">
            {/* Income Charts */}
            <Card>
              <CardHeader>
                <CardTitle>Income Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  This section shows your income from all paid orders and invoices.
                </p>
                
                {/* We can implement more detailed income analysis here */}
                <div className="flex flex-col items-center justify-center py-8">
                  <p className="text-2xl font-bold mb-2">
                    {Intl.NumberFormat('id-ID', { 
                      style: 'currency', 
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(summary.totalIncome)}
                  </p>
                  <p className="text-muted-foreground">
                    Total income for the selected period
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Expenses Tab */}
          <TabsContent value="expenses" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Expenses</h3>
              <Button 
                onClick={() => {
                  setSelectedExpense(undefined);
                  setIsExpenseDialogOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </div>
            
            <ExpensesTable 
              expenses={expenses}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
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
    </DashboardLayout>
  );
};

export default ProfitLoss;
