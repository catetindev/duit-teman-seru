import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarNavLink } from "@/components/ui/sidebar";
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LayoutDashboard, PieChart, Package, Calculator, FileText, Bell, MessageSquare, Settings, ShieldAlert, ShoppingBag, Users, CreditCard, FileBarChart, TrendingUp, TrendingDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { useEntrepreneurMode } from '@/hooks/useEntrepreneurMode';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
interface EntrepreneurModeSidebarProps {
  isAdmin?: boolean;
}
const EntrepreneurModeSidebar = ({
  isAdmin
}: EntrepreneurModeSidebarProps) => {
  const {
    t
  } = useLanguage();
  const {
    user
  } = useAuth();
  const {
    unreadCount
  } = useNotifications(user?.id);
  const {
    isEntrepreneurMode
  } = useEntrepreneurMode();

  // Define common styles for nav links
  const navLinkStyles = "font-medium";
  return <SidebarContent>
      {/* Core Navigation */}
      <SidebarGroup>
        <SidebarGroupLabel>{t('entrepreneur.business')}</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarNavLink to="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} end>
            <span className={navLinkStyles}>{t('entrepreneur.dashboard')}</span>
          </SidebarNavLink>
          
          <SidebarNavLink to="/products" icon={<Package className="h-5 w-5" />}>
            <span className={navLinkStyles}>{t('entrepreneur.products')}</span>
          </SidebarNavLink>
          
          <SidebarNavLink to="/pos" icon={<CreditCard className="h-5 w-5" />}>
            <span className={navLinkStyles}>{t('entrepreneur.pos')}</span>
          </SidebarNavLink>
          
          <SidebarNavLink to="/orders" icon={<ShoppingBag className="h-5 w-5" />}>
            <span className={navLinkStyles}>{t('entrepreneur.orders')}</span>
          </SidebarNavLink>
          
          <SidebarNavLink to="/customers" icon={<Users className="h-5 w-5" />}>
            <span className={navLinkStyles}>{t('entrepreneur.customers')}</span>
          </SidebarNavLink>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Business Transactions Section */}
      <SidebarGroup>
        <SidebarGroupLabel>Business Transactions</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarNavLink to="/business-income" icon={<TrendingUp className="h-5 w-5" />}>
            <span className={navLinkStyles}>Business Income</span>
          </SidebarNavLink>
          
          <SidebarNavLink to="/business-expenses" icon={<TrendingDown className="h-5 w-5" />}>
            <span className={navLinkStyles}>Business Expenses</span>
          </SidebarNavLink>
        </SidebarGroupContent>
      </SidebarGroup>
      
      {/* Financial Section */}
      <SidebarGroup>
        <SidebarGroupLabel>{t('entrepreneur.financial')}</SidebarGroupLabel>
        <SidebarGroupContent>
          
          
          <SidebarNavLink to="/profit-loss" icon={<PieChart className="h-5 w-5" />}>
            <span className={navLinkStyles}>{t('entrepreneur.profitLoss')}</span>
          </SidebarNavLink>
          
          <SidebarNavLink to="/calculator" icon={<Calculator className="h-5 w-5" />} data-tour="pricing-calculator">
            <span className={navLinkStyles}>{t('entrepreneur.calculator')}</span>
          </SidebarNavLink>
          
          <SidebarNavLink to="/invoices" icon={<FileText className="h-5 w-5" />} data-tour="invoices-menu">
            <span className={navLinkStyles}>{t('entrepreneur.invoices')}</span>
          </SidebarNavLink>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* User Tools */}
      <SidebarGroup>
        <SidebarGroupLabel>{t('entrepreneur.account')}</SidebarGroupLabel>
        <SidebarGroupContent>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarNavLink to="/notifications" icon={<Bell className="h-5 w-5" />}>
                  <span className={navLinkStyles}>{t('entrepreneur.notifications')}</span>
                  {unreadCount > 0 && <Badge variant="default" className={cn("ml-auto bg-amber-500 text-xs py-0 px-1.5 min-w-5 h-5 flex items-center justify-center rounded-full")}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </Badge>}
                </SidebarNavLink>
              </TooltipTrigger>
              {unreadCount > 0 && <TooltipContent>
                  You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                </TooltipContent>}
            </Tooltip>
          </TooltipProvider>
          
          <SidebarNavLink to="/feedback" icon={<MessageSquare className="h-5 w-5" />}>
            <span className={navLinkStyles}>{t('entrepreneur.feedback')}</span>
          </SidebarNavLink>
          
          <SidebarNavLink to="/settings" icon={<Settings className="h-5 w-5" />}>
            <span className={navLinkStyles}>{t('nav.settings')}</span>
          </SidebarNavLink>
          
          {isAdmin && <SidebarNavLink to="/admin" icon={<ShieldAlert className="h-5 w-5" />}>
              <span className={navLinkStyles}>{t('entrepreneur.admin')}</span>
            </SidebarNavLink>}
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>;
};
export default EntrepreneurModeSidebar;