
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
  
  // Memoize fetchTransactions to avoid recreation on every render
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
      
      if (error) throw error;
      
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
      
      console.log('Fetched transactions:', formattedTransactions.length);
      setTransactions(formattedTransactions);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, isPremium, timeFilter, categoryFilter, toast]);

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
  
  // Set up real-time subscription with manual refresh as backup
  useEffect(() => {
    if (!user) return;
    
    // Initial fetch
    fetchTransactions();
    
    console.log('Setting up real-time subscription for transactions');
    
    // Set up real-time subscription
    const channel = supabase
      .channel('public:transactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user?.id}`,
        },
        (payload) => {
          console.log('Transaction change detected:', payload);
          fetchTransactions(); // Refresh data on any change
        }
      )
      .subscribe();
    
    // Cleanup subscription on unmount  
    return () => {
      console.log('Cleaning up transaction subscription');
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
