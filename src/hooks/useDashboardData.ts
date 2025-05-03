
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, calculateProgress } from '@/utils/formatUtils';
import { Goal, ValidCurrency, DashboardStats } from '@/hooks/goals/types';

// Types
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  currency: ValidCurrency;
  category: string;
  description: string;
  date: string;
  icon?: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent?: number;
  currency: ValidCurrency;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

// Main hook
export function useDashboardData() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // States
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
    income: 0,
    expenses: 0,
    currency: 'IDR'
  });
  
  // Loading states
  const [loading, setLoading] = useState({
    transactions: true,
    goals: true,
    stats: true,
    budgets: true
  });

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    if (!user) {
      setLoading(prev => ({ ...prev, transactions: false }));
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      // Make sure to properly type the transaction data
      const formattedData: Transaction[] = (data || []).map(tx => ({
        ...tx,
        type: tx.type === 'income' ? 'income' : 'expense',
        currency: (tx.currency === 'USD' ? 'USD' : 'IDR') as ValidCurrency
      }));
      
      setTransactions(formattedData);
      
      // Calculate stats
      let totalIncome = 0;
      let totalExpense = 0;
      
      formattedData.forEach(transaction => {
        if (transaction.type === 'income') {
          totalIncome += Number(transaction.amount);
        } else {
          totalExpense += Number(transaction.amount);
        }
      });
      
      const defaultCurrency = formattedData.length > 0 ? formattedData[0].currency : 'IDR';
      
      setStats({
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        income: totalIncome,
        expenses: totalExpense,
        currency: defaultCurrency,
        recentTransactionDate: formattedData[0]?.date
      });
      
      setLoading(prev => ({ ...prev, transactions: false, stats: false }));
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error loading transactions",
        description: error.message,
        variant: "destructive",
      });
      setLoading(prev => ({ ...prev, transactions: false, stats: false }));
    }
  }, [user, toast]);

  // Fetch goals
  const fetchGoals = useCallback(async () => {
    if (!user) {
      setLoading(prev => ({ ...prev, goals: false }));
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      // Type conversion to ensure Goal[] type compatibility
      const typedGoals: Goal[] = (data || []).map(goal => ({
        ...goal,
        currency: (goal.currency === 'USD' ? 'USD' : 'IDR') as ValidCurrency
      }));
      
      setGoals(typedGoals);
    } catch (error: any) {
      console.error('Error fetching goals:', error);
      toast({
        title: "Error loading goals",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, goals: false }));
    }
  }, [user, toast]);

  // Fetch budgets
  const fetchBudgets = useCallback(async () => {
    if (!user) {
      setLoading(prev => ({ ...prev, budgets: false }));
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Calculate spent amount for each budget based on transactions
      const budgetsWithSpent: Budget[] = (data || []).map(budget => {
        const spent = transactions
          .filter(t => 
            t.type === 'expense' && 
            t.category.toLowerCase() === budget.category.toLowerCase()
          )
          .reduce((sum, t) => sum + Number(t.amount), 0);
        
        return {
          ...budget,
          spent,
          currency: (budget.currency === 'USD' ? 'USD' : 'IDR') as ValidCurrency,
          period: budget.period as 'daily' | 'weekly' | 'monthly' | 'yearly'
        };
      });
      
      setBudgets(budgetsWithSpent);
    } catch (error: any) {
      console.error('Error fetching budgets:', error);
      toast({
        title: "Error loading budgets",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, budgets: false }));
    }
  }, [user, toast, transactions]);

  // Add or update budget
  const addUpdateBudget = useCallback(async (budgetData: Omit<Budget, 'id'> & { id?: string }) => {
    if (!user) return null;
    
    try {
      const { id, ...rest } = budgetData;
      const data = {
        ...rest,
        user_id: user.id
      };
      
      if (id) {
        // Update existing budget
        const { data: updatedBudget, error } = await supabase
          .from('budgets')
          .update(data)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        
        // Update local state with proper type casting
        setBudgets(prev => prev.map(b => b.id === id ? {
          ...updatedBudget,
          spent: b.spent,
          currency: (updatedBudget.currency === 'USD' ? 'USD' : 'IDR') as ValidCurrency,
          period: updatedBudget.period as 'daily' | 'weekly' | 'monthly' | 'yearly'
        } : b));
        
        return updatedBudget;
      } else {
        // Insert new budget
        const { data: newBudget, error } = await supabase
          .from('budgets')
          .insert(data)
          .select()
          .single();
        
        if (error) throw error;
        
        // Update local state with proper type casting
        const typedBudget: Budget = {
          ...newBudget,
          spent: 0,
          currency: (newBudget.currency === 'USD' ? 'USD' : 'IDR') as ValidCurrency,
          period: newBudget.period as 'daily' | 'weekly' | 'monthly' | 'yearly'
        };
        
        setBudgets(prev => [...prev, typedBudget]);
        
        return newBudget;
      }
    } catch (error: any) {
      console.error('Error adding/updating budget:', error);
      toast({
        title: "Error saving budget",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  }, [user, toast]);

  // Delete budget
  const deleteBudget = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setBudgets(prev => prev.filter(b => b.id !== id));
      
      return true;
    } catch (error: any) {
      console.error('Error deleting budget:', error);
      toast({
        title: "Error deleting budget",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  // Fetch all data
  const refreshData = useCallback(async () => {
    if (!user) return;
    
    // Reset loading states
    setLoading({
      transactions: true,
      goals: true,
      stats: true,
      budgets: true
    });
    
    await fetchTransactions();
    await fetchGoals();
    // After transactions have been fetched, then fetch budgets
    // as they depend on transaction data for calculating spent amounts
  }, [user, fetchTransactions, fetchGoals]);

  // Initial data fetch - use useEffect with proper dependencies
  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user, refreshData]);

  // After transactions are loaded, fetch budgets
  useEffect(() => {
    if (user && !loading.transactions) {
      fetchBudgets();
    }
  }, [user, loading.transactions, fetchBudgets]);

  // Export utility functions for convenience
  return {
    transactions,
    goals,
    budgets,
    stats,
    loading,
    refreshData,
    addUpdateBudget,
    deleteBudget,
  };
}

// Export utility functions
export { formatCurrency, calculateProgress };
