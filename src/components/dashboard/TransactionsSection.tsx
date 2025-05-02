
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import TransactionList from '@/components/ui/TransactionList';
import { PlusCircle, ChevronRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  currency: 'IDR' | 'USD';
  category: string;
  description: string;
  date: string;
  icon?: string;
}

interface TransactionsSectionProps {
  transactions: Transaction[];
}

const TransactionsSection = ({ transactions }: TransactionsSectionProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{t('transactions.title')}</h2>
        <Button variant="outline" size="sm" className="gap-1">
          <PlusCircle size={16} />
          <span>{t('transactions.add')}</span>
        </Button>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="income">{t('transactions.income')}</TabsTrigger>
          <TabsTrigger value="expense">{t('transactions.expense')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <TransactionList transactions={transactions} />
        </TabsContent>
        <TabsContent value="income">
          <TransactionList 
            transactions={transactions.filter(t => t.type === 'income')} 
          />
        </TabsContent>
        <TabsContent value="expense">
          <TransactionList 
            transactions={transactions.filter(t => t.type === 'expense')} 
          />
        </TabsContent>
      </Tabs>
      
      <Button variant="ghost" size="sm" className="w-full mt-4">
        View all transactions
        <ChevronRight size={16} className="ml-1" />
      </Button>
    </div>
  );
};

export default TransactionsSection;
