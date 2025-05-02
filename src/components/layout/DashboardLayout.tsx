
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarNavLink } from "@/components/ui/sidebar";
import {
  BarChart2,
  LayoutDashboard,
  PieChart,
  ArrowDownUp,
  Target,
  Settings,
  Bell
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  isPremium?: boolean;
}

const DashboardLayout = ({ children, isPremium }: DashboardLayoutProps) => {
  const { t } = useLanguage();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">You need to log in</h2>
        <p className="mb-6 text-center">Please log in to access the dashboard</p>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-muted text-muted-foreground px-4 py-2 rounded-md hover:bg-muted/90"
          >
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader />
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarNavLink to="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} end>
                  {t('nav.dashboard')}
                </SidebarNavLink>
                <SidebarNavLink to="/transactions" icon={<ArrowDownUp className="h-5 w-5" />}>
                  {t('nav.transactions')}
                </SidebarNavLink>
                <SidebarNavLink to="/goals" icon={<Target className="h-5 w-5" />}>
                  {t('nav.goals')}
                </SidebarNavLink>
                <SidebarNavLink to="/budget" icon={<BarChart2 className="h-5 w-5" />}>
                  {t('nav.budget')}
                </SidebarNavLink>
                {isPremium && (
                  <SidebarNavLink to="/analytics" icon={<PieChart className="h-5 w-5" />}>
                    {t('nav.analytics')}
                  </SidebarNavLink>
                )}
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>User</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarNavLink to="/notifications" icon={<Bell className="h-5 w-5" />}>
                  Notifications
                </SidebarNavLink>
                <SidebarNavLink to="/settings" icon={<Settings className="h-5 w-5" />}>
                  {t('nav.settings')}
                </SidebarNavLink>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter />
        </Sidebar>

        <div className="flex-1 ml-16 md:ml-64">
          <main className="h-full p-6 md:px-8 overflow-y-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
