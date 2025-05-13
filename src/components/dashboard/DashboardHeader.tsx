import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

interface DashboardHeaderProps {
  isPremium: boolean;
}

// Helper function to get the time-based greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 11) {
    return 'Selamat pagi';
  } else if (hour >= 11 && hour < 15) {
    return 'Selamat siang';
  } else if (hour >= 15 && hour < 18) {
    return 'Selamat sore';
  } else {
    return 'Selamat malam';
  }
};

const DashboardHeader = ({ isPremium }: DashboardHeaderProps) => {
  const { t } = useLanguage();
  const { profile } = useAuth(); // Get profile from useAuth

  // Get the user's full name, fallback to a default if not available
  const userName = profile?.full_name || 'Master Duit';

  // Construct the dynamic greeting
  const dynamicGreeting = `${getGreeting()}, ${userName}!`;

  return (
    <div> {/* Removed mb-8 from here */}
      <h1 className="text-3xl font-bold mb-2">{dynamicGreeting}</h1> {/* Use the dynamic greeting */}
      <p className="text-muted-foreground">
        {isPremium
          ? 'Your money is looking great today! 💎'
          : 'How are we spending today? 💸'}
      </p>
    </div>
  );
};

export default DashboardHeader;