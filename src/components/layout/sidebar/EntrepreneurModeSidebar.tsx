
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarNavLink 
} from "@/components/ui/sidebar";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, PieChart, Package, Calculator, FileText, Bell, MessageSquare, 
  Settings, ShieldAlert, ShoppingBag, Users, CreditCard, FileBarChart
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { useEntrepreneurMode } from '@/hooks/useEntrepreneurMode';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EntrepreneurModeSidebarProps {
  isAdmin?: boolean;
}

const EntrepreneurModeSidebar = ({ isAdmin }: EntrepreneurModeSidebarProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { unreadCount } = useNotifications(user?.id);
  const { isEntrepreneurMode } = useEntrepreneurMode();
  
  // Define common styles for nav links
  const navLinkStyles = "font-medium";
  
  return (
    <SidebarContent>
      {/* Core Navigation */}
      <SidebarGroup>
        <SidebarGroupLabel>Business</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarNavLink 
            to="/dashboard" 
            icon={<LayoutDashboard className="h-5 w-5" />} 
            end
          >
            <span className={navLinkStyles}>Dashboard</span>
          </SidebarNavLink>
          
          <SidebarNavLink 
            to="/products" 
            icon={<Package className="h-5 w-5" />}
          >
            <span className={navLinkStyles}>Products & Services</span>
          </SidebarNavLink>
          
          <SidebarNavLink 
            to="/pos" 
            icon={<CreditCard className="h-5 w-5" />}
          >
            <span className={navLinkStyles}>POS / Cashier</span>
          </SidebarNavLink>
          
          <SidebarNavLink 
            to="/orders" 
            icon={<ShoppingBag className="h-5 w-5" />}
          >
            <span className={navLinkStyles}>Orders & Transactions</span>
          </SidebarNavLink>
          
          <SidebarNavLink 
            to="/customers" 
            icon={<Users className="h-5 w-5" />}
          >
            <span className={navLinkStyles}>Customers</span>
          </SidebarNavLink>
        </SidebarGroupContent>
      </SidebarGroup>
      
      {/* Financial Section */}
      <SidebarGroup>
        <SidebarGroupLabel>Financial</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarNavLink 
            to="/profit-loss" 
            icon={<PieChart className="h-5 w-5" />}
          >
            <span className={navLinkStyles}>Profit & Loss Report</span>
          </SidebarNavLink>
          
          <SidebarNavLink 
            to="/calculator" 
            icon={<Calculator className="h-5 w-5" />}
          >
            <span className={navLinkStyles}>Pricing Calculator</span>
          </SidebarNavLink>
          
          <SidebarNavLink 
            to="/invoices" 
            icon={<FileText className="h-5 w-5" />}
          >
            <span className={navLinkStyles}>Invoice Generator</span>
          </SidebarNavLink>
          
          <SidebarNavLink 
            to="/finance-reports" 
            icon={<FileBarChart className="h-5 w-5" />}
          >
            <span className={navLinkStyles}>Financial Reports</span>
          </SidebarNavLink>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* User Tools */}
      <SidebarGroup>
        <SidebarGroupLabel>Account</SidebarGroupLabel>
        <SidebarGroupContent>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarNavLink 
                  to="/notifications" 
                  icon={<Bell className="h-5 w-5" />}
                >
                  <span className={navLinkStyles}>Notifications</span>
                  {unreadCount > 0 && (
                    <Badge 
                      variant="default" 
                      className={cn(
                        "ml-auto bg-amber-500 text-xs py-0 px-1.5 min-w-5 h-5 flex items-center justify-center rounded-full"
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
          
          <SidebarNavLink 
            to="/feedback" 
            icon={<MessageSquare className="h-5 w-5" />}
          >
            <span className={navLinkStyles}>Feedback</span>
          </SidebarNavLink>
          
          <SidebarNavLink 
            to="/settings" 
            icon={<Settings className="h-5 w-5" />}
          >
            <span className={navLinkStyles}>{t('nav.settings')}</span>
          </SidebarNavLink>
          
          {isAdmin && (
            <SidebarNavLink 
              to="/admin" 
              icon={<ShieldAlert className="h-5 w-5" />}
            >
              <span className={navLinkStyles}>Admin</span>
            </SidebarNavLink>
          )}
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};

export default EntrepreneurModeSidebar;
