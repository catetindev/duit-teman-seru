import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Transaction, Goal, categoryIcons } from '@/components/dashboard/DashboardData';

export interface DashboardStats {
  balance: number;
  income: number;
  expenses: number;
  currency: 'IDR' | 'USD';
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  currency: 'IDR' | 'USD';
}

// Export formatCurrency function so it can be imported elsewhere
export const formatCurrency = (amount: number, currency: 'IDR' | 'USD'): string => {
  if (currency === 'IDR') {
    return `Rp${amount.toLocaleString('id-ID')}`;
  }
  return `$${amount.toLocaleString('en-US')}`;
};

export const useDashboardData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    balance: 0,
    income: 0,
    expenses: 0,
    currency: 'IDR'
  });
  const [loading, setLoading] = useState({
    transactions: true,
    goals: true,
    stats: true,
    budgets: true
  });
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchTransactions = async () => {
    try {
      setLoading(prev => ({ ...prev, transactions: true }));
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      // Transform data to match our interface and fix the type with explicit casting
      const formattedTransactions = (data || []).map(item => ({
        id: item.id,
        type: item.type as 'income' | 'expense',
        amount: Number(item.amount),
        currency: item.currency as 'IDR' | 'USD',
        category: item.category,
        description: item.description || '',
        date: new Date(item.date).toISOString().split('T')[0],
        icon: categoryIcons[item.category.toLowerCase()] || '💰'
      }));
      
      setTransactions(formattedTransactions);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to load transactions",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }));
    }
  };

  const fetchGoals = async () => {
    try {
      setLoading(prev => ({ ...prev, goals: true }));
      
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .order('id', { ascending: false });
      
      if (error) throw error;
      
      // Transform data to match our interface with explicit casting
      const formattedGoals = (data || []).map(item => ({
        id: item.id,
        title: item.title,
        target_amount: Number(item.target_amount),
        saved_amount: Number(item.saved_amount),
        currency: item.currency as 'IDR' | 'USD',
        target_date: item.target_date ? new Date(item.target_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : undefined,
        emoji: item.emoji || '🎯'
      }));
      
      setGoals(formattedGoals);
    } catch (error: any) {
      console.error('Error fetching goals:', error);
      setError(error.message);
      toast({
        title: "Error",
        description: "Failed to load savings goals",
        variant: "destructive"
      });
    } finally {
      setLoading(prev => ({ ...prev, goals: false }));
    }
  };

  const fetchBudgets = async () => {
    try {
      setLoading(prev => ({ ...prev, budgets: true }));
      
      // First get all budgets
      const { data: budgetData, error: budgetError } = await supabase
        .from('budgets')
        .select('*')
        .order('category', { ascending: true });
      
      if (budgetError) throw budgetError;
      
      // Get current month's first and last day
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      // Get sum of expenses per category for current month
      // Using aggregate function instead of group which isn't available
      const { data: expenseData, error: expenseError } = await supabase
        .from('transactions')
        .select('category, amount')
        .eq('type', 'expense')
        .gte('date', firstDay.toISOString().split('T')[0])
        .lte('date', lastDay.toISOString().split('T')[0]);
      
      if (expenseError) throw expenseError;
      
      // Map expenses to an object for easy lookup - calculate sums manually
      const expensesByCategory: Record<string, number> = {};
      expenseData?.forEach(item => {
        const category = item.category;
        const amount = Number(item.amount || 0);
        if (!expensesByCategory[category]) {
          expensesByCategory[category] = 0;
        }
        expensesByCategory[category] += amount;
      });
      
      // Combine budget data with spent amounts
      const formattedBudgets: Budget[] = (budgetData || []).map(budget => ({
        id: budget.id,
        category: budget.category,
        amount: Number(budget.amount),
        spent: expensesByCategory[budget.category] || 0,
        currency: budget.currency as 'IDR' | 'USD',
      }));
      
      setBudgets(formattedBudgets);
    } catch (error: any) {
      console.error('Error fetching budgets:', error);
      setError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, budgets: false }));
    }
  };

  const calculateStats = async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      
      // Get the first day of the current month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .gte('date', startOfMonth.toISOString());
      
      if (error) throw error;
      
      let totalIncome = 0;
      let totalExpense = 0;
      
      // Fix the type with explicit casting and null check
      (data || []).forEach(transaction => {
        const amount = Number(transaction.amount);
        if (transaction.type === 'income') {
          totalIncome += amount;
        } else {
          totalExpense += amount;
        }
      });
      
      const balance = totalIncome - totalExpense;
      
      setStats({
        balance,
        income: totalIncome,
        expenses: totalExpense,
        currency: 'IDR'
      });
    } catch (error: any) {
      console.error('Error calculating stats:', error);
      setError(error.message);
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchGoals();
      fetchBudgets();
      calculateStats();
    }
  }, [user]);

  const refreshData = () => {
    fetchTransactions();
    fetchGoals();
    fetchBudgets();
    calculateStats();
  };
  
  const deleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('savings_goals')
        .delete()
        .eq('id', goalId);
      
      if (error) throw error;
      
      toast({
        title: "Goal deleted",
        description: "Savings goal has been deleted successfully",
      });
      
      fetchGoals(); // Refresh goals after deletion
    } catch (error: any) {
      console.error('Error deleting goal:', error);
      toast({
        title: "Error",
        description: "Failed to delete goal: " + error.message,
        variant: "destructive"
      });
    }
  };
  
  const addUpdateBudget = async (budget: Omit<Budget, 'id' | 'spent'> & { id?: string }) => {
    try {
      if (budget.id) {
        // Update existing budget
        const { error } = await supabase
          .from('budgets')
          .update({
            category: budget.category,
            amount: budget.amount,
            currency: budget.currency
          })
          .eq('id', budget.id);
          
        if (error) throw error;
        
        toast({
          title: "Budget updated",
          description: "Budget has been updated successfully",
        });
      } else {
        // Add new budget
        const { error } = await supabase
          .from('budgets')
          .insert({
            category: budget.category,
            amount: budget.amount,
            currency: budget.currency,
            user_id: user?.id
          });
          
        if (error) throw error;
        
        toast({
          title: "Budget added",
          description: "New budget has been added successfully",
        });
      }
      
      fetchBudgets(); // Refresh budgets after adding/updating
    } catch (error: any) {
      console.error('Error saving budget:', error);
      toast({
        title: "Error",
        description: "Failed to save budget: " + error.message,
        variant: "destructive"
      });
    }
  };
  
  const deleteBudget = async (budgetId: string) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', budgetId);
      
      if (error) throw error;
      
      toast({
        title: "Budget deleted",
        description: "Budget has been deleted successfully",
      });
      
      fetchBudgets(); // Refresh budgets after deletion
    } catch (error: any) {
      console.error('Error deleting budget:', error);
      toast({
        title: "Error",
        description: "Failed to delete budget: " + error.message,
        variant: "destructive"
      });
    }
  };

  return {
    transactions,
    goals,
    budgets,
    stats,
    loading,
    error,
    refreshData,
    deleteGoal,
    addUpdateBudget,
    deleteBudget,
    formatCurrency
  };
};
