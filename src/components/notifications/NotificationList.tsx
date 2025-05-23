
import React from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import NotificationItem from './NotificationItem';
import { Notification } from '@/hooks/notifications/types';
import { Button } from '../ui/button';
import { RefreshCcw } from 'lucide-react';

interface NotificationsListProps {
  notifications: Notification[];
  loading: boolean;
  onMarkAsRead: (id: string) => void;
  onRefresh?: () => void;
  showRefresh?: boolean;
}

const NotificationsList = ({ 
  notifications, 
  loading, 
  onMarkAsRead,
  onRefresh,
  showRefresh = true
}: NotificationsListProps) => {
  const { t } = useLanguage();
  
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
        <p className="text-sm text-muted-foreground">{t('notifications.empty')}</p>
        {onRefresh && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            className="mt-2"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            {t('notifications.refresh')}
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <>
      {onRefresh && (
        <div className="flex justify-end mb-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            {t('notifications.refresh')}
          </Button>
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
    </>
  );
};

export default NotificationsList;
