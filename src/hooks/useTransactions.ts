
import { useState, useEffect } from 'react';
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
  
  const fetchTransactions = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
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
  };

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
  
  // Fetch transactions initially and set up real-time subscription
  useEffect(() => {
    if (!user) return;
    
    fetchTransactions();
    
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
          fetchTransactions(); // Refresh data on any change
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, timeFilter, categoryFilter]);

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
