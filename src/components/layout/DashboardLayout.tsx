import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarProvider } from "@/components/ui/sidebar";
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

import DashboardSidebar from './DashboardSidebar';
import MobileNavbar from './MobileNavbar';
import LoadingSpinner from './LoadingSpinner';
import LoginRequired from './LoginRequired';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  isPremium?: boolean;
  isAdmin?: boolean;
}

const DashboardLayout = ({
  children,
  isPremium,
  isAdmin
}: DashboardLayoutProps) => {
  const { user, isLoading } = useAuth();
  const isMobile = useIsMobile();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <LoginRequired />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative">
        {isMobile && <MobileNavbar isPremium={isPremium} isAdmin={isAdmin} />}
        
        {!isMobile && (
          <DashboardSidebar 
            isPremium={isPremium} 
            isAdmin={isAdmin} 
          />
        )}

        <div className={cn("flex-1 transition-all duration-300 flex justify-center", !isMobile && "ml-64")}> 
          <main 
            className={cn(
              "w-full max-w-screen-lg xl:max-w-[1200px] mx-auto px-4 md:px-6 py-6 md:py-8 h-full overflow-y-auto bg-gradient-to-b from-purple-50/30 to-white/80 dark:from-gray-900/20 dark:to-gray-800/10 text-sm md:text-base",
              isMobile && "pt-20 pb-20" // Padding top for top navbar, padding bottom for bottom navbar
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
