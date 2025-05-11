
import { Database } from "@/integrations/supabase/types";

// Business Expense Type
export type BusinessExpense = Database['public']['Tables']['business_expenses']['Row'];

// Invoice Types
export type Invoice = Database['public']['Tables']['invoices']['Row'];
export type InvoiceItem = {
  name: string;
  description?: string;
  quantity: number;
  unit_price: number;
  total: number;
};

export type InvoiceFormData = {
  id?: string;
  invoice_number: string;
  customer_id: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  payment_method: string;
  payment_due_date: Date;
  payment_proof_url?: string;
  notes?: string;
};

// Finance Summary Types
export type FinanceSummary = {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
};

export type ExpenseCategory = {
  category: string;
  amount: number;
  percentage: number;
};

export type TopProduct = {
  name: string;
  revenue: number;
  count: number;
};

export type ComparisonData = {
  current: FinanceSummary;
  previous: FinanceSummary;
  incomeChange: number;
  expensesChange: number;
  profitChange: number;
  marginChange: number;
};
