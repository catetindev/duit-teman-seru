
import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/hooks/useLanguage';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import NotificationsList from '@/components/notifications/NotificationsList';
import { Badge } from '@/components/ui/badge';
import { useEntrepreneurMode } from '@/hooks/useEntrepreneurMode';
import { Link } from 'react-router-dom';

const NotificationsPopover = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { isEntrepreneurMode } = useEntrepreneurMode();
  
  const { 
    currentModeNotifications, 
    loading, 
    unreadCount, 
    markAsRead, 
    markAllAsRead,
    fetchNotifications
  } = useNotifications(user?.id);

  const handleRefresh = () => {
    fetchNotifications();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center">
              <Badge 
                variant={isEntrepreneurMode ? "default" : "success"}
                className="px-1.5 py-0.5 min-w-5 h-5 text-xs font-bold rounded-full flex items-center justify-center"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="flex items-center justify-between py-2 px-4 border-b">
          <h3 className="font-medium">{t('notifications.title')}</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead} 
              className="text-xs h-8"
            >
              {t('notifications.markAllAsRead')}
            </Button>
          )}
        </div>
        
        <div className="max-h-[300px] overflow-y-auto">
          <NotificationsList 
            notifications={currentModeNotifications}
            loading={loading}
            onMarkAsRead={markAsRead}
            onRefresh={handleRefresh}
          />
        </div>
        
        <div className="p-2 border-t text-center">
          <Link 
            to="/notifications"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('notifications.preview')}
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
