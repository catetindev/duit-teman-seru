
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
  const [stats, setStats] = useState<DashboardStats>({
    balance: 0,
    income: 0,
    expenses: 0,
    currency: 'IDR'
  });
  const [loading, setLoading] = useState({
    transactions: true,
    goals: true,
    stats: true
  });
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchTransactions = async () => {
    try {
      setLoading(prev => ({ ...prev, transactions: true }));
      
      const { data, error } = await supabase
        .from('transactions' as any)
        .select('*')
        .order('date', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      // Transform data to match our interface
      const formattedTransactions = data.map(item => ({
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
        .from('savings_goals' as any)
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data to match our interface
      const formattedGoals = data.map(item => ({
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

  const calculateStats = async () => {
    try {
      setLoading(prev => ({ ...prev, stats: true }));
      
      // Get the first day of the current month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { data, error } = await supabase
        .from('transactions' as any)
        .select('*')
        .gte('date', startOfMonth.toISOString());
      
      if (error) throw error;
      
      let totalIncome = 0;
      let totalExpense = 0;
      
      data.forEach(transaction => {
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
      calculateStats();
    }
  }, [user]);

  const refreshData = () => {
    fetchTransactions();
    fetchGoals();
    calculateStats();
  };

  return {
    transactions,
    goals,
    stats,
    loading,
    error,
    refreshData,
    formatCurrency
  };
};
