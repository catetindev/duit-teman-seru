
import { z } from 'zod';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  currency: 'IDR' | 'USD';
  category: string;
  description: string;
  date: string;
}

export const categories = {
  expense: [
    { value: 'food', label: 'Food', icon: '🍔' },
    { value: 'transport', label: 'Transport', icon: '🚗' },
    { value: 'entertainment', label: 'Entertainment', icon: '🎬' },
    { value: 'shopping', label: 'Shopping', icon: '🛍️' },
    { value: 'bills', label: 'Bills', icon: '📄' },
    { value: 'health', label: 'Health', icon: '💊' },
    { value: 'education', label: 'Education', icon: '📚' },
    { value: 'other', label: 'Other', icon: '💸' }
  ],
  income: [
    { value: 'salary', label: 'Salary', icon: '💰' },
    { value: 'freelance', label: 'Freelance', icon: '💻' },
    { value: 'gift', label: 'Gift', icon: '🎁' },
    { value: 'investment', label: 'Investment', icon: '📈' },
    { value: 'other', label: 'Other', icon: '💸' }
  ]
};

export const TransactionFormSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive('Amount must be positive'),
  currency: z.enum(['IDR', 'USD']),
  category: z.string().min(1, 'Please select a category'),
  description: z.string().min(1, 'Please enter a description'),
  date: z.string(),
});
