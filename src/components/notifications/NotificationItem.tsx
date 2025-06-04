import React from 'react';
import { formatDate } from '@/utils/formatUtils';
import { Notification } from '@/hooks/notifications/types';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem = ({ notification, onMarkAsRead }: NotificationItemProps) => {
  const isUnread = !notification.is_read;
  return (
    <li
      className={`group relative bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-3 px-4 py-3 transition-all cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:bg-gray-50 dark:hover:bg-gray-800 ${
        isUnread ? 'ring-2 ring-blue-400/30' : ''
      }`}
      onClick={() => onMarkAsRead(notification.id)}
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-xl ${
          notification.type === 'info' ? 'bg-blue-100 text-blue-600' :
          notification.type === 'success' ? 'bg-green-100 text-green-600' :
          notification.type === 'warning' ? 'bg-amber-100 text-amber-600' :
          'bg-red-100 text-red-600'
        }`}>
          {notification.type === 'info' ? 'ℹ️' :
          notification.type === 'success' ? '✅' :
          notification.type === 'warning' ? '⚠️' : '❌'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-base font-semibold truncate">{notification.title}</h4>
            {isUnread && (
              <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-blue-500 text-white animate-pulse">Baru</span>
            )}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1 break-words">{notification.message}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{formatDate(new Date(notification.created_at))}</p>
        </div>
      </div>
    </li>
  );
};

export default NotificationItem;
