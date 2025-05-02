
// Mock data for dashboard components

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
  name: string;
  target: number;
  current: number;
  currency: 'IDR' | 'USD';
  deadline?: string;
  emoji?: string;
}

export interface Badge {
  name: string;
  description: string;
  icon: string;
  isLocked?: boolean;
  isNew?: boolean;
}

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
    name: 'New Laptop',
    target: 15000000,
    current: 7500000,
    currency: 'IDR',
    deadline: 'Sep 2025',
    emoji: '💻'
  }
];

export const premiumGoals = [
  ...mockGoals,
  {
    name: 'Bali Trip',
    target: 8000000,
    current: 3200000,
    currency: 'IDR',
    deadline: 'Dec 2025',
    emoji: '🏝️'
  },
  {
    name: 'Emergency Fund',
    target: 25000000,
    current: 10000000,
    currency: 'IDR',
    deadline: 'Ongoing',
    emoji: '🚨'
  }
];

export const mockBudgets = [
  {
    category: 'Food',
    spent: 1250000,
    budget: 2000000,
    currency: 'IDR'
  },
  {
    category: 'Transport',
    spent: 450000,
    budget: 500000,
    currency: 'IDR'
  },
  {
    category: 'Entertainment',
    spent: 800000,
    budget: 600000,
    currency: 'IDR'
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
