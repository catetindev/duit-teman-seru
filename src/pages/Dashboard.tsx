
import React, { useEffect } from 'react';
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
import { useDashboardData } from '@/hooks/useDashboardData';
import { mockBadges } from '@/components/dashboard/DashboardData';

const Dashboard = () => {
  const { type } = useParams();
  const { isPremium } = useAuth();
  const { t } = useLanguage();
  const { 
    transactions, 
    goals, 
    stats, 
    loading, 
    refreshData 
  } = useDashboardData();

  return (
    <DashboardLayout isPremium={isPremium}>
      <DashboardHeader isPremium={isPremium} />
      
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
          {/* Only render GoalsSection when goals are available or loading */}
          <GoalsSection 
            goals={goals}
            isPremium={isPremium}
            onGoalAdded={refreshData}
            loading={loading.goals}
          />
          
          {isPremium && <BadgesSection badges={mockBadges} />}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
