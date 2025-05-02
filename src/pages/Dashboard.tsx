
import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useLanguage } from '@/hooks/useLanguage';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCardsSection from '@/components/dashboard/StatCardsSection';
import TransactionsSection from '@/components/dashboard/TransactionsSection';
import BudgetsSection from '@/components/dashboard/BudgetsSection';
import GoalsSection from '@/components/dashboard/GoalsSection';
import BadgesSection from '@/components/dashboard/BadgesSection';
import { 
  mockTransactions, 
  mockGoals, 
  premiumGoals, 
  mockBudgets, 
  mockBadges 
} from '@/components/dashboard/DashboardData';

const Dashboard = () => {
  const { type } = useParams();
  const isPremium = type === 'premium';
  const { t } = useLanguage();

  return (
    <DashboardLayout isPremium={isPremium}>
      <DashboardHeader isPremium={isPremium} />
      <StatCardsSection />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <TransactionsSection transactions={mockTransactions} />
          {isPremium && <BudgetsSection budgets={mockBudgets} isPremium={isPremium} />}
        </div>
        
        <div className="space-y-8">
          <GoalsSection 
            goals={isPremium ? premiumGoals : mockGoals} 
            isPremium={isPremium} 
          />
          
          {isPremium && <BadgesSection badges={mockBadges} />}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
