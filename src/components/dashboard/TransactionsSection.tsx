
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
  
  const incomeTransactions = useMemo(() => 
    transactions.filter(t => t.type === 'income'),
    [transactions]
  );
  
  const expenseTransactions = useMemo(() => 
    transactions.filter(t => t.type === 'expense'),
    [transactions]
  );
  
  return (
    <Card className="bg-white border border-slate-200">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center text-slate-900">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            Recent Transactions
          </CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 border-slate-200 hover:bg-slate-50"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <PlusCircle size={16} />
            <span className="hidden sm:inline">Add Transaction</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="all" className="w-full">
          <div className="px-4 pt-3">
            <TabsList className="grid w-full grid-cols-3 bg-slate-100">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expense">Expenses</TabsTrigger>
            </TabsList>
          </div>
          
          {loading ? (
            <div className="py-8 px-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-3"></div>
              <p className="text-sm text-slate-500">Loading transactions...</p>
            </div>
          ) : (
            <div className="px-4 py-3">
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
          
          <div className="bg-slate-50 px-4 py-3 border-t border-slate-100">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full justify-center hover:bg-slate-100"
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
