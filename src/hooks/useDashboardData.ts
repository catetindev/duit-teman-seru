
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Transaction, Goal } from '@/components/dashboard/DashboardData';
import { formatCurrency } from '@/utils/formatUtils';

// Define the DashboardStats interface
export interface DashboardStats {
  balance: number;
  income: number;
  expenses: number;
  currency: 'IDR' | 'USD';
  change?: number;
}

// Define the Budget interface
export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  currency: 'IDR' | 'USD';
}

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
  
  // Loading states
  const [loading, setLoading] = useState({
    transactions: true,
    goals: true,
    stats: true,
    budgets: true,
  });
  
  const { user } = useAuth();
  
  // Function to fetch transaction data
  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      setLoading(prev => ({ ...prev, transactions: true }));
      
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      // Type assertion to make TypeScript happy
      setTransactions(data as Transaction[] || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(prev => ({ ...prev, transactions: false }));
    }
  };
  
  // Function to fetch goals data
  const fetchGoals = async () => {
    if (!user) return;
    
    try {
      setLoading(prev => ({ ...prev, goals: true }));
      
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', user.id)
        .limit(3)
        .order('created_at', { ascending: false });
        
      if (error) {
        // Check if it's the recursion error or something that shouldn't interrupt the dashboard
        if (!error.message.includes('infinite recursion detected')) {
          throw error;
        }
        console.warn('Ignoring goals recursion error on dashboard:', error.message);
        // Don't fail the whole dashboard for this error, just show empty goals
        setGoals([]);
      } else {
        // Type assertion to make TypeScript happy
        setGoals(data as Goal[] || []);
      }
    } catch (error) {
      console.error('Error fetching goals for dashboard:', error);
      // Continue with empty goals rather than breaking the dashboard
      setGoals([]);
    } finally {
      setLoading(prev => ({ ...prev, goals: false }));
    }
  };
  
  // Function to calculate and prepare stats
  const calculateStats = async () => {
    if (!user) return;
    
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      
      // Create the current month date range
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      // Format dates for Supabase
      const startDate = firstDay.toISOString().split('T')[0];
      const endDate = lastDay.toISOString().split('T')[0];
      
      // Fetch income and expense transactions for the current month
      const { data: incomeData, error: incomeError } = await supabase
        .from('transactions')
        .select('amount, currency')
        .eq('user_id', user.id)
        .eq('type', 'income')
        .gte('date', startDate)
        .lte('date', endDate);
      
      if (incomeError) throw incomeError;
      
      const { data: expenseData, error: expenseError } = await supabase
        .from('transactions')
        .select('amount, currency')
        .eq('user_id', user.id)
        .eq('type', 'expense')
        .gte('date', startDate)
        .lte('date', endDate);
      
      if (expenseError) throw expenseError;
      
      // Calculate total income and expenses
      const totalIncome = incomeData?.reduce((sum, transaction) => sum + Number(transaction.amount), 0) || 0;
      const totalExpenses = expenseData?.reduce((sum, transaction) => sum + Number(transaction.amount), 0) || 0;
      
      // Prepare stats data
      const statsData: DashboardStats = {
        income: totalIncome,
        expenses: totalExpenses,
        balance: totalIncome - totalExpenses,
        currency: 'IDR',
      };
      
      setStats(statsData);
    } catch (error) {
      console.error('Error calculating stats:', error);
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  // Function to fetch budgets data
  const fetchBudgets = async () => {
    if (!user) return;
    
    try {
      setLoading(prev => ({ ...prev, budgets: true }));
      
      // Get current month's first and last day
      const now = new Date();
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      // Format dates for Supabase
      const startDate = firstDay.toISOString().split('T')[0];
      const endDate = lastDay.toISOString().split('T')[0];
      
      // First get all budgets
      const { data: budgetData, error: budgetError } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id);
      
      if (budgetError) throw budgetError;
      
      // Get expenses per category for current month
      const { data: expenseData, error: expenseError } = await supabase
        .from('transactions')
        .select('category, amount')
        .eq('type', 'expense')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate);
      
      if (expenseError) throw expenseError;
      
      // Map expenses to an object for easy lookup
      const expensesByCategory: Record<string, number> = {};
      expenseData?.forEach(item => {
        const category = item.category.toLowerCase();
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
        spent: expensesByCategory[budget.category.toLowerCase()] || 0,
        currency: budget.currency as 'IDR' | 'USD',
      }));
      
      setBudgets(formattedBudgets);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      setBudgets([]);
    } finally {
      setLoading(prev => ({ ...prev, budgets: false }));
    }
  };

  // Function to add or update a budget
  const addUpdateBudget = async (budget: { 
    id?: string; 
    category: string; 
    amount: number; 
    currency: 'IDR' | 'USD' 
  }) => {
    if (!user) return;

    try {
      const budgetData = {
        ...budget,
        user_id: user.id
      };

      if (budget.id) {
        // Update existing budget
        const { error } = await supabase
          .from('budgets')
          .update({
            category: budget.category,
            amount: budget.amount,
            currency: budget.currency
          })
          .eq('id', budget.id)
          .eq('user_id', user.id);

        if (error) throw error;
      } else {
        // Insert new budget
        const { error } = await supabase
          .from('budgets')
          .insert({
            category: budget.category,
            amount: budget.amount,
            currency: budget.currency,
            user_id: user.id
          });

        if (error) throw error;
      }

      // Refresh budgets
      await fetchBudgets();
      return true;
    } catch (error) {
      console.error('Error saving budget:', error);
      return false;
    }
  };

  // Function to delete a budget
  const deleteBudget = async (budgetId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', budgetId)
        .eq('user_id', user.id);

      if (error) throw error;
      
      // Refresh budgets
      await fetchBudgets();
      return true;
    } catch (error) {
      console.error('Error deleting budget:', error);
      return false;
    }
  };
  
  // Refresh all dashboard data
  const refreshData = () => {
    fetchTransactions();
    fetchGoals();
    calculateStats();
    fetchBudgets();
  };
  
  // Load data when component mounts or user changes
  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);
  
  return {
    transactions,
    goals,
    stats,
    budgets,
    loading,
    refreshData,
    addUpdateBudget,
    deleteBudget
  };
};
