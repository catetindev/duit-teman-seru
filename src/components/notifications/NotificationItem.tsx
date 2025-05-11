
import React from 'react';
import { formatDate } from '@/utils/formatUtils';

interface NotificationItemProps {
  notification: {
    id: string;
    title: string;
    message: string;
    type: string;
    created_at: string;
    is_read: boolean;
  };
  onMarkAsRead: (id: string) => void;
}

const NotificationItem = ({ notification, onMarkAsRead }: NotificationItemProps) => {
  return (
    <li 
      className={`px-4 py-3 border-b last:border-b-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
        !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
      }`}
      onClick={() => onMarkAsRead(notification.id)}
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          notification.type === 'info' ? 'bg-blue-100 text-blue-600' : 
          notification.type === 'success' ? 'bg-green-100 text-green-600' :
          notification.type === 'warning' ? 'bg-amber-100 text-amber-600' :
          'bg-red-100 text-red-600'
        }`}>
          {notification.type === 'info' ? 'ℹ️' : 
          notification.type === 'success' ? '✅' :
          notification.type === 'warning' ? '⚠️' : '❌'}
        </div>
        <div>
          <h4 className="text-sm font-medium">{notification.title}</h4>
          <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
          <p className="text-xs text-muted-foreground mt-1">{formatDate(new Date(notification.created_at))}</p>
        </div>
      </div>
    </li>
  );
};

export default NotificationItem;
