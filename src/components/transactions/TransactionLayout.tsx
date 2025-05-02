
import React from 'react';
import TransactionChart from '@/components/transactions/TransactionChart';
import TransactionFilters from '@/components/transactions/TransactionFilters';
import TransactionTabs from '@/components/transactions/TransactionTabs';

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

interface TransactionLayoutProps {
  transactions: TransactionData[];
  isPremium: boolean;
  timeFilter: string;
  setTimeFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  isLoading: boolean;
  onUpdate: () => void;
}

const TransactionLayout = ({
  transactions,
  isPremium,
  timeFilter,
  setTimeFilter,
  categoryFilter,
  setCategoryFilter,
  isLoading,
  onUpdate
}: TransactionLayoutProps) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <TransactionFilters 
          isPremium={isPremium} 
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
        />
        
        <TransactionTabs
          transactions={transactions}
          isLoading={isLoading} 
          onUpdate={onUpdate}
        />
      </div>
      
      <div>
        <TransactionChart transactions={transactions} />
      </div>
    </div>
  );
};

export default TransactionLayout;
