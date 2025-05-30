
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Transaction } from './types';

export function useTransactions(userId: string | undefined, isBusinessMode: boolean = false) {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchTransactions = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return { transactions: [], stats: null };
    }
    
    try {
      // Build query based on business mode
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_business', isBusinessMode)
        .order('date', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Make sure to properly type the transaction data
      const formattedData: Transaction[] = (data || []).map(tx => ({
        ...tx,
        type: tx.type === 'income' ? 'income' : 'expense',
        currency: (tx.currency === 'USD' ? 'USD' : 'IDR') as any
      }));
      
      setTransactions(formattedData);
      
      // Calculate stats
      let totalIncome = 0;
      let totalExpenses = 0;
      
      formattedData.forEach(transaction => {
        if (transaction.type === 'income') {
          totalIncome += Number(transaction.amount);
        } else {
          totalExpenses += Number(transaction.amount);
        }
      });
      
      const defaultCurrency = formattedData.length > 0 ? formattedData[0].currency : 'IDR';
      
      const stats = {
        totalIncome,
        totalExpenses,
        balance: totalIncome - totalExpenses,
        income: totalIncome,
        expenses: totalExpenses,
        currency: defaultCurrency,
        savingsRate: totalIncome > 0 ? Math.round((totalIncome - totalExpenses) / totalIncome * 100) : 0,
        goalProgress: 0, // This will be calculated elsewhere
        recentTransactionDate: formattedData[0]?.date
      };
      
      setLoading(false);
      
      return { transactions: formattedData, stats };
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error loading transactions",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return { transactions: [], stats: null };
    }
  }, [userId, isBusinessMode, toast]);

  return { transactions, fetchTransactions, setTransactions, loading };
}
