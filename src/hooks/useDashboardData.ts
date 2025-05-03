
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, calculateProgress } from '@/utils/formatUtils';

// Types
export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  currency: 'IDR' | 'USD';
  category: string;
  description: string;
  date: string;
  icon?: string;
}

export interface Goal {
  id: string;
  title: string;
  target_amount: number;
  saved_amount: number;
  currency: 'IDR' | 'USD';
  target_date?: string;
  emoji?: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent?: number;
  currency: 'IDR' | 'USD';
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  recentTransactionDate?: string;
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
    balance: 0
  });
  
  // Loading states
  const [loading, setLoading] = useState({
    transactions: true,
    goals: true,
    stats: true,
    budgets: true
  });

  // Fetch transactions
  const fetchTransactions = async () => {
    if (!user) return;
    
    setLoading(prev => ({ ...prev, transactions: true }));
    
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      const formattedData: Transaction[] = data || [];
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
      
      setStats({
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
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
      setLoading(prev => ({ ...prev, transactions: false }));
    }
  };

  // Fetch goals
  const fetchGoals = async () => {
    if (!user) return;
    
    setLoading(prev => ({ ...prev, goals: true }));
    
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .select('*')
        .or(`user_id.eq.${user.id},id.in.(${
          supabase.from('goal_collaborators')
            .select('goal_id')
            .eq('user_id', user.id)
            .then(({ data }) => data?.map(row => row.goal_id) || [])
        })`);
        
      if (error) throw error;
      
      setGoals(data || []);
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
  };

  // Fetch budgets
  const fetchBudgets = async () => {
    if (!user) return;
    
    setLoading(prev => ({ ...prev, budgets: true }));
    
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Calculate spent amount for each budget based on transactions
      const budgetsWithSpent = (data || []).map(budget => {
        const spent = transactions
          .filter(t => 
            t.type === 'expense' && 
            t.category.toLowerCase() === budget.category.toLowerCase()
          )
          .reduce((sum, t) => sum + Number(t.amount), 0);
        
        return {
          ...budget,
          spent
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
  };

  // Add or update budget
  const addUpdateBudget = async (budgetData: Omit<Budget, 'id'> & { id?: string }) => {
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
        
        // Update local state
        setBudgets(prev => prev.map(b => b.id === id ? { ...updatedBudget, spent: b.spent } : b));
        fetchBudgets(); // Refresh to get accurate data
        
        return updatedBudget;
      } else {
        // Insert new budget
        const { data: newBudget, error } = await supabase
          .from('budgets')
          .insert(data)
          .select()
          .single();
        
        if (error) throw error;
        
        // Update local state
        setBudgets(prev => [...prev, { ...newBudget, spent: 0 }]);
        fetchBudgets(); // Refresh to get accurate data
        
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
  };

  // Delete budget
  const deleteBudget = async (id: string) => {
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
  };

  // Fetch all data
  const refreshData = async () => {
    if (!user) return;
    await fetchTransactions();
    await fetchGoals();
    await fetchBudgets();
  };

  // Initial data fetch
  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);

  // Re-export utility functions for convenience
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
