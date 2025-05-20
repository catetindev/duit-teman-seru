
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarNavLink 
} from "@/components/ui/sidebar";
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, PieChart, Package, Calculator, FileText, Bell, MessageSquare, 
  Settings, ShieldAlert, ShoppingBag, Users, CreditCard, FileBarChart
} from 'lucide-react';

interface EntrepreneurModeSidebarProps {
  isAdmin?: boolean;
}

const EntrepreneurModeSidebar = ({ isAdmin }: EntrepreneurModeSidebarProps) => {
  const { t } = useLanguage();
  
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
            className="font-medium"
          >
            Dashboard
          </SidebarNavLink>
          
          <SidebarNavLink 
            to="/products" 
            icon={<Package className="h-5 w-5" />}
            className="font-medium"
          >
            Products & Services
          </SidebarNavLink>
          
          <SidebarNavLink 
            to="/pos" 
            icon={<CreditCard className="h-5 w-5" />}
            className="font-medium"
          >
            POS / Cashier
          </SidebarNavLink>
          
          <SidebarNavLink 
            to="/orders" 
            icon={<ShoppingBag className="h-5 w-5" />}
            className="font-medium"
          >
            Orders & Transactions
          </SidebarNavLink>
          
          <SidebarNavLink 
            to="/customers" 
            icon={<Users className="h-5 w-5" />}
            className="font-medium"
          >
            Customers
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
            className="font-medium"
          >
            Profit & Loss Report
          </SidebarNavLink>
          
          <SidebarNavLink 
            to="/calculator" 
            icon={<Calculator className="h-5 w-5" />}
            className="font-medium"
          >
            Pricing Calculator
          </SidebarNavLink>
          
          <SidebarNavLink 
            to="/invoices" 
            icon={<FileText className="h-5 w-5" />}
            className="font-medium"
          >
            Invoice Generator
          </SidebarNavLink>
          
          <SidebarNavLink 
            to="/finance-reports" 
            icon={<FileBarChart className="h-5 w-5" />}
            className="font-medium"
          >
            Financial Reports
          </SidebarNavLink>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* User Tools */}
      <SidebarGroup>
        <SidebarGroupLabel>Account</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarNavLink 
            to="/notifications" 
            icon={<Bell className="h-5 w-5" />}
            className="font-medium"
          >
            Notifications
            <Badge variant="outline" className="ml-auto bg-primary/10 text-xs py-0 h-5">2</Badge>
          </SidebarNavLink>
          
          <SidebarNavLink 
            to="/feedback" 
            icon={<MessageSquare className="h-5 w-5" />}
            className="font-medium"
          >
            Feedback
          </SidebarNavLink>
          
          <SidebarNavLink 
            to="/settings" 
            icon={<Settings className="h-5 w-5" />}
            className="font-medium"
          >
            {t('nav.settings')}
          </SidebarNavLink>
          
          {isAdmin && (
            <SidebarNavLink 
              to="/admin" 
              icon={<ShieldAlert className="h-5 w-5" />}
              className="font-medium"
            >
              Admin
            </SidebarNavLink>
          )}
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
};

export default EntrepreneurModeSidebar;
