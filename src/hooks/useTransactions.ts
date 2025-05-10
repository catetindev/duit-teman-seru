
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface TransactionData {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  currency: 'IDR' | 'USD';
  category: string;
  description: string;
  date: string;
  icon?: string;
}

export const useTransactions = () => {
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('month');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const fetchTransactions = useCallback(async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('Fetching transactions for user:', user.id);
      
      // Build query based on filters
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      
      // Apply time filter if premium user
      if (isPremium && timeFilter !== 'all') {
        const now = new Date();
        let startDate = new Date();
        
        if (timeFilter === 'today') {
          startDate.setHours(0, 0, 0, 0);
        } else if (timeFilter === 'week') {
          startDate.setDate(now.getDate() - 7);
        } else if (timeFilter === 'month') {
          startDate.setMonth(now.getMonth() - 1);
        }
        
        query = query.gte('date', startDate.toISOString());
      }
      
      // Apply category filter
      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      console.log('Fetched transactions:', data);
      
      // Format transactions
      const formattedTransactions = (data || []).map(item => ({
        id: item.id,
        type: item.type as 'income' | 'expense',
        amount: Number(item.amount),
        currency: item.currency as 'IDR' | 'USD',
        category: item.category,
        description: item.description || '',
        date: new Date(item.date).toISOString().split('T')[0],
        icon: getCategoryIcon(item.category)
      }));
      
      setTransactions(formattedTransactions);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, timeFilter, categoryFilter, isPremium, toast]);

  // Get category icon
  const getCategoryIcon = (category: string): string => {
    const categoryIcons: Record<string, string> = {
      'food': '🍔',
      'shopping': '🛍️',
      'entertainment': '🎮',
      'bills': '🧾',
      'salary': '💰',
      'transport': '🚗',
      'health': '💊',
      'education': '📚',
      'other': '💸'
    };
    
    return categoryIcons[category.toLowerCase()] || '💸';
  };
  
  // Set up real-time transaction subscription
  useEffect(() => {
    if (!user) return;
    
    // Initial fetch
    fetchTransactions();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('transactions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Transaction change detected:', payload);
          
          // Handle different types of changes
          if (payload.eventType === 'INSERT') {
            // Add new transaction to the list
            const newTransaction = payload.new;
            const formattedTransaction = {
              id: newTransaction.id,
              type: newTransaction.type as 'income' | 'expense',
              amount: Number(newTransaction.amount),
              currency: newTransaction.currency as 'IDR' | 'USD',
              category: newTransaction.category,
              description: newTransaction.description || '',
              date: new Date(newTransaction.date).toISOString().split('T')[0],
              icon: getCategoryIcon(newTransaction.category)
            };
            
            setTransactions(prev => [formattedTransaction, ...prev]);
            toast({
              title: "Transaction Added",
              description: "Your transaction has been successfully added.",
            });
          } 
          else if (payload.eventType === 'DELETE') {
            // Remove deleted transaction from the list
            setTransactions(prev => prev.filter(t => t.id !== payload.old.id));
            toast({
              title: "Transaction Deleted",
              description: "Your transaction has been successfully removed.",
            });
          }
          else if (payload.eventType === 'UPDATE') {
            // Update the modified transaction in the list
            const updatedTransaction = payload.new;
            const formattedTransaction = {
              id: updatedTransaction.id,
              type: updatedTransaction.type as 'income' | 'expense',
              amount: Number(updatedTransaction.amount),
              currency: updatedTransaction.currency as 'IDR' | 'USD',
              category: updatedTransaction.category,
              description: updatedTransaction.description || '',
              date: new Date(updatedTransaction.date).toISOString().split('T')[0],
              icon: getCategoryIcon(updatedTransaction.category)
            };
            
            setTransactions(prev => 
              prev.map(t => t.id === updatedTransaction.id ? formattedTransaction : t)
            );
            toast({
              title: "Transaction Updated",
              description: "Your transaction has been successfully updated.",
            });
          }
        }
      )
      .subscribe();
    
    // Cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchTransactions]);

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return {
    transactions: filteredTransactions,
    isLoading,
    searchQuery,
    setSearchQuery,
    timeFilter,
    setTimeFilter,
    categoryFilter,
    setCategoryFilter,
    refreshTransactions: fetchTransactions
  };
};
