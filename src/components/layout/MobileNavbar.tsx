import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BarChart2, Bell, LayoutDashboard, MessageSquare, PieChart, 
  Settings, ShieldAlert, Target, Package, ShoppingCart, 
  Users, Calculator, FileText, FileBarChart, CreditCard, ArrowDownUp,
  Menu, X, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EntrepreneurModeToggle } from '@/components/entrepreneur/EntrepreneurModeToggle';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { useEntrepreneurMode } from '@/hooks/useEntrepreneurMode';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { SidebarNavLink } from '@/components/ui/sidebar';
import LogoutButton from '@/components/ui/LogoutButton';
import { Badge } from '@/components/ui/badge'; // Import Badge
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MobileNavbarProps {
  isPremium?: boolean;
  isAdmin?: boolean;
}

const MobileNavbar = ({ isPremium, isAdmin }: MobileNavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth(); 
  const { unreadCount } = useNotifications(user?.id); 
  const { isEntrepreneurMode } = useEntrepreneurMode();
  const { t } = useLanguage();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLinkClick = () => {
    setIsSheetOpen(false);
  };
  
  const commonUserLinks = (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SidebarNavLink to="/notifications" icon={<Bell className="h-5 w-5" />} onClick={handleLinkClick}>
              Notifikasi
              {unreadCount > 0 && (
                <Badge 
                  variant={isEntrepreneurMode ? "default" : "success"}
                  className={cn(
                    "ml-auto text-xs py-0 px-1.5 min-w-5 h-5 flex items-center justify-center rounded-full",
                    isEntrepreneurMode ? "bg-amber-500" : "bg-green-500"
                  )}
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </SidebarNavLink>
          </TooltipTrigger>
          {unreadCount > 0 && (
            <TooltipContent>
              You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      <SidebarNavLink to="/feedback" icon={<MessageSquare className="h-5 w-5" />} onClick={handleLinkClick}>
        Feedback
      </SidebarNavLink>
      <SidebarNavLink to="/settings" icon={<Settings className="h-5 w-5" />} onClick={handleLinkClick}>
        {t('nav.settings')}
      </SidebarNavLink>
      {isAdmin && (
        <SidebarNavLink to="/admin" icon={<ShieldAlert className="h-5 w-5" />} onClick={handleLinkClick}>
          Admin
        </SidebarNavLink>
      )}
    </>
  );

  const entrepreneurModeLinks = (
    <>
      <SidebarNavLink to="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} onClick={handleLinkClick} end>
        Dashboard
      </SidebarNavLink>
      {/* Removed Transaction and Analytics links */}
      <SidebarNavLink to="/products" icon={<Package className="h-5 w-5" />} onClick={handleLinkClick}>
        Produk & Layanan
      </SidebarNavLink>
      <SidebarNavLink to="/pos" icon={<CreditCard className="h-5 w-5" />} onClick={handleLinkClick}>
        POS / Kasir
      </SidebarNavLink>
      <SidebarNavLink to="/orders" icon={<ShoppingCart className="h-5 w-5" />} onClick={handleLinkClick}>
        Pesanan & Transaksi
      </SidebarNavLink>
      <SidebarNavLink to="/customers" icon={<Users className="h-5 w-5" />} onClick={handleLinkClick}>
        Pelanggan
      </SidebarNavLink>
      <SidebarNavLink to="/profit-loss" icon={<PieChart className="h-5 w-5" />} onClick={handleLinkClick}>
        Laporan Untung Rugi
      </SidebarNavLink>
      <SidebarNavLink to="/calculator" icon={<Calculator className="h-5 w-5" />} onClick={handleLinkClick}>
        Kalkulator HPP
      </SidebarNavLink>
      <SidebarNavLink to="/invoices" icon={<FileText className="h-5 w-5" />} onClick={handleLinkClick}>
        Invoice Generator
      </SidebarNavLink>
      <SidebarNavLink to="/finance-reports" icon={<FileBarChart className="h-5 w-5" />} onClick={handleLinkClick}>
        Laporan Keuangan
      </SidebarNavLink>
      {commonUserLinks}
    </>
  );

  const personalModeLinks = (
     <>
      <SidebarNavLink to="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} onClick={handleLinkClick} end>
        {t('nav.dashboard')}
      </SidebarNavLink>
      <SidebarNavLink to="/transactions" icon={<ArrowDownUp className="h-5 w-5" />} onClick={handleLinkClick}>
        {t('nav.transactions')}
      </SidebarNavLink>
      <SidebarNavLink to="/goals" icon={<Target className="h-5 w-5" />} onClick={handleLinkClick}>
        {t('nav.goals')}
      </SidebarNavLink>
      <SidebarNavLink to="/budget" icon={<BarChart2 className="h-5 w-5" />} onClick={handleLinkClick}>
        {t('nav.budget')}
      </SidebarNavLink>
      {isPremium && (
        <SidebarNavLink to="/analytics" icon={<PieChart className="h-5 w-5" />} onClick={handleLinkClick}>
          {t('nav.analytics')}
        </SidebarNavLink>
      )}
      {commonUserLinks}
    </>
  );

  return (
    <>
      {/* Top navbar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-background border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full">
          <div className="h-full flex items-center justify-between relative">
            {/* Left Item: Toggle & Greeting */}
            <div className="flex items-center gap-x-3 flex-1 min-w-0">
              {isPremium && <EntrepreneurModeToggle className="flex-shrink-0" />}
              <span className="text-sm font-medium truncate">
                Hai {profile?.full_name || 'rizqi akbar'}!
              </span>
            </div>

            {/* Center Item: Logo */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Link to="/dashboard" className="flex items-center">
                <img 
                  src="/lovable-uploads/b28e4def-5cbc-49d0-b60d-a1bf06d6d0b5.png" 
                  alt="Catatuy Logo" 
                  className="h-8" 
                />
              </Link>
            </div>

            {/* Right Items: Notifications and Menu */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link 
                      to="/notifications" 
                      className={cn(
                        "relative p-2 rounded-full hover:bg-accent", 
                        isActive('/notifications') && "bg-accent"
                      )}
                    >
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
                          <Badge 
                            variant={isEntrepreneurMode ? "default" : "success"}
                            className={cn(
                              "px-1.5 py-0.5 min-w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center",
                              isEntrepreneurMode ? "bg-amber-500" : "bg-green-500"
                            )}
                          >
                            {unreadCount > 99 ? '99+' : unreadCount}
                          </Badge>
                        </span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  {unreadCount > 0 && (
                    <TooltipContent>
                      You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] p-0 flex flex-col">
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle className="flex items-center gap-2">
                       <img 
                        src="/lovable-uploads/b28e4def-5cbc-49d0-b60d-a1bf06d6d0b5.png" 
                        alt="Catatuy Logo" 
                        className="h-8" 
                      />
                      Menu
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex-grow overflow-y-auto p-4 space-y-2">
                    {isEntrepreneurMode ? entrepreneurModeLinks : personalModeLinks}
                  </div>
                  <div className="p-4 border-t">
                    <LogoutButton variant="outline" className="w-full" />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom navbar - display different navigation based on mode */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-background border-t flex items-center justify-around px-2 z-50">
        {isEntrepreneurMode && isPremium ? ( // Only show entrepreneur bottom nav if premium
          <>
            <Link 
              to="/dashboard" 
              className={cn(
                "flex flex-1 flex-col items-center justify-center text-xs px-1 py-1", 
                isActive('/dashboard') 
                  ? "text-amber-500" 
                  : "text-muted-foreground"
              )}
            >
              <LayoutDashboard className="h-5 w-5 mb-0.5" />
              Dashboard
            </Link>
            
            <Link 
              to="/products" 
              className={cn(
                "flex flex-1 flex-col items-center justify-center text-xs px-1 py-1", 
                isActive('/products') 
                  ? "text-amber-500" 
                  : "text-muted-foreground"
              )}
            >
              <Package className="h-5 w-5 mb-0.5" />
              Produk
            </Link>
            
            <Link 
              to="/orders" 
              className={cn(
                "flex flex-1 flex-col items-center justify-center text-xs px-1 py-1", 
                isActive('/orders') 
                  ? "text-amber-500" 
                  : "text-muted-foreground"
              )}
            >
              <ShoppingCart className="h-5 w-5 mb-0.5" />
              Pesanan
            </Link>
            
            <Link 
              to="/profit-loss" 
              className={cn(
                "flex flex-1 flex-col items-center justify-center text-xs px-1 py-1", 
                isActive('/profit-loss') 
                  ? "text-amber-500" 
                  : "text-muted-foreground"
              )}
            >
              <PieChart className="h-5 w-5 mb-0.5" />
              Laporan
            </Link>
            
            <Link 
              to="/pos" 
              className={cn(
                "flex flex-1 flex-col items-center justify-center text-xs px-1 py-1", 
                isActive('/pos') 
                  ? "text-amber-500" 
                  : "text-muted-foreground"
              )}
            >
              <CreditCard className="h-5 w-5 mb-0.5" />
              POS
            </Link>
          </>
        ) : ( // Show personal mode bottom nav for free or premium users in personal mode
          <>
            <Link 
              to="/dashboard" 
              className={cn(
                "flex flex-1 flex-col items-center justify-center text-xs px-1 py-1", 
                isActive('/dashboard') 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              <LayoutDashboard className="h-5 w-5 mb-0.5" />
              Dashboard
            </Link>
            
            <Link 
              to="/transactions" 
              className={cn(
                "flex flex-1 flex-col items-center justify-center text-xs px-1 py-1", 
                isActive('/transactions') 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              <ArrowDownUp className="h-5 w-5 mb-0.5" />
              Transaksi
            </Link>
            
            <Link 
              to="/goals" 
              className={cn(
                "flex flex-1 flex-col items-center justify-center text-xs px-1 py-1", 
                isActive('/goals') 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              <Target className="h-5 w-5 mb-0.5" />
              Target
            </Link>
            
            <Link 
              to="/budget" 
              className={cn(
                "flex flex-1 flex-col items-center justify-center text-xs px-1 py-1", 
                isActive('/budget') 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              <BarChart2 className="h-5 w-5 mb-0.5" />
              Budget
            </Link>
            
            {isPremium && (
              <Link 
                to="/analytics" 
                className={cn(
                  "flex flex-1 flex-col items-center justify-center text-xs px-1 py-1", 
                  isActive('/analytics') 
                    ? "text-primary" 
                    : "text-muted-foreground"
                )}
              >
                <PieChart className="h-5 w-5 mb-0.5" />
                Analitik
              </Link>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default MobileNavbar;
