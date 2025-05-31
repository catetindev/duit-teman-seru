
import { useState, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { startOfMonth, endOfMonth } from 'date-fns';
import { BusinessExpense } from '@/types/finance';
import { useBusinessExpenses } from '@/hooks/finance/useBusinessExpenses';
import { useFinancialData } from '@/hooks/finance/useFinancialData';
import { toast } from '@/hooks/use-toast';
import { exportProfitLossAsExcel, exportProfitLossAsPdf } from '@/utils/exportUtils';

export function useProfitLossLogic() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<BusinessExpense | undefined>(undefined);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date())
  });
  const [chartData, setChartData] = useState<any[]>([]);

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
  const prepareChartData = async () => {
    if (!dateRange.from || !dateRange.to) return;

    try {
      await fetchFinancialData({
        from: dateRange.from,
        to: dateRange.to || dateRange.from
      });

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

  // Handle expense operations
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

  const handleEditExpense = (expense: BusinessExpense) => {
    setSelectedExpense(expense);
    setIsExpenseDialogOpen(true);
  };

  const handleDeleteExpense = async (id: string) => {
    await deleteExpense(id);
    
    // Refresh data
    if (dateRange.from && dateRange.to) {
      prepareChartData();
    }
  };

  const handleAddExpense = () => {
    setSelectedExpense(undefined);
    setIsExpenseDialogOpen(true);
  };

  // Initialize data loading
  useEffect(() => {
    if (dateRange.from && dateRange.to) {
      fetchExpenses({ from: dateRange.from, to: dateRange.to });
      prepareChartData();
    }
  }, [dateRange]);

  return {
    // State
    selectedTab,
    setSelectedTab,
    isExpenseDialogOpen,
    setIsExpenseDialogOpen,
    selectedExpense,
    setSelectedExpense,
    dateRange,
    chartData,
    
    // Data
    expenses,
    categories,
    summary,
    expenseCategories,
    expensesLoading,
    financialDataLoading,
    
    // Handlers
    handleDateRangeChange,
    handleExportExcel,
    handleExportPdf,
    handleExpenseSubmit,
    handleEditExpense,
    handleDeleteExpense,
    handleAddExpense
  };
}
