import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

interface DashboardHeaderProps {
  isPremium: boolean;
}

const DashboardHeader = ({ isPremium }: DashboardHeaderProps) => {
  const { t } = useLanguage();
  const { profile } = useAuth(); // Get profile from useAuth
  
  // Use the full_name from the profile, fallback to 'money master' or 'pengguna'
  const userName = profile?.full_name || (t('dashboard.welcome').includes('master') ? 'money master' : 'pengguna');
  
  return (
    <div> {/* Removed mb-8 from here */}
      <h1 className="text-3xl font-bold mb-2">
        {t('dashboard.welcome', { userName: userName })} {/* Pass userName as parameter */}
      </h1>
      <p className="text-muted-foreground">
        {isPremium 
          ? 'Your money is looking great today! 💎' 
          : 'How are we spending today? 💸'}
      </p>
    </div>
  );
};

export default DashboardHeader;