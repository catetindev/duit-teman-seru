
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';

interface DashboardHeaderProps {
  isPremium?: boolean;
  onUpgradeClick?: () => void;
}

const DashboardHeader = ({ isPremium, onUpgradeClick }: DashboardHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">
          {t('dashboard.welcome')}
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          {t('dashboard.subHeading')}
        </p>
      </div>

      {!isPremium && (
        <Button 
          onClick={onUpgradeClick}
          className="bg-[#28e57d] hover:bg-[#28e57d]/90 text-white flex items-center gap-2 whitespace-nowrap"
          size="sm"
        >
          <span className="text-xs md:text-sm">Upgrade Now</span>
          <span className="bg-white text-[#28e57d] text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            ⭐
          </span>
        </Button>
      )}
    </div>
  );
};

export default DashboardHeader;
