
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { 
  SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarNavLink 
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, Package, CreditCard, ShoppingCart, Users, 
  PieChart, Calculator, FileText, FileBarChart, 
  Bell, MessageSquare, Settings, ShieldAlert 
} from 'lucide-react';

interface EntrepreneurModeSidebarProps {
  isAdmin?: boolean;
}

const EntrepreneurModeSidebar = ({ isAdmin }: EntrepreneurModeSidebarProps) => {
  const { t } = useLanguage();
  
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
};

export default EntrepreneurModeSidebar;
