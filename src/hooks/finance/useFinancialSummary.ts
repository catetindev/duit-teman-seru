
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
      
      // Fetch business transactions (income and expenses)
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('type, amount')
        .eq('user_id', user.id)
        .eq('is_business', true)
        .gte('date', range.from.toISOString().split('T')[0])
        .lte('date', range.to.toISOString().split('T')[0]);

      if (transactionsError) throw transactionsError;

      // Fetch income from orders (existing business income)
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('total')
        .eq('user_id', user.id)
        .eq('status', 'Paid')
        .gte('created_at', range.from.toISOString())
        .lte('created_at', range.to.toISOString());

      if (ordersError) throw ordersError;

      // Fetch expenses from business_expenses table (existing business expenses)
      const { data: expensesData, error: expensesError } = await supabase
        .from('business_expenses')
        .select('amount')
        .eq('user_id', user.id)
        .gte('date', range.from.toISOString())
        .lte('date', range.to.toISOString());

      if (expensesError) throw expensesError;

      // Calculate totals from transactions
      const transactionIncome = transactionsData
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const transactionExpenses = transactionsData
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      // Calculate totals from orders and business_expenses
      const orderIncome = ordersData.reduce((sum, order) => sum + Number(order.total), 0);
      const businessExpenses = expensesData.reduce((sum, expense) => sum + Number(expense.amount), 0);

      // Combine all income and expenses
      const totalIncome = transactionIncome + orderIncome;
      const totalExpenses = transactionExpenses + businessExpenses;
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
