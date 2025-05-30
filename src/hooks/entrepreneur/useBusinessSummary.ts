
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BusinessSummaryData {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
}

export function useBusinessSummary() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [summaryData, setSummaryData] = useState<BusinessSummaryData>({
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchBusinessSummary = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch business transactions (income and expenses)
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('type, amount')
        .eq('user_id', user.id)
        .eq('is_business', true);

      if (transactionsError) throw transactionsError;

      // Fetch income from orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('total')
        .eq('user_id', user.id)
        .eq('status', 'Paid');

      if (ordersError) throw ordersError;

      // Fetch expenses from business_expenses table
      const { data: expensesData, error: expensesError } = await supabase
        .from('business_expenses')
        .select('amount')
        .eq('user_id', user.id);

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

      setSummaryData({
        totalIncome,
        totalExpenses,
        netProfit,
        profitMargin
      });
      
    } catch (error: any) {
      console.error('Error fetching business summary:', error);
      toast({
        title: "Error",
        description: "Failed to fetch business data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchBusinessSummary();
  }, [fetchBusinessSummary]);

  return {
    ...summaryData,
    loading,
    refetch: fetchBusinessSummary
  };
}
