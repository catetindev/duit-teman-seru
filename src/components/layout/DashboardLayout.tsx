import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import { useIsMobile } from '@/hooks/use-mobile';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarNavLink } from "@/components/ui/sidebar";
import LogoutButton from '@/components/ui/LogoutButton';
import MobileNavbar from '@/components/layout/MobileNavbar';
import { 
  BarChart2, LayoutDashboard, PieChart, ArrowDownUp, Target, Settings, 
  Bell, ShieldAlert, MessageSquare, Package, ShoppingCart, Users, 
  Calculator, FileText, FileBarChart, CreditCard
} from 'lucide-react';
import { EntrepreneurModeToggle } from '@/components/entrepreneur/EntrepreneurModeToggle';
import { useEntrepreneurMode } from '@/hooks/useEntrepreneurMode';

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
  const { t } = useLanguage();
  const { user, isLoading } = useAuth();
  const isMobile = useIsMobile();
  const { isEntrepreneurMode } = useEntrepreneurMode();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-800">
        <img src="/lovable-uploads/b28e4def-5cbc-49d0-b60d-a1bf06d6d0b5.png" alt="Catatuy Logo" className="h-20 mb-8" />
        <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">You need to log in</h2>
        <p className="mb-6 text-center text-gray-600 dark:text-gray-300">Please log in to access the dashboard</p>
        <div className="flex gap-4">
          <Link to="/login" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-2.5 rounded-full hover:opacity-90 transition-all shadow-md">
            Login
          </Link>
          <Link to="/signup" className="bg-white text-gray-700 border border-gray-200 px-6 py-2.5 rounded-full hover:bg-gray-50 transition-all shadow-sm">
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  // Different menu items for personal and entrepreneur modes
  const renderSidebarContent = () => {
    if (isEntrepreneurMode) {
      // Entrepreneur mode menu items
      return (
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Bisnis</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarNavLink to="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} end>
                Dashboard
              </SidebarNavLink>
              <SidebarNavLink to="/products" icon={<Package className="h-5 w-5" />}>
                Produk & Layanan
              </SidebarNavLink>
              <SidebarNavLink to="/pos" icon={<CreditCard className="h-5 w-5" />}>
                POS / Kasir
              </SidebarNavLink>
              <SidebarNavLink to="/orders" icon={<ShoppingCart className="h-5 w-5" />}>
                Pesanan & Transaksi
              </SidebarNavLink>
              <SidebarNavLink to="/customers" icon={<Users className="h-5 w-5" />}>
                Pelanggan
              </SidebarNavLink>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel>Keuangan</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarNavLink to="/profit-loss" icon={<PieChart className="h-5 w-5" />}>
                Laporan Untung Rugi
              </SidebarNavLink>
              <SidebarNavLink to="/calculator" icon={<Calculator className="h-5 w-5" />}>
                Kalkulator HPP
              </SidebarNavLink>
              <SidebarNavLink to="/invoices" icon={<FileText className="h-5 w-5" />}>
                Invoice Generator
              </SidebarNavLink>
              <SidebarNavLink to="/finance-reports" icon={<FileBarChart className="h-5 w-5" />}>
                Laporan Keuangan
              </SidebarNavLink>
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel>User</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarNavLink to="/notifications" icon={<Bell className="h-5 w-5" />}>
                Notifikasi
              </SidebarNavLink>
              <SidebarNavLink to="/feedback" icon={<MessageSquare className="h-5 w-5" />}>
                Feedback
              </SidebarNavLink>
              <SidebarNavLink to="/settings" icon={<Settings className="h-5 w-5" />}>
                {t('nav.settings')}
              </SidebarNavLink>
              {isAdmin && <SidebarNavLink to="/admin" icon={<ShieldAlert className="h-5 w-5" />}>
                  Admin
                </SidebarNavLink>}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      );
    } else {
      // Regular mode menu items
      return (
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
              {isPremium && <SidebarNavLink to="/analytics" icon={<PieChart className="h-5 w-5" />}>
                  {t('nav.analytics')}
                </SidebarNavLink>}
            </SidebarGroupContent>
          </SidebarGroup>
          
          <SidebarGroup>
            <SidebarGroupLabel>User</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarNavLink to="/notifications" icon={<Bell className="h-5 w-5" />}>
                Notifications
              </SidebarNavLink>
              <SidebarNavLink to="/feedback" icon={<MessageSquare className="h-5 w-5" />}>
                Feedback
              </SidebarNavLink>
              <SidebarNavLink to="/settings" icon={<Settings className="h-5 w-5" />}>
                {t('nav.settings')}
              </SidebarNavLink>
              {isAdmin && <SidebarNavLink to="/admin" icon={<ShieldAlert className="h-5 w-5" />}>
                  Admin
                </SidebarNavLink>}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full relative">
        {/* Display Mobile Navbar when on mobile */}
        {isMobile && <MobileNavbar isPremium={isPremium} isAdmin={isAdmin} />}
        
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <img src="/lovable-uploads/b28e4def-5cbc-49d0-b60d-a1bf06d6d0b5.png" alt="Catatuy Logo" className="h-10" />
                </div>
                {/* Removing the redundant EntrepreneurModeToggle here */}
              </div>
            </SidebarHeader>
            {renderSidebarContent()}
            <SidebarFooter>
              <div className="px-3 py-2">
                <LogoutButton variant="outline" className="w-full rounded-full" />
              </div>
            </SidebarFooter>
          </Sidebar>
        )}

        <div className={`flex-1 ${isMobile ? '' : 'ml-64'} transition-all duration-300`}>
          <main className="h-full p-4 md:p-6 lg:p-8 overflow-y-auto bg-gradient-to-b from-purple-50/30 to-white/80 dark:from-gray-900/20 dark:to-gray-800/10">
            {/* Mobile top and bottom spacing for the navbar */}
            {isMobile && (
              <>
                <div className="h-16"></div> {/* Top spacing */}
                <div className="h-16 pb-4"></div> {/* Bottom spacing */}
              </>
            )}
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;