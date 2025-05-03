
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, calculateProgress } from '@/utils/formatUtils';
import { DashboardStats } from '@/hooks/goals/types';
import { useTransactions } from './dashboard/useTransactions';
import { useGoals } from './dashboard/useGoals';
import { useBudgets } from './dashboard/useBudgets';
import { DashboardHookReturn, Transaction, Budget } from './dashboard/types';

// Main hook
export function useDashboardData(): DashboardHookReturn {
  const { user } = useAuth();
  
  // Set up initial dashboard stats
  const [stats, setStats] = useState<DashboardStats>({
    totalIncome: 0,
    totalExpenses: 0,
    savingsRate: 0,
    goalProgress: 0,
    balance: 0,
    income: 0,
    expenses: 0,
    currency: 'IDR'
  });
  
  // Initialize sub-hooks
  const { transactions, fetchTransactions, loading: transactionsLoading } = useTransactions(user?.id);
  const { goals, fetchGoals, loading: goalsLoading } = useGoals(user?.id);
  const { budgets, fetchBudgets, addUpdateBudget, deleteBudget, loading: budgetsLoading } = useBudgets(user?.id, transactions);
  
  // Combined loading state
  const loading = {
    transactions: transactionsLoading,
    goals: goalsLoading,
    stats: transactionsLoading, // stats depend on transactions
    budgets: budgetsLoading
  };

  // Fetch all data
  const refreshData = useCallback(async () => {
    if (!user) return;
    
    const { stats: newStats } = await fetchTransactions();
    await fetchGoals();
    
    if (newStats) {
      setStats(prev => ({
        ...prev,
        ...newStats
      }));
    }
    
    // fetchBudgets() will be called via the useEffect below
    // after transactions are loaded
    
  }, [user, fetchTransactions, fetchGoals]);

  // Initial data fetch
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

// Export utility functions and types
export { formatCurrency, calculateProgress };
export type { Transaction, Budget };
