import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

export function useBusinessChartData() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [chartData, setChartData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<string>('6months');

  const getMonthsCount = (timeframe: string) => {
    switch (timeframe) {
      case '3months':
        return 3;
      case '6months':
        return 6;
      case 'year':
        return 12;
      default:
        return 6;
    }
  };

  const fetchChartData = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const today = new Date();
      const monthsData: MonthlyData[] = [];
      const monthsToFetch = getMonthsCount(timeframe);
      
      // Fetch data for each month
      for (let i = 0; i < monthsToFetch; i++) {
        const currentMonth = subMonths(today, i);
        const startDate = startOfMonth(currentMonth);
        const endDate = endOfMonth(currentMonth);
        const monthLabel = format(currentMonth, 'MMM yyyy');
        
        // Fetch all data in parallel for better performance
        const [
          ordersResult,
          transactionIncomeResult,
          businessExpensesResult,
          transactionExpensesResult
        ] = await Promise.all([
          // Fetch income from orders
          supabase
            .from('orders')
            .select('total')
            .eq('user_id', user.id)
            .eq('status', 'Paid')
            .gte('order_date', startDate.toISOString())
            .lte('order_date', endDate.toISOString()),
          
          // Fetch income from business transactions
          supabase
            .from('transactions')
            .select('amount')
            .eq('user_id', user.id)
            .eq('is_business', true)
            .eq('type', 'income')
            .gte('date', startDate.toISOString())
            .lte('date', endDate.toISOString()),
          
          // Fetch expenses from business_expenses
          supabase
            .from('business_expenses')
            .select('amount')
            .eq('user_id', user.id)
            .gte('date', startDate.toISOString())
            .lte('date', endDate.toISOString()),
          
          // Fetch expenses from business transactions
          supabase
            .from('transactions')
            .select('amount')
            .eq('user_id', user.id)
            .eq('is_business', true)
            .eq('type', 'expense')
            .gte('date', startDate.toISOString())
            .lte('date', endDate.toISOString())
        ]);

        // Check for errors
        if (ordersResult.error) throw ordersResult.error;
        if (transactionIncomeResult.error) throw transactionIncomeResult.error;
        if (businessExpensesResult.error) throw businessExpensesResult.error;
        if (transactionExpensesResult.error) throw transactionExpensesResult.error;

        // Calculate total income (orders + transaction income)
        const monthIncome = (ordersResult.data || []).reduce((sum, order) => sum + Number(order.total), 0) +
                          (transactionIncomeResult.data || []).reduce((sum, tx) => sum + Number(tx.amount), 0);
        
        // Calculate total expenses (business expenses + transaction expenses)
        const monthExpenses = (businessExpensesResult.data || []).reduce((sum, expense) => sum + Number(expense.amount), 0) +
                            (transactionExpensesResult.data || []).reduce((sum, tx) => sum + Number(tx.amount), 0);

        // Add data point for this month
        monthsData.unshift({
          month: monthLabel,
          income: monthIncome,
          expense: monthExpenses
        });
      }
      
      setChartData(monthsData);
    } catch (error: any) {
      console.error('Error fetching chart data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch chart data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, timeframe, toast]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  return {
    chartData,
    loading,
    timeframe,
    setTimeframe,
    refetch: fetchChartData
  };
}
