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
  ShoppingBag, Users, CreditCard, FileBarChart
} from 'lucide-react';

interface EntrepreneurModeSidebarProps {
  isAdmin?: boolean;
}

const EntrepreneurModeSidebar = ({ isAdmin }: EntrepreneurModeSidebarProps) => {
  const { t } = useLanguage();
  
  return (
    <SidebarContent>
      {/* Combined Group */}
      <SidebarGroup>
        {/* Removed SidebarGroupLabel */}
        <SidebarGroupContent>
          <SidebarNavLink to="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} end>
            Dashboard
          </SidebarNavLink>
          
          {/* Business Links (Premium) */}
          <SidebarNavLink to="/products" icon={<Package className="h-5 w-5" />}>
            Produk & Layanan {/* Removed Badge */}
          </SidebarNavLink>
          <SidebarNavLink to="/pos" icon={<CreditCard className="h-5 w-5" />}>
            POS / Kasir {/* Removed Badge */}
          </SidebarNavLink>
           <SidebarNavLink to="/orders" icon={<ShoppingBag className="h-5 w-5" />}>
            Pesanan & Transaksi {/* Removed Badge */}
          </SidebarNavLink>
          <SidebarNavLink to="/customers" icon={<Users className="h-5 w-5" />}>
            Pelanggan {/* Removed Badge */}
          </SidebarNavLink>
          <SidebarNavLink to="/profit-loss" icon={<PieChart className="h-5 w-5" />}>
            Laporan Untung Rugi {/* Removed Badge */}
          </SidebarNavLink>
          <SidebarNavLink to="/calculator" icon={<Calculator className="h-5 w-5" />}>
            Kalkulator HPP {/* Removed Badge */}
          </SidebarNavLink>
          <SidebarNavLink to="/invoices" icon={<FileText className="h-5 w-5" />}>
            Invoice Generator {/* Removed Badge */}
          </SidebarNavLink>
           <SidebarNavLink to="/finance-reports" icon={<FileBarChart className="h-5 w-5" />}>
            Laporan Keuangan {/* Removed Badge */}
          </SidebarNavLink>

          {/* User Links */}
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