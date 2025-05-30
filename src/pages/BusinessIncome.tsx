
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AddTransactionDialog from '@/components/dashboard/AddTransactionDialog';
import TransactionHeader from '@/components/transactions/TransactionHeader';
import TransactionLayout from '@/components/transactions/TransactionLayout';
import { useTransactions } from '@/hooks/useTransactions';
import { useLanguage } from '@/hooks/useLanguage';
import { useEntrepreneurMode } from '@/hooks/useEntrepreneurMode';
import { Card, CardContent } from '@/components/ui/card';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function BusinessIncome() {
  const { isPremium } = useAuth();
  const { t } = useLanguage();
  const { isEntrepreneurMode } = useEntrepreneurMode();
  const navigate = useNavigate();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  // Filter transactions based on business mode and income type
  const {
    transactions,
    isLoading,
    searchQuery,
    setSearchQuery,
    timeFilter,
    setTimeFilter,
    categoryFilter,
    setCategoryFilter
  } = useTransactions(true); // true = business mode

  // Filter only income transactions
  const incomeTransactions = transactions.filter(t => t.type === 'income');

  if (!isEntrepreneurMode || !isPremium) {
    return (
      <DashboardLayout isPremium={isPremium}>
        <div className="flex items-center justify-center min-h-[60vh] p-6">
          <Card className="w-full max-w-md">
            <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
                <Lock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Business Income</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {!isPremium 
                  ? "Premium subscription and entrepreneur mode required to access business income."
                  : "Entrepreneur mode required to access business income."
                }
              </p>
              {!isPremium && (
                <Button 
                  onClick={() => navigate('/pricing')}
                  className="w-full"
                >
                  Upgrade to Premium
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className="flex-shrink-0 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Business Income</h1>
                <p className="text-muted-foreground">
                  Track and manage your business income transactions
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800">
                  <span className="mr-1.5">💼</span>
                  Business Income
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Search and Add Section */}
            <TransactionHeader 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onAddTransaction={() => setIsAddDialogOpen(true)}
              addButtonText="Add Business Income"
            />

            {/* Transactions List */}
            <div className="min-h-0">
              <TransactionLayout 
                transactions={incomeTransactions}
                isPremium={isPremium}
                timeFilter={timeFilter}
                setTimeFilter={setTimeFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                isLoading={isLoading}
                onUpdate={() => {}} // Real-time updates handle this
              />
            </div>
          </div>
        </div>
      </div>
      
      <AddTransactionDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onTransactionAdded={() => {}} // Real-time updates handle this
        initialType="income"
        initialCategory="Business"
      />
    </DashboardLayout>
  );
}
