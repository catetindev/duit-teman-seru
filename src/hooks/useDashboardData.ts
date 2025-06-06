
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTransactions as useTransactionsHook } from './dashboard/useTransactions';
import { useGoals } from './dashboard/useGoals';
import { useBudgets } from './dashboard/useBudgets';
import { useEntrepreneurMode } from './useEntrepreneurMode';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  currency: 'IDR' | 'USD';
  category: string;
  description: string;
  date: string;
  is_business?: boolean;
}

export interface Goal {
  id: string;
  title: string;
  target_amount: number;
  saved_amount: number;
  target_date: string;
  currency: string;
  emoji: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  income: number;
  expenses: number;
  currency: 'IDR' | 'USD';
  savingsRate: number;
  goalProgress: number;
  recentTransactionDate?: string;
}

export function useDashboardData() {
  const { user } = useAuth();
  const { isEntrepreneurMode } = useEntrepreneurMode();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState({
    transactions: true,
    goals: true,
    budgets: true,
    stats: true,
  });

  // Use transactions hook based on current mode (personal vs business)
  const {
    transactions,
    fetchTransactions,
    loading: transactionsLoading
  } = useTransactionsHook(user?.id, isEntrepreneurMode);

  const {
    goals,
    fetchGoals,
    loading: goalsLoading
  } = useGoals(user?.id);

  const {
    budgets,
    fetchBudgets,
    addUpdateBudget,
    deleteBudget,
    loading: budgetsLoading
  } = useBudgets(user?.id, transactions);

  // Update loading states
  useEffect(() => {
    setLoading(prev => ({
      ...prev,
      transactions: transactionsLoading,
      goals: goalsLoading,
      budgets: budgetsLoading,
      stats: transactionsLoading || goalsLoading || budgetsLoading
    }));
  }, [transactionsLoading, goalsLoading, budgetsLoading]);

  // Fetch data and calculate stats
  const refreshData = async () => {
    if (!user?.id) return;
    
    try {
      const [transactionResult] = await Promise.all([
        fetchTransactions(),
        fetchGoals(),
        fetchBudgets()
      ]);

      if (transactionResult?.stats) {
        setStats(transactionResult.stats);
      }
    } catch (error) {
      console.error('Error refreshing dashboard data:', error);
    }
  };

  // Fetch data on mount and when user or mode changes
  useEffect(() => {
    if (user?.id) {
      refreshData();
    }
  }, [user?.id, isEntrepreneurMode]);

  return {
    transactions,
    goals,
    budgets,
    stats,
    loading,
    refreshData,
    addUpdateBudget,
    deleteBudget
  };
}
