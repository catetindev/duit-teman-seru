
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
import OnboardingTour from '@/components/onboarding/OnboardingTour';
import EntrepreneurOnboardingTour from '@/components/onboarding/EntrepreneurOnboardingTour';
import { mockBadges } from '@/components/dashboard/DashboardData';
import { useEntrepreneurMode } from '@/hooks/useEntrepreneurMode';
import { EntrepreneurModeToggle } from '@/components/entrepreneur/EntrepreneurModeToggle';
import { EntrepreneurDashboard } from '@/components/entrepreneur/EntrepreneurDashboard';
import { useState } from 'react';
import AddTransactionDialog from '@/components/dashboard/AddTransactionDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import PricingModal from '@/components/pricing/PricingModal';
import { useDashboardData } from '@/hooks/useDashboardData';
import { motion } from 'framer-motion';

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

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={fadeIn}
    >
      <DashboardLayout isPremium={isPremium}>
        <OnboardingTour />
        {isEntrepreneurMode && isPremium && <EntrepreneurOnboardingTour />}
        
        <motion.div className="space-y-6" variants={staggerContainer}>
          {/* Header Section - Simplified and cleaner */}
          <motion.div className="space-y-4" variants={fadeIn}>
            {isMobile ? (
              <div className="space-y-3">
                <div data-tour="dashboard-greeting">
                  <DashboardHeader isPremium={isPremium} onUpgradeClick={handleUpgradeClick} />
                </div>
                <div>
                  <EntrepreneurModeToggle />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <EntrepreneurModeToggle />
                  <div data-tour="dashboard-greeting" className="space-y-1">
                    <DashboardHeader isPremium={isPremium} onUpgradeClick={handleUpgradeClick} />
                  </div>
                </div>
              </div>
            )}
          
            {/* Mode indicator - Modern badge */}
            <motion.div 
              className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 dark:from-blue-900/20 dark:to-indigo-900/20 dark:text-blue-400 border border-blue-100 dark:border-blue-800 shadow-sm"
              variants={fadeIn}
            >
              <span className="mr-2">{isEntrepreneurMode ? '💼' : '👤'}</span>
              {isEntrepreneurMode ? 'Business Mode' : 'Personal Mode'}
            </motion.div>
          </motion.div>

          {/* Dashboard Content */}
          {isEntrepreneurMode && isPremium ? (
            <motion.div variants={fadeIn}>
              <EntrepreneurDashboard 
                onAddIncome={handleAddBusinessIncome}
                onAddExpense={handleAddBusinessExpense}
              />
            </motion.div>
          ) : (
            <motion.div className="space-y-6" variants={staggerContainer}>
              <motion.div data-tour="income-expense-cards" variants={fadeIn}>
                <StatCardsSection 
                  stats={stats} 
                  loading={loading.stats} 
                />
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div className="lg:col-span-2 space-y-6" variants={fadeIn}>
                  <div data-tour="add-transaction">
                    <TransactionsSection 
                      transactions={transactions} 
                      onTransactionAdded={refreshData}
                      loading={loading.transactions} 
                    />
                  </div>
                  
                  {isPremium && <BudgetsSection isPremium={isPremium} />}
                </motion.div>
                
                <motion.div className="space-y-6" variants={fadeIn}>
                  <div data-tour="goals-section">
                    <GoalsSection 
                      goals={goals}
                      isPremium={isPremium}
                      onGoalAdded={refreshData}
                      loading={loading.goals}
                      onUpgradeClick={handleUpgradeClick}
                    />
                  </div>
                  
                  {isPremium && <BadgesSection badges={mockBadges} />}
                </motion.div>
              </div>
            </motion.div>
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
        </motion.div>
      </DashboardLayout>
    </motion.div>
  );
};

export default Dashboard;
