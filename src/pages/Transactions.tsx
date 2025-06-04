
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
  
  // Show transactions based on the current mode - this fixes the personal mode bug
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
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                {isEntrepreneurMode ? 'Business Transactions' : 'Personal Transactions'}
              </h1>
              <p className="text-base text-slate-600">
                {isEntrepreneurMode 
                  ? 'View and manage your business financial transactions' 
                  : 'View and manage your personal financial transactions'
                }
              </p>
            </div>
            <div className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-white border border-slate-200">
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
            onUpdate={() => {}}
          />
        </div>
      </div>
      
      <AddTransactionDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onTransactionAdded={() => {}}
      />
    </DashboardLayout>
  );
}
