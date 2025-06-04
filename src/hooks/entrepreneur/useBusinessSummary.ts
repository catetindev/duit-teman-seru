
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BusinessSummaryData {
  totalIncome: number; // Only manual business income transactions
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  posRevenue: number; // Separate POS revenue
  orderRevenue: number; // Separate order revenue
  totalRevenue: number; // Combined all revenue sources
}

export function useBusinessSummary() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [summaryData, setSummaryData] = useState<BusinessSummaryData>({
    totalIncome: 0,
    totalExpenses: 0,
    netProfit: 0,
    profitMargin: 0,
    posRevenue: 0,
    orderRevenue: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchBusinessSummary = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch ONLY manual business income transactions (form-based)
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

      // Fetch POS revenue (separate from manual income)
      const { data: posTransactionsData, error: posTransactionsError } = await supabase
        .from('pos_transactions')
        .select('total')
        .eq('user_id', user.id);

      if (posTransactionsError) throw posTransactionsError;

      // Fetch order revenue (exclude POS-linked orders to avoid duplication)
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

      // Calculate separate revenue streams
      const manualIncomeTransactions = incomeTransactionsData.reduce((sum, t) => sum + Number(t.amount), 0);
      const manualExpenseTransactions = expenseTransactionsData.reduce((sum, t) => sum + Number(t.amount), 0);
      const posRevenue = posTransactionsData.reduce((sum, tx) => sum + Number(tx.total), 0);
      const orderRevenue = ordersData.reduce((sum, order) => sum + Number(order.total), 0);
      const businessExpenses = expensesData.reduce((sum, expense) => sum + Number(expense.amount), 0);

      // Total Income = ONLY manual business income (from forms)
      const totalIncome = manualIncomeTransactions;
      
      // Total Revenue = All revenue sources combined (for reference)
      const totalRevenue = manualIncomeTransactions + posRevenue + orderRevenue;
      
      // Total Expenses = All expenses combined
      const totalExpenses = manualExpenseTransactions + businessExpenses;
      
      // Net profit calculation based on total revenue vs total expenses
      const netProfit = totalRevenue - totalExpenses;
      const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

      console.log('Business summary calculated:', {
        totalIncome, // Manual income only
        totalRevenue, // All revenue sources
        posRevenue,
        orderRevenue,
        totalExpenses,
        netProfit,
        profitMargin,
        breakdown: {
          manualIncomeTransactions,
          posRevenue,
          orderRevenue,
          manualExpenseTransactions,
          businessExpenses
        }
      });

      setSummaryData({
        totalIncome,
        totalExpenses,
        netProfit,
        profitMargin,
        posRevenue,
        orderRevenue,
        totalRevenue
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
