
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
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
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Function to handle premium feature clicks for free users
  const handlePremiumFeatureClick = (e: React.MouseEvent, path: string) => {
    if (!isPremium) {
      e.preventDefault();
      toast({
        title: "Fitur Premium",
        description: "Fitur ini hanya tersedia untuk pengguna premium",
        variant: "destructive",
        action: (
          <div 
            className="bg-primary hover:bg-primary/90 text-white px-3 py-2 rounded cursor-pointer text-xs font-medium"
            onClick={() => navigate('/pricing')}
          >
            Upgrade
          </div>
        ),
      });
    } else {
      navigate(path);
    }
  };
  
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
      
      {/* Removed the Business/Premium section entirely from PersonalModeSidebar since these items 
          should only appear in EntrepreneurModeSidebar */}
      
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

export default PersonalModeSidebar;
