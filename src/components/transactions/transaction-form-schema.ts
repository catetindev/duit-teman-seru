
import { z } from 'zod';

/**
 * Schema for transaction form validation
 */
export const TransactionFormSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive('Amount must be positive'),
  currency: z.enum(['IDR', 'USD']),
  category: z.string().min(1, 'Please select a category'),
  description: z.string().min(1, 'Please enter a description'),
  date: z.string(),
});

export type TransactionFormValues = z.infer<typeof TransactionFormSchema>;
