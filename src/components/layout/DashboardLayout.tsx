
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
      <div className="min-h-screen flex w-full relative bg-slate-50">
        {isMobile && <MobileNavbar isPremium={isPremium} isAdmin={isAdmin} />}
        
        {!isMobile && (
          <DashboardSidebar 
            isPremium={isPremium} 
            isAdmin={isAdmin} 
          />
        )}

        <div className={cn(
          "flex-1", 
          !isMobile && "ml-64",
          isMobile && "pt-16 pb-20"
        )}> 
          <main className="w-full h-full overflow-y-auto">
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
