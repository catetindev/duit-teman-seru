
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
      
      // Fetch manual business income transactions
      const { data: incomeTransactionsData, error: incomeTransactionsError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'income')
        .eq('is_business', true);

      if (incomeTransactionsError) throw incomeTransactionsError;

      // Fetch manual business expense transactions
      const { data: expenseTransactionsData, error: expenseTransactionsError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', user.id)
        .eq('type', 'expense')
        .eq('is_business', true);

      if (expenseTransactionsError) throw expenseTransactionsError;

      // Fetch income from POS transactions
      const { data: posTransactionsData, error: posTransactionsError } = await supabase
        .from('pos_transactions')
        .select('total')
        .eq('user_id', user.id);

      if (posTransactionsError) throw posTransactionsError;

      // Fetch income from orders (exclude POS-linked orders to avoid duplication)
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('total')
        .eq('user_id', user.id)
        .eq('status', 'Paid')
        .is('pos_transaction_id', null); // Only non-POS orders

      if (ordersError) throw ordersError;

      // Fetch expenses from business_expenses table
      const { data: expensesData, error: expensesError } = await supabase
        .from('business_expenses')
        .select('amount')
        .eq('user_id', user.id);

      if (expensesError) throw expensesError;

      // Calculate totals from different sources
      const manualIncomeTransactions = incomeTransactionsData.reduce((sum, t) => sum + Number(t.amount), 0);
      const manualExpenseTransactions = expenseTransactionsData.reduce((sum, t) => sum + Number(t.amount), 0);
      const posIncome = posTransactionsData.reduce((sum, tx) => sum + Number(tx.total), 0);
      const orderIncome = ordersData.reduce((sum, order) => sum + Number(order.total), 0);
      const businessExpenses = expensesData.reduce((sum, expense) => sum + Number(expense.amount), 0);

      // Combine all income sources (no duplication)
      const totalIncome = manualIncomeTransactions + posIncome + orderIncome;
      const totalExpenses = manualExpenseTransactions + businessExpenses;
      const netProfit = totalIncome - totalExpenses;
      const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

      console.log('Business summary calculated:', {
        totalIncome,
        totalExpenses,
        netProfit,
        profitMargin,
        breakdown: {
          manualIncomeTransactions,
          posIncome,
          orderIncome,
          manualExpenseTransactions,
          businessExpenses
        }
      });

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
