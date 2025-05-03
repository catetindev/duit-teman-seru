
export interface Goal {
  id: string;
  title: string;
  target_amount: number;
  saved_amount: number;
  currency: 'IDR' | 'USD';
  target_date?: string;
  emoji?: string;
  user_id: string;
}

export interface Collaborator {
  user_id: string;
  email: string;
  full_name: string;
}

// Add this type alias for database currency conversion
export type ValidCurrency = 'IDR' | 'USD';

// Define the DashboardStats interface
export interface DashboardStats {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  income: number;
  expenses: number;
  currency: ValidCurrency;
  recentTransactionDate?: string;
}
