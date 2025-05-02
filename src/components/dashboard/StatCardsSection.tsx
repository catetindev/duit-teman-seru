
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import StatCard from '@/components/ui/StatCard';
import { PiggyBank, CreditCard } from 'lucide-react';

const StatCardsSection = () => {
  const { t } = useLanguage();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <StatCard 
        title={t('dashboard.balance')}
        value="Rp4,250,000"
        icon={<PiggyBank size={20} className="text-teal-500" />}
        trend={{ value: 12, isPositive: true }}
      />
      <StatCard 
        title={t('dashboard.income')}
        value="Rp5,000,000"
        icon={<CreditCard size={20} className="text-purple-500" />}
        variant="purple"
      />
      <StatCard 
        title={t('dashboard.expense')}
        value="Rp750,000"
        icon={<CreditCard size={20} className="text-orange-500" />}
        variant="orange"
      />
    </div>
  );
};

export default StatCardsSection;
