
import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TransactionList from '@/components/ui/TransactionList';
import { PlusCircle, ChevronRight, TrendingUp } from 'lucide-react';
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
    <Card className="bg-white/70 backdrop-blur-sm border-0 rounded-2xl overflow-hidden">
      <CardHeader className="pb-4 border-b border-slate-100/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold flex items-center text-slate-900">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-3">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            Recent Transactions
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-slate-200 hover:bg-slate-50 rounded-xl"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <PlusCircle size={16} />
            <span className="hidden sm:inline">Add Transaction</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="all" className="w-full">
          <div className="px-6 pt-4">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100/50 rounded-xl">
              <TabsTrigger value="all" className="rounded-lg">All</TabsTrigger>
              <TabsTrigger value="income" className="rounded-lg">Income</TabsTrigger>
              <TabsTrigger value="expense" className="rounded-lg">Expenses</TabsTrigger>
            </TabsList>
          </div>
          
          {loading ? (
            <div className="py-12 px-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">Loading transactions...</p>
            </div>
          ) : (
            <div className="px-6 py-4">
              <TabsContent value="all" className="mt-0">
                <TransactionList transactions={transactions.slice(0, 5)} />
              </TabsContent>
              <TabsContent value="income" className="mt-0">
                <TransactionList transactions={incomeTransactions.slice(0, 5)} />
              </TabsContent>
              <TabsContent value="expense" className="mt-0">
                <TransactionList transactions={expenseTransactions.slice(0, 5)} />
              </TabsContent>
            </div>
          )}
          
          <div className="bg-slate-50/50 px-6 py-4 border-t border-slate-100/50">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-center hover:bg-slate-100 rounded-xl"
              asChild
            >
              <a href="/transactions" className="flex items-center">
                View All Transactions
                <ChevronRight size={16} className="ml-1" />
              </a>
            </Button>
          </div>
        </Tabs>

        <AddTransactionDialog 
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onTransactionAdded={onTransactionAdded}
        />
      </CardContent>
    </Card>
  );
};

export default React.memo(TransactionsSection);
