
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import NotificationItem from './NotificationItem';
import { Notification } from '@/hooks/notifications/types';
import { Button } from '../ui/button';
import { RefreshCcw } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useEntrepreneurMode } from '@/hooks/useEntrepreneurMode';
import { cn } from '@/lib/utils';

interface NotificationsListProps {
  notifications: Notification[];
  loading: boolean;
  onMarkAsRead: (id: string) => void;
  onRefresh?: () => void;
  showRefresh?: boolean;
  showUnreadCount?: boolean;
}

const NotificationsList = ({ 
  notifications, 
  loading, 
  onMarkAsRead,
  onRefresh,
  showRefresh = true,
  showUnreadCount = false
}: NotificationsListProps) => {
  const { t } = useLanguage();
  const { isEntrepreneurMode } = useEntrepreneurMode();
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.is_read).length;
  
  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto mb-2"></div>
        <p className="text-sm text-muted-foreground">{t('notifications.loading')}</p>
      </div>
    );
  }
  
  if (notifications.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-muted-foreground mb-2">{t('notifications.empty')}</p>
        {showRefresh && onRefresh && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRefresh}
            className="flex items-center text-xs gap-1"
          >
            <RefreshCcw className="h-3 w-3" />
            {t('notifications.refresh')}
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div>
      {showUnreadCount && unreadCount > 0 && (
        <div className="px-4 py-2 flex justify-between items-center">
          <span className="text-sm font-medium flex items-center">
            {t('notifications.unread')}
            <Badge 
              variant={isEntrepreneurMode ? "default" : "success"}
              className={cn(
                "ml-2 px-1.5 py-0.5 text-xs font-bold rounded-full",
                isEntrepreneurMode ? "bg-amber-500" : "bg-green-500"
              )}
            >
              {unreadCount}
            </Badge>
          </span>
        </div>
      )}

      <ul>
        {notifications.map((notification) => (
          <NotificationItem 
            key={notification.id} 
            notification={notification}
            onMarkAsRead={onMarkAsRead}
          />
        ))}
      </ul>
      
      {showRefresh && onRefresh && notifications.length > 0 && (
        <div className="py-2 text-center border-t">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onRefresh}
            className="flex items-center text-xs gap-1"
          >
            <RefreshCcw className="h-3 w-3" />
            {t('notifications.refresh')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationsList;
