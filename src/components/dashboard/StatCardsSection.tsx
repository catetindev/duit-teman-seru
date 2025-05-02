
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import StatCard from '@/components/ui/StatCard';
import { PiggyBank, CreditCard } from 'lucide-react';
import { DashboardStats, formatCurrency } from '@/hooks/useDashboardData';

interface StatCardsSectionProps {
  stats: DashboardStats;
  loading?: boolean;
}

const StatCardsSection = ({ stats, loading = false }: StatCardsSectionProps) => {
  const { t } = useLanguage();
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </div>
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatCard 
        title={t('dashboard.balance')}
        value={formatCurrency(stats.balance, stats.currency)}
        icon={<PiggyBank size={20} className="text-teal-500" />}
      />
      <StatCard 
        title={t('dashboard.income')}
        value={formatCurrency(stats.income, stats.currency)}
        icon={<CreditCard size={20} className="text-purple-500" />}
        variant="purple"
      />
      <StatCard 
        title={t('dashboard.expense')}
        value={formatCurrency(stats.expenses, stats.currency)}
        icon={<CreditCard size={20} className="text-orange-500" />}
        variant="orange"
      />
    </div>
  );
};

export default StatCardsSection;
