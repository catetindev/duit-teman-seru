
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { 
  SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarNavLink 
} from "@/components/ui/sidebar";
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, ArrowDownUp, Target, BarChart2, PieChart, 
  Package, Calculator, FileText, Bell, MessageSquare, Settings, ShieldAlert,
  ShoppingBag, Users
} from 'lucide-react';

interface EntrepreneurModeSidebarProps {
  isAdmin?: boolean;
}

const EntrepreneurModeSidebar = ({ isAdmin }: EntrepreneurModeSidebarProps) => {
  const { t } = useLanguage();
  
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Main</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarNavLink to="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} end>
            Dashboard
          </SidebarNavLink>
          <SidebarNavLink to="/transactions" icon={<ArrowDownUp className="h-5 w-5" />}>
            Transaksi
          </SidebarNavLink>
          <SidebarNavLink to="/analytics" icon={<PieChart className="h-5 w-5" />}>
            Analitik
          </SidebarNavLink>
        </SidebarGroupContent>
      </SidebarGroup>
      
      <SidebarGroup>
        <SidebarGroupLabel>Bisnis <Badge variant="outline" className="ml-1 text-xs bg-amber-500/10 text-amber-500 border-amber-500/20">Premium</Badge></SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarNavLink to="/products" icon={<Package className="h-5 w-5" />}>
            Produk & Layanan
          </SidebarNavLink>
          <SidebarNavLink to="/calculator" icon={<Calculator className="h-5 w-5" />}>
            Kalkulator HPP
          </SidebarNavLink>
          <SidebarNavLink to="/invoices" icon={<FileText className="h-5 w-5" />}>
            Invoice Generator
          </SidebarNavLink>
          <SidebarNavLink to="/customers" icon={<Users className="h-5 w-5" />}>
            Pelanggan
          </SidebarNavLink>
          <SidebarNavLink to="/orders" icon={<ShoppingBag className="h-5 w-5" />}>
            Pesanan
          </SidebarNavLink>
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
};

export default EntrepreneurModeSidebar;
