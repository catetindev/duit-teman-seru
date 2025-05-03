
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface GoalsLoadingProps {
  isPremium: boolean;
}

const GoalsLoading: React.FC<GoalsLoadingProps> = ({ isPremium }) => {
  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Loading your goals...</p>
      </div>
    </DashboardLayout>
  );
};

export default GoalsLoading;
