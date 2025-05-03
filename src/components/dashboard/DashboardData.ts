import { formatCurrency } from '@/utils/formatUtils';

// Define interfaces
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

export interface Budget {
  category: string;
  spent: number;
  budget: number;
  currency: 'IDR' | 'USD';
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

export interface StatCard {
  title: string;
  value: number;
  currency: 'IDR' | 'USD';
  change: number;
  type: 'positive' | 'negative';
}

// Mock data - will be replaced with real data from Supabase
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'expense',
    amount: 125000,
    currency: 'IDR',
    category: 'food',
    description: 'Lunch at Warung Pak Made',
    date: '2025-05-01',
    icon: '🍲'
  },
  {
    id: '2',
    type: 'expense',
    amount: 55000,
    currency: 'IDR',
    category: 'transport',
    description: 'Gojek ride',
    date: '2025-05-01',
    icon: '🛵'
  },
  {
    id: '3',
    type: 'income',
    amount: 5000000,
    currency: 'IDR',
    category: 'salary',
    description: 'Monthly Salary',
    date: '2025-05-01',
    icon: '💰'
  }
];

export const mockGoals = [
  {
    id: '1',
    title: 'New Laptop',
    target_amount: 15000000,
    saved_amount: 7500000,
    currency: 'IDR' as const,
    target_date: 'Sep 2025',
    emoji: '💻'
  }
];

export const premiumGoals = [
  ...mockGoals,
  {
    id: '2',
    title: 'Bali Trip',
    target_amount: 8000000,
    saved_amount: 3200000,
    currency: 'IDR' as const,
    target_date: 'Dec 2025',
    emoji: '🏝️'
  },
  {
    id: '3',
    title: 'Emergency Fund',
    target_amount: 25000000,
    saved_amount: 10000000,
    currency: 'IDR' as const,
    target_date: 'Ongoing',
    emoji: '🚨'
  }
];

export const mockBudgets = [
  {
    category: 'Food',
    spent: 1250000,
    budget: 2000000,
    currency: 'IDR' as const
  },
  {
    category: 'Transport',
    spent: 450000,
    budget: 500000,
    currency: 'IDR' as const
  },
  {
    category: 'Entertainment',
    spent: 800000,
    budget: 600000,
    currency: 'IDR' as const
  }
];

export const mockBadges = [
  {
    name: 'Saver Starter',
    description: 'Save your first Rp100,000',
    icon: '🌱',
    isLocked: false
  },
  {
    name: 'Budget Master',
    description: 'Stay under budget for 3 months',
    icon: '🏆',
    isLocked: false,
    isNew: true
  },
  {
    name: 'Money Explorer',
    description: 'Track expenses for 30 days straight',
    icon: '🧭',
    isLocked: false
  },
  {
    name: 'Goal Crusher',
    description: 'Complete your first savings goal',
    icon: '🎯',
    isLocked: true
  }
];

// Re-export formatCurrency
export { formatCurrency };

export const categoryIcons: Record<string, string> = {
  'food': '🍔',
  'transport': '🚗',
  'entertainment': '🎬',
  'shopping': '🛍️',
  'bills': '📄',
  'salary': '💰',
  'gift': '🎁',
  'other': '📦'
};
