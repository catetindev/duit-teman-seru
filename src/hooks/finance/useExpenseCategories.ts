
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ExpenseCategory } from '@/types/finance';
import { useBusinessExpenses } from './useBusinessExpenses';

export function useExpenseCategories() {
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { fetchExpenses } = useBusinessExpenses();

  // Calculate expense categories
  const calculateCategories = async (dateRange?: { from: Date, to: Date }) => {
    try {
      if (!user) return [];
      setLoading(true);

      // Fetch expenses for the date range
      const expensesData = await fetchExpenses(dateRange);
      
      // Calculate total expenses
      const totalExpenses = expensesData.reduce((sum, expense) => sum + Number(expense.amount), 0);
      
      // Group expenses by category
      const categoryMap = expensesData.reduce((acc, expense) => {
        const category = expense.category;
        if (!acc[category]) acc[category] = 0;
        acc[category] += Number(expense.amount);
        return acc;
      }, {} as Record<string, number>);

      // Format categories with percentages
      const categories = Object.entries(categoryMap).map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
      })).sort((a, b) => b.amount - a.amount);

      setExpenseCategories(categories);
      return categories;
    } catch (error) {
      console.error('Error calculating expense categories:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user) {
      calculateCategories();
    }
  }, [user]);

  return {
    expenseCategories,
    loading,
    calculateCategories
  };
}
