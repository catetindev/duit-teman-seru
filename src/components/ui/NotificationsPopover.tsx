
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

const NotificationsPopover = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  
  const { 
    notifications, 
    loading, 
    unreadCount, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications(user?.id);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
              {unreadCount}
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
            notifications={notifications} 
            loading={loading}
            onMarkAsRead={markAsRead}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPopover;
