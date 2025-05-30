
import { ValidCurrency } from '@/hooks/goals/types';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  currency: ValidCurrency;
  category: string;
  description: string;
  date: string;
  icon?: string;
  is_business?: boolean;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent?: number;
  currency: ValidCurrency;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  user_id: string;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  income: number;
  expenses: number;
  currency: ValidCurrency;
  savingsRate: number;
  goalProgress: number;
  recentTransactionDate?: string;
}

export interface DashboardHookReturn {
  transactions: Transaction[];
  goals: any[];
  budgets: Budget[];
  stats: DashboardStats;
  loading: {
    transactions: boolean;
    goals: boolean;
    stats: boolean;
    budgets: boolean;
  };
  refreshData: () => Promise<void>;
  addUpdateBudget: (budgetData: Omit<Budget, 'id'> & { id?: string }) => Promise<any | null>;
  deleteBudget: (id: string) => Promise<boolean>;
}
