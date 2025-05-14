
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { FinanceSummary } from '@/types/finance';
import { useToast } from '@/hooks/use-toast';

// Function to fetch financial summary data
export function useFinancialSummary() {
  const [summary, setSummary] = useState<FinanceSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch summary data for a specific period
  const fetchPeriodData = async (range: { from: Date, to: Date }): Promise<FinanceSummary> => {
    try {
      if (!user) return { totalIncome: 0, totalExpenses: 0, netProfit: 0, profitMargin: 0 };
      
      // Fetch income data
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('total')
        .eq('user_id', user.id)
        .eq('status', 'Paid')
        .gte('created_at', range.from.toISOString())
        .lte('created_at', range.to.toISOString());

      if (ordersError) throw ordersError;

      // Fetch expenses
      const { data: expensesData, error: expensesError } = await supabase
        .from('business_expenses')
        .select('amount')
        .eq('user_id', user.id)
        .gte('date', range.from.toISOString())
        .lte('date', range.to.toISOString());

      if (expensesError) throw expensesError;

      // Calculate summary
      const totalIncome = ordersData.reduce((sum, order) => sum + Number(order.total), 0);
      const totalExpenses = expensesData.reduce((sum, expense) => sum + Number(expense.amount), 0);
      const netProfit = totalIncome - totalExpenses;
      const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

      return { totalIncome, totalExpenses, netProfit, profitMargin };
    } catch (error) {
      console.error('Error fetching period data:', error);
      return { totalIncome: 0, totalExpenses: 0, netProfit: 0, profitMargin: 0 };
    }
  };

  // Fetch financial summary data
  const fetchSummary = async (dateRange?: { from: Date, to: Date }) => {
    try {
      if (!user) return;
      setLoading(true);

      let currentRange = dateRange;
      if (!currentRange) {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        lastDay.setHours(23, 59, 59, 999);
        
        currentRange = { from: firstDay, to: lastDay };
      }

      // Fetch data for the current range
      const financialSummary = await fetchPeriodData(currentRange);
      setSummary(financialSummary);

      return financialSummary;
    } catch (error: any) {
      console.error('Error fetching financial summary:', error);
      toast({
        title: 'Error fetching financial data',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      fetchSummary();
    }
  }, [user]);

  return {
    summary,
    loading,
    fetchSummary,
    fetchPeriodData
  };
}
