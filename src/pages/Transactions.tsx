
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import TransactionList from '@/components/transactions/TransactionList';
import TransactionFilters from '@/components/transactions/TransactionFilters';
import TransactionChart from '@/components/transactions/TransactionChart';
import { PlusCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AddTransactionDialog from '@/components/dashboard/AddTransactionDialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TransactionData {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  currency: 'IDR' | 'USD';
  category: string;
  description: string;
  date: string;
  icon?: string;
}

export default function Transactions() {
  const { t } = useLanguage();
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('month');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Fetch transactions from Supabase
  useEffect(() => {
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
  }, [user, timeFilter, categoryFilter, toast]);

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const handleTransactionAdded = () => {
    // No need to do anything here as the real-time subscription will update the transactions
    setIsAddDialogOpen(false);
  };

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold">{t('nav.transactions')}</h1>
          
          <div className="w-full md:w-auto flex flex-col md:flex-row gap-3">
            <div className="relative w-full md:w-60">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                placeholder="Search Transactions"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>
            
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add Transaction
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TransactionFilters 
              isPremium={isPremium} 
              timeFilter={timeFilter}
              setTimeFilter={setTimeFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
            />
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full md:w-auto mb-4 grid grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="income">{t('transactions.income')}</TabsTrigger>
                  <TabsTrigger value="expense">{t('transactions.expense')}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <TransactionList 
                    transactions={filteredTransactions}
                    isLoading={isLoading} 
                  />
                </TabsContent>
                
                <TabsContent value="income">
                  <TransactionList 
                    transactions={filteredTransactions.filter(t => t.type === 'income')}
                    isLoading={isLoading}
                  />
                </TabsContent>
                
                <TabsContent value="expense">
                  <TransactionList 
                    transactions={filteredTransactions.filter(t => t.type === 'expense')}
                    isLoading={isLoading}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          <div>
            <TransactionChart transactions={transactions} />
          </div>
        </div>
      </div>
      
      <AddTransactionDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onTransactionAdded={handleTransactionAdded}
      />
    </DashboardLayout>
  );
}
