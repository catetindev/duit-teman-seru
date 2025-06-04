
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AddTransactionDialog from '@/components/dashboard/AddTransactionDialog';
import TransactionHeader from '@/components/transactions/TransactionHeader';
import TransactionLayout from '@/components/transactions/TransactionLayout';
import { useTransactions } from '@/hooks/useTransactions';
import { useLanguage } from '@/hooks/useLanguage';
import { useEntrepreneurMode } from '@/hooks/useEntrepreneurMode';

export default function Transactions() {
  const { isPremium } = useAuth();
  const { t } = useLanguage();
  const { isEntrepreneurMode } = useEntrepreneurMode();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Always show transactions based on the current mode
  const {
    transactions,
    isLoading,
    searchQuery,
    setSearchQuery,
    timeFilter,
    setTimeFilter,
    categoryFilter,
    setCategoryFilter
  } = useTransactions(isEntrepreneurMode);

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">
              {isEntrepreneurMode ? 'Business Transactions' : 'Personal Transactions'}
            </h1>
            <p className="text-muted-foreground text-lg">
              {isEntrepreneurMode 
                ? 'View and manage your business financial transactions' 
                : 'View and manage your personal financial transactions'
              }
            </p>
          </div>
          <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
            {isEntrepreneurMode ? '💼 Business Mode' : '👤 Personal Mode'}
          </div>
        </div>

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
          onUpdate={() => {}} // The real-time updates handle this now
        />
      </div>
      
      <AddTransactionDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onTransactionAdded={() => {}} // Real-time updates handle this now
      />
    </DashboardLayout>
  );
}
