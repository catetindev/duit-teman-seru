
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Package, ShoppingCart } from 'lucide-react';

const Dashboard = () => {
  const { type } = useParams();
  const navigate = useNavigate();
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

  // Quick navigation cards for business features
  const QuickNavCard = ({ title, description, icon, onClick, gradient }: any) => (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-white/70 backdrop-blur-sm border-0 shadow-md hover:scale-105"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`h-12 w-12 rounded-xl ${gradient} flex items-center justify-center`}>
            {icon}
          </div>
          <div>
            <h3 className="font-bold text-slate-800">{title}</h3>
            <p className="text-sm text-slate-600">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout isPremium={isPremium}>
      <OnboardingTour />
      {isEntrepreneurMode && isPremium && <EntrepreneurOnboardingTour />}
      
      <div className="space-y-6">
        {/* Header Section - Simplified and cleaner */}
        <div className="space-y-4">
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
        
          {/* Mode indicator - Clean badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <span className="mr-2">{isEntrepreneurMode ? '💼' : '👤'}</span>
            {isEntrepreneurMode ? 'Mode Bisnis' : 'Mode Personal'}
          </div>
        </div>

        {/* Dashboard Content */}
        {isEntrepreneurMode && isPremium ? (
          <div className="space-y-6">
            <EntrepreneurDashboard 
              onAddIncome={handleAddBusinessIncome}
              onAddExpense={handleAddBusinessExpense}
            />
            
            {/* Quick Navigation for Business Features */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  🚀 Fitur Bisnis
                </CardTitle>
                <p className="text-slate-600">Akses cepat ke fitur utama bisnis Anda</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <QuickNavCard
                    title="👥 Kelola Pelanggan"
                    description="Lihat & tambah data pelanggan"
                    icon={<Users className="h-6 w-6 text-white" />}
                    gradient="bg-gradient-to-r from-blue-500 to-indigo-500"
                    onClick={() => navigate('/customers')}
                  />
                  
                  <QuickNavCard
                    title="📦 Kelola Produk"
                    description="Atur produk & layanan"
                    icon={<Package className="h-6 w-6 text-white" />}
                    gradient="bg-gradient-to-r from-green-500 to-emerald-500"
                    onClick={() => navigate('/products')}
                  />
                  
                  <QuickNavCard
                    title="🛒 Pesanan & Transaksi"
                    description="Kelola order dan transaksi"
                    icon={<ShoppingCart className="h-6 w-6 text-white" />}
                    gradient="bg-gradient-to-r from-purple-500 to-pink-500"
                    onClick={() => navigate('/orders')}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <div data-tour="income-expense-cards">
              <StatCardsSection 
                stats={stats} 
                loading={loading.stats} 
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div data-tour="add-transaction">
                  <TransactionsSection 
                    transactions={transactions} 
                    onTransactionAdded={refreshData}
                    loading={loading.transactions} 
                  />
                </div>
                
                {isPremium && <BudgetsSection isPremium={isPremium} />}
              </div>
              
              <div className="space-y-6">
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
              </div>
            </div>
          </div>
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
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
