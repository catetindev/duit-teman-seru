
import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCardsSection from '@/components/dashboard/StatCardsSection';
import TransactionsSection from '@/components/dashboard/TransactionsSection';
import BudgetsSection from '@/components/dashboard/BudgetsSection';
import GoalsSection from '@/components/dashboard/GoalsSection';
import BadgesSection from '@/components/dashboard/BadgesSection';
import { mockBadges } from '@/components/dashboard/DashboardData';
import { useEntrepreneurMode } from '@/hooks/useEntrepreneurMode';
import { EntrepreneurModeToggle } from '@/components/entrepreneur/EntrepreneurModeToggle';
import { EntrepreneurDashboard } from '@/components/entrepreneur/EntrepreneurDashboard';
import { useState } from 'react';
import AddTransactionDialog from '@/components/dashboard/AddTransactionDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import PricingModal from '@/components/pricing/PricingModal';
import { useDashboardData } from '@/hooks/useDashboardData'; // Fix the import

const Dashboard = () => {
  const { type } = useParams();
  const { isPremium } = useAuth();
  const { t } = useLanguage();
  const { isEntrepreneurMode } = useEntrepreneurMode();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);
  const [transactionCategory, setTransactionCategory] = useState('');
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const isMobile = useIsMobile();
  
  const { 
    transactions, 
    goals, 
    stats, 
    loading, 
    refreshData 
  } = useDashboardData();

  const handleAddBusinessIncome = () => {
    setTransactionType('income');
    setTransactionCategory('Business');
    setIsAddDialogOpen(true);
  };

  const handleAddBusinessExpense = () => {
    setTransactionType('expense');
    setTransactionCategory('Business');
    setIsAddDialogOpen(true);
  };

  const handleUpgradeClick = () => {
    setIsPricingModalOpen(true);
  };

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="mb-6">
        {isMobile ? (
          <>
            <DashboardHeader isPremium={isPremium} onUpgradeClick={handleUpgradeClick} />
            <div className="mt-3">
              <EntrepreneurModeToggle />
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <EntrepreneurModeToggle />
            <DashboardHeader isPremium={isPremium} onUpgradeClick={handleUpgradeClick} />
          </div>
        )}
      </div>
      
      {isEntrepreneurMode && isPremium ? (
        // Entrepreneur Mode Dashboard (premium only)
        <EntrepreneurDashboard 
          onAddIncome={handleAddBusinessIncome}
          onAddExpense={handleAddBusinessExpense}
        />
      ) : (
        // Regular Dashboard
        <>
          <StatCardsSection 
            stats={stats} 
            loading={loading.stats} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <TransactionsSection 
                transactions={transactions} 
                onTransactionAdded={refreshData}
                loading={loading.transactions} 
              />
              
              {isPremium && <BudgetsSection isPremium={isPremium} />}
            </div>
            
            <div className="space-y-8">
              <GoalsSection 
                goals={goals}
                isPremium={isPremium}
                onGoalAdded={refreshData}
                loading={loading.goals}
                onUpgradeClick={handleUpgradeClick}
              />
              
              {isPremium && <BadgesSection badges={mockBadges} />}
            </div>
          </div>
        </>
      )}

      <AddTransactionDialog 
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onTransactionAdded={refreshData}
        initialCategory={transactionCategory}
        initialType={transactionType}
      />
      
      <PricingModal 
        open={isPricingModalOpen}
        onOpenChange={setIsPricingModalOpen}
      />
    </DashboardLayout>
  );
  
  function handleAddBusinessIncome() {
    setTransactionType('income');
    setTransactionCategory('Business');
    setIsAddDialogOpen(true);
  }

  function handleAddBusinessExpense() {
    setTransactionType('expense');
    setTransactionCategory('Business');
    setIsAddDialogOpen(true);
  }

  function handleUpgradeClick() {
    setIsPricingModalOpen(true);
  }
};

export default Dashboard;
