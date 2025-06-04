
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
  is_business?: boolean;
}

export const useTransactions = (isBusinessMode: boolean = false) => {
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('month');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const fetchTransactions = useCallback(async () => {
    if (!user) {
      console.log('useTransactions: No user found');
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('useTransactions: Fetching transactions for user:', user.id, 'Business mode:', isBusinessMode);
      
      // Build query based on filters and business mode
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_business', isBusinessMode)
        .order('date', { ascending: false });
      
      console.log('useTransactions: Query filters - user_id:', user.id, 'is_business:', isBusinessMode);
      
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
        console.error('useTransactions: Database error:', error);
        throw error;
      }
      
      console.log('useTransactions: Fetched raw data:', data);
      
      // Format transactions
      const formattedTransactions = (data || []).map(item => ({
        id: item.id,
        type: item.type as 'income' | 'expense',
        amount: Number(item.amount),
        currency: item.currency as 'IDR' | 'USD',
        category: item.category,
        description: item.description || '',
        date: new Date(item.date).toISOString().split('T')[0],
        icon: getCategoryIcon(item.category),
        is_business: item.is_business || false
      }));
      
      console.log('useTransactions: Formatted transactions:', formattedTransactions);
      setTransactions(formattedTransactions);
    } catch (error: any) {
      console.error('useTransactions: Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, timeFilter, categoryFilter, isPremium, isBusinessMode, toast]);

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
      'Business': '💼',
      'other': '💸'
    };
    
    return categoryIcons[category] || '💸';
  };
  
  // Set up real-time transaction subscription
  useEffect(() => {
    if (!user) {
      console.log('useTransactions: No user for subscription');
      return;
    }
    
    console.log('useTransactions: Setting up subscription and initial fetch');
    
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
          console.log('useTransactions: Transaction change detected:', payload);
          
          // Handle different types of changes
          if (payload.eventType === 'INSERT') {
            // Add new transaction to the list if it matches current mode
            const newTransaction = payload.new;
            if (newTransaction.is_business === isBusinessMode) {
              const formattedTransaction = {
                id: newTransaction.id,
                type: newTransaction.type as 'income' | 'expense',
                amount: Number(newTransaction.amount),
                currency: newTransaction.currency as 'IDR' | 'USD',
                category: newTransaction.category,
                description: newTransaction.description || '',
                date: new Date(newTransaction.date).toISOString().split('T')[0],
                icon: getCategoryIcon(newTransaction.category),
                is_business: newTransaction.is_business || false
              };
              
              setTransactions(prev => [formattedTransaction, ...prev]);
              toast({
                title: "Transaction Added",
                description: `Your ${isBusinessMode ? 'business' : 'personal'} transaction has been successfully added.`,
              });
            }
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
            // Update the modified transaction in the list if it matches current mode
            const updatedTransaction = payload.new;
            if (updatedTransaction.is_business === isBusinessMode) {
              const formattedTransaction = {
                id: updatedTransaction.id,
                type: updatedTransaction.type as 'income' | 'expense',
                amount: Number(updatedTransaction.amount),
                currency: updatedTransaction.currency as 'IDR' | 'USD',
                category: updatedTransaction.category,
                description: updatedTransaction.description || '',
                date: new Date(updatedTransaction.date).toISOString().split('T')[0],
                icon: getCategoryIcon(updatedTransaction.category),
                is_business: updatedTransaction.is_business || false
              };
              
              setTransactions(prev => 
                prev.map(t => t.id === updatedTransaction.id ? formattedTransaction : t)
              );
              toast({
                title: "Transaction Updated",
                description: "Your transaction has been successfully updated.",
              });
            } else {
              // Transaction moved to different mode, remove from current list
              setTransactions(prev => prev.filter(t => t.id !== updatedTransaction.id));
            }
          }
        }
      )
      .subscribe();
    
    // Cleanup function
    return () => {
      console.log('useTransactions: Cleaning up subscription');
      supabase.removeChannel(channel);
    };
  }, [user, fetchTransactions, isBusinessMode]);

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
