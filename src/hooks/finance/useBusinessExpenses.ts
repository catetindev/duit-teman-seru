
import { useState, useEffect } from 'react';
import { BusinessExpense } from '@/types/finance';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/formatUtils';

export function useBusinessExpenses() {
  const [expenses, setExpenses] = useState<BusinessExpense[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch expenses
  const fetchExpenses = async (dateRange?: { from: Date, to: Date }) => {
    try {
      if (!user) return;
      setLoading(true);

      let query = supabase
        .from('business_expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      // Apply date filter if provided
      if (dateRange) {
        query = query
          .gte('date', dateRange.from.toISOString())
          .lte('date', dateRange.to.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      const expensesData = data as BusinessExpense[];
      setExpenses(expensesData);

      // Extract unique categories
      const uniqueCategories = [...new Set(expensesData.map(expense => expense.category))];
      setCategories(uniqueCategories);

      return expensesData;
    } catch (error: any) {
      console.error('Error fetching expenses:', error);
      toast({
        title: 'Error fetching expenses',
        description: error.message,
        variant: 'destructive'
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Add new expense
  const addExpense = async (expense: Omit<BusinessExpense, 'id' | 'user_id' | 'created_at'>) => {
    try {
      if (!user) return null;

      const newExpense = {
        ...expense,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from('business_expenses')
        .insert(newExpense)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Expense added',
        description: `${expense.title} (${formatCurrency(Number(expense.amount))}) added successfully`,
      });

      // Update local state
      setExpenses(prev => [data as BusinessExpense, ...prev]);
      return data as BusinessExpense;
    } catch (error: any) {
      console.error('Error adding expense:', error);
      toast({
        title: 'Error adding expense',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    }
  };

  // Update expense
  const updateExpense = async (expense: BusinessExpense) => {
    try {
      const { data, error } = await supabase
        .from('business_expenses')
        .update(expense)
        .eq('id', expense.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Expense updated',
        description: `${expense.title} updated successfully`,
      });

      // Update local state
      setExpenses(prev => prev.map(e => e.id === expense.id ? (data as BusinessExpense) : e));
      return data as BusinessExpense;
    } catch (error: any) {
      console.error('Error updating expense:', error);
      toast({
        title: 'Error updating expense',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    }
  };

  // Delete expense
  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase
        .from('business_expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Expense deleted',
        description: 'The expense was deleted successfully',
      });

      // Update local state
      setExpenses(prev => prev.filter(e => e.id !== id));
      return true;
    } catch (error: any) {
      console.error('Error deleting expense:', error);
      toast({
        title: 'Error deleting expense',
        description: error.message,
        variant: 'destructive'
      });
      return false;
    }
  };

  // Calculate totals
  const calculateExpenseTotals = () => {
    const total = expenses.reduce((acc, expense) => acc + Number(expense.amount), 0);
    const byCategory = expenses.reduce((acc, expense) => {
      const category = expense.category;
      if (!acc[category]) acc[category] = 0;
      acc[category] += Number(expense.amount);
      return acc;
    }, {} as Record<string, number>);

    return { total, byCategory };
  };

  // Load expenses when user changes
  useEffect(() => {
    if (user) {
      fetchExpenses();
    }
  }, [user]);

  return {
    expenses,
    loading,
    categories,
    fetchExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    calculateExpenseTotals
  };
}
