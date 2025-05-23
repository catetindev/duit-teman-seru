
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
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PersonalModeSidebarProps {
  isPremium?: boolean;
  isAdmin?: boolean;
}

const PersonalModeSidebar = ({ isPremium, isAdmin }: PersonalModeSidebarProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { unreadCount } = useNotifications(user?.id);
  
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
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarNavLink to="/notifications" icon={<Bell className="h-5 w-5" />}>
                  Notifications
                  {unreadCount > 0 && (
                    <Badge 
                      variant="success" 
                      className={cn(
                        "ml-auto bg-green-500 text-xs py-0 px-1.5 min-w-5 h-5 flex items-center justify-center rounded-full"
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
