
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Budget, Transaction } from './types';

export function useBudgets(userId: string | undefined, transactions: Transaction[]) {
  const { toast } = useToast();
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchBudgets = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return [];
    }
    
    try {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      
      // Calculate spent amount for each budget based on transactions
      const budgetsWithSpent: Budget[] = (data || []).map(budget => {
        const spent = transactions
          .filter(t => 
            t.type === 'expense' && 
            t.category.toLowerCase() === budget.category.toLowerCase()
          )
          .reduce((sum, t) => sum + Number(t.amount), 0);
        
        return {
          ...budget,
          spent,
          currency: (budget.currency === 'USD' ? 'USD' : 'IDR') as any,
          period: budget.period as 'daily' | 'weekly' | 'monthly' | 'yearly'
        };
      });
      
      setBudgets(budgetsWithSpent);
      setLoading(false);
      return budgetsWithSpent;
    } catch (error: any) {
      console.error('Error fetching budgets:', error);
      toast({
        title: "Error loading budgets",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return [];
    }
  }, [userId, toast, transactions]);

  const addUpdateBudget = useCallback(async (budgetData: Omit<Budget, 'id'> & { id?: string }) => {
    if (!userId) return null;
    
    try {
      const { id, ...rest } = budgetData;
      const data = {
        ...rest,
        user_id: userId
      };
      
      if (id) {
        // Update existing budget
        const { data: updatedBudget, error } = await supabase
          .from('budgets')
          .update(data)
          .eq('id', id)
          .select()
          .single();
        
        if (error) throw error;
        
        // Update local state with proper type casting
        setBudgets(prev => prev.map(b => b.id === id ? {
          ...updatedBudget,
          spent: b.spent,
          currency: (updatedBudget.currency === 'USD' ? 'USD' : 'IDR') as any,
          period: updatedBudget.period as 'daily' | 'weekly' | 'monthly' | 'yearly'
        } : b));
        
        return updatedBudget;
      } else {
        // Insert new budget
        const { data: newBudget, error } = await supabase
          .from('budgets')
          .insert(data)
          .select()
          .single();
        
        if (error) throw error;
        
        // Update local state with proper type casting
        const typedBudget: Budget = {
          ...newBudget,
          spent: 0,
          currency: (newBudget.currency === 'USD' ? 'USD' : 'IDR') as any,
          period: newBudget.period as 'daily' | 'weekly' | 'monthly' | 'yearly'
        };
        
        setBudgets(prev => [...prev, typedBudget]);
        
        return newBudget;
      }
    } catch (error: any) {
      console.error('Error adding/updating budget:', error);
      toast({
        title: "Error saving budget",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  }, [userId, toast]);

  const deleteBudget = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setBudgets(prev => prev.filter(b => b.id !== id));
      
      return true;
    } catch (error: any) {
      console.error('Error deleting budget:', error);
      toast({
        title: "Error deleting budget",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  return { budgets, fetchBudgets, addUpdateBudget, deleteBudget, loading };
}
