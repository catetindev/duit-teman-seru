
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import TransactionList from '@/components/transactions/TransactionList';
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

interface TransactionTabsProps {
  transactions: TransactionData[];
  isLoading: boolean;
  onUpdate: () => void;
}

const TransactionTabs = ({ transactions, isLoading, onUpdate }: TransactionTabsProps) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full md:w-auto mb-4 grid grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="income">{t('transactions.income')}</TabsTrigger>
          <TabsTrigger value="expense">{t('transactions.expense')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <TransactionList 
            transactions={transactions}
            isLoading={isLoading}
            onUpdate={onUpdate}
          />
        </TabsContent>
        
        <TabsContent value="income">
          <TransactionList 
            transactions={transactions.filter(t => t.type === 'income')}
            isLoading={isLoading}
            onUpdate={onUpdate}
          />
        </TabsContent>
        
        <TabsContent value="expense">
          <TransactionList 
            transactions={transactions.filter(t => t.type === 'expense')}
            isLoading={isLoading}
            onUpdate={onUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransactionTabs;
