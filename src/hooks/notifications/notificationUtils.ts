
import { Notification } from './types';

export const filterNotificationsByMode = (
  notifications: Notification[],
  currentMode: string
): Notification[] => {
  const filtered: Notification[] = [];
  
  for (let i = 0; i < notifications.length; i++) {
    if (notifications[i].category === currentMode) {
      filtered.push({...notifications[i]});
    }
  }
  
  return filtered;
};

export const filterUnreadNotifications = (
  notifications: Notification[],
  currentMode: string
): Notification[] => {
  const filtered: Notification[] = [];
  
  for (let i = 0; i < notifications.length; i++) {
    if (notifications[i].category === currentMode && !notifications[i].is_read) {
      filtered.push({...notifications[i]});
    }
  }
  
  return filtered;
};

export const countUnreadNotifications = (
  notifications: Notification[],
  currentMode: string
): number => {
  let count = 0;
  
  for (let i = 0; i < notifications.length; i++) {
    if (notifications[i].category === currentMode && !notifications[i].is_read) {
      count++;
    }
  }
  
  return count;
};

export const updateNotificationsAfterMarkingAsRead = (
  notifications: Notification[],
  notificationId: string
): Notification[] => {
  return notifications.map(notification => 
    notification.id === notificationId 
      ? { ...notification, is_read: true } 
      : notification
  );
};

export const updateNotificationsAfterMarkingAllAsRead = (
  notifications: Notification[],
  currentMode: string
): Notification[] => {
  return notifications.map(notification => 
    notification.category === currentMode 
      ? { ...notification, is_read: true } 
      : notification
  );
};
