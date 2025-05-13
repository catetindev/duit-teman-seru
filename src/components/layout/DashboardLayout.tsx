
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

        <div className={cn("flex-1 transition-all duration-300", !isMobile && "ml-64")}>
          <main 
            className={cn(
              "h-full p-4 md:p-6 lg:p-8 overflow-y-auto bg-gradient-to-b from-purple-50/30 to-white/80 dark:from-gray-900/20 dark:to-gray-800/10",
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
