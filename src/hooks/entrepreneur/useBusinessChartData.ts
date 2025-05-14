
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

export function useBusinessChartData(months = 6) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [chartData, setChartData] = useState<MonthlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState<string>('6months');

  const fetchChartData = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const today = new Date();
      const monthsData: MonthlyData[] = [];
      
      // Fetch data for each month
      for (let i = 0; i < months; i++) {
        const currentMonth = subMonths(today, i);
        const startDate = startOfMonth(currentMonth);
        const endDate = endOfMonth(currentMonth);
        const monthLabel = format(currentMonth, 'MMM yyyy');
        
        // Fetch income for this month
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('total')
          .eq('user_id', user.id)
          .eq('status', 'Paid')
          .gte('order_date', startDate.toISOString())
          .lte('order_date', endDate.toISOString());

        if (ordersError) throw ordersError;

        // Fetch expenses for this month
        const { data: expensesData, error: expensesError } = await supabase
          .from('business_expenses')
          .select('amount')
          .eq('user_id', user.id)
          .gte('date', startDate.toISOString())
          .lte('date', endDate.toISOString());

        if (expensesError) throw expensesError;

        // Calculate totals for this month
        const monthIncome = ordersData.reduce((sum, order) => sum + Number(order.total), 0);
        const monthExpenses = expensesData.reduce((sum, expense) => sum + Number(expense.amount), 0);

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
  }, [user, months, toast]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData, timeframe]);

  return {
    chartData,
    loading,
    timeframe,
    setTimeframe,
    refetch: fetchChartData
  };
}
