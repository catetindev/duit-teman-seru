
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface DashboardHeaderProps {
  isPremium: boolean;
}

const DashboardHeader = ({ isPremium }: DashboardHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold mb-2">{t('dashboard.welcome')}</h1>
      <p className="text-muted-foreground">
        {isPremium 
          ? 'Your money is looking great today! 💎' 
          : 'How are we spending today? 💸'}
      </p>
    </div>
  );
};

export default DashboardHeader;
