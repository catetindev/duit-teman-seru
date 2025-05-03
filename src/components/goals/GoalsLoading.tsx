
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface GoalsLoadingProps {
  isPremium: boolean;
}

const GoalsLoading: React.FC<GoalsLoadingProps> = ({ isPremium }) => {
  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </DashboardLayout>
  );
};

export default GoalsLoading;
