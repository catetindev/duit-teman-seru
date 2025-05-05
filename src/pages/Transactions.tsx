
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AddTransactionDialog from '@/components/dashboard/AddTransactionDialog';
import TransactionHeader from '@/components/transactions/TransactionHeader';
import TransactionLayout from '@/components/transactions/TransactionLayout';
import { useTransactions } from '@/hooks/useTransactions';

export default function Transactions() {
  const { isPremium } = useAuth();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const {
    transactions,
    isLoading,
    searchQuery,
    setSearchQuery,
    timeFilter,
    setTimeFilter,
    categoryFilter,
    setCategoryFilter,
    refreshTransactions
  } = useTransactions();

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="p-4 md:p-6 space-y-6">
        <TransactionHeader 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onAddTransaction={() => setIsAddDialogOpen(true)}
        />

        <TransactionLayout 
          transactions={transactions}
          isPremium={isPremium}
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          isLoading={isLoading}
          onUpdate={refreshTransactions}
        />
      </div>
      
      <AddTransactionDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onTransactionAdded={refreshTransactions}
      />
    </DashboardLayout>
  );
}
