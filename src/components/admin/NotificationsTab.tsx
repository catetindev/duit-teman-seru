
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { Bell } from 'lucide-react';
import NotificationForm from './notifications/NotificationForm';
import ActivityFeed from './activity/ActivityFeed';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

const NotificationsTab = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications(user?.id);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5" /> 
          Notifications
          {unreadCount > 0 && (
            <Badge 
              variant="default" 
              className={cn(
                "ml-2 px-2 py-0.5 rounded-full text-xs font-semibold",
                "bg-purple-500 text-white"
              )}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NotificationForm />
        <ActivityFeed />
      </div>
    </div>
  );
};

export default NotificationsTab;
