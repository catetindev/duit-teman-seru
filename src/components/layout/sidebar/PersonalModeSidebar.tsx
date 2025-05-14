import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { 
  SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarNavLink 
} from "@/components/ui/sidebar";
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, ArrowDownUp, Target, BarChart2, PieChart, 
  Bell, MessageSquare, Settings, ShieldAlert 
} from 'lucide-react';

interface PersonalModeSidebarProps {
  isPremium?: boolean;
  isAdmin?: boolean;
}

const PersonalModeSidebar = ({ isPremium, isAdmin }: PersonalModeSidebarProps) => {
  const { t } = useLanguage();
  
  return (
    <SidebarContent>
      {/* Combined Group */}
      <SidebarGroup>
        {/* Removed SidebarGroupLabel */}
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
              {t('nav.analytics')} {/* Removed Badge */}
            </SidebarNavLink>}

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

export default PersonalModeSidebar;