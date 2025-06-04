import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, ArrowRight, Target, PlusCircle } from 'lucide-react';
const Dashboard = () => {
  const {
    type
  } = useParams();
  const navigate = useNavigate();
  const {
    isPremium,
    user
  } = useAuth();
  const {
    t
  } = useLanguage();
  const {
    isEntrepreneurMode
  } = useEntrepreneurMode();
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
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };
  return <DashboardLayout isPremium={isPremium}>
      <OnboardingTour />
      {isEntrepreneurMode && isPremium && <EntrepreneurOnboardingTour />}
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
          {/* Header Section - Inspired by the course platform */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-4">
                <EntrepreneurModeToggle />
                <div className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-white/80 backdrop-blur-sm border border-slate-200">
                  <span className="mr-2">{isEntrepreneurMode ? '💼' : '👤'}</span>
                  {isEntrepreneurMode ? 'Business Mode' : 'Personal Mode'}
                </div>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
                {getGreeting()}, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}!
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl">
                {isEntrepreneurMode ? 'Manage your business finances and track your entrepreneurial journey' : 'Track your personal finances and achieve your financial goals'}
              </p>
            </div>
            
            {/* Profile Section */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                
                
              </div>
              
            </div>
          </div>

          {/* Hero Banner - Similar to course platform */}
          <Card className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 border-0 rounded-3xl">
            
          </Card>

          {/* Dashboard Content */}
          {isEntrepreneurMode && isPremium ? <div className="space-y-8">
              <EntrepreneurDashboard onAddIncome={handleAddBusinessIncome} onAddExpense={handleAddBusinessExpense} />
            </div> : <div className="space-y-8">
              {/* Stats Cards */}
              <div data-tour="income-expense-cards">
                <StatCardsSection stats={stats} loading={loading.stats} />
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div data-tour="add-transaction">
                    <TransactionsSection transactions={transactions} onTransactionAdded={refreshData} loading={loading.transactions} />
                  </div>
                  
                  {isPremium && <BudgetsSection isPremium={isPremium} />}
                </div>
                
                <div className="space-y-8">
                  <div data-tour="goals-section">
                    <GoalsSection goals={goals} isPremium={isPremium} onGoalAdded={refreshData} loading={loading.goals} onUpgradeClick={handleUpgradeClick} />
                  </div>
                  
                  {isPremium && <BadgesSection badges={mockBadges} />}
                </div>
              </div>
            </div>}

          <AddTransactionDialog isOpen={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)} onTransactionAdded={refreshData} initialCategory={transactionCategory} initialType={transactionType} />
          
          <PricingModal open={isPricingModalOpen} onOpenChange={setIsPricingModalOpen} />
        </div>
      </div>
    </DashboardLayout>;
};
export default Dashboard;