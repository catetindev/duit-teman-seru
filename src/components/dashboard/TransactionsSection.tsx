
import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import TransactionList from '@/components/ui/TransactionList';
import { PlusCircle, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddTransactionDialog from './AddTransactionDialog';
import { Transaction } from '@/components/dashboard/DashboardData';

interface TransactionsSectionProps {
  transactions: Transaction[];
  onTransactionAdded: () => void;
  loading?: boolean;
}

const TransactionsSection = ({ transactions, onTransactionAdded, loading = false }: TransactionsSectionProps) => {
  const { t } = useLanguage();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Memoize filtered transactions to prevent unnecessary rerenders
  const incomeTransactions = useMemo(() => 
    transactions.filter(t => t.type === 'income'),
    [transactions]
  );
  
  const expenseTransactions = useMemo(() => 
    transactions.filter(t => t.type === 'expense'),
    [transactions]
  );
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{t('transactions.title')}</h2>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          onClick={() => setIsAddDialogOpen(true)}
        >
          <PlusCircle size={16} />
          <span>Add Transaction</span>
        </Button>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="income">{t('transactions.income')}</TabsTrigger>
          <TabsTrigger value="expense">{t('transactions.expense')}</TabsTrigger>
        </TabsList>
        
        {loading ? (
          <div className="py-10 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-sm text-muted-foreground">Loading your transactions...</p>
          </div>
        ) : (
          <>
            <TabsContent value="all">
              <TransactionList transactions={transactions} onUpdate={onTransactionAdded} />
            </TabsContent>
            <TabsContent value="income">
              <TransactionList transactions={incomeTransactions} onUpdate={onTransactionAdded} />
            </TabsContent>
            <TabsContent value="expense">
              <TransactionList transactions={expenseTransactions} onUpdate={onTransactionAdded} />
            </TabsContent>
          </>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-4"
          asChild
        >
          <a href="/transactions">
            View all transactions
            <ChevronRight size={16} className="ml-1" />
          </a>
        </Button>
      </Tabs>

      <AddTransactionDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onTransactionAdded={onTransactionAdded}
      />
    </div>
  );
};

export default React.memo(TransactionsSection);
