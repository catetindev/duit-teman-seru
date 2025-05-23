
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useEntrepreneurMode } from '../useEntrepreneurMode';
import { Notification, NotificationsHookReturn } from './types';
import { 
  fetchNotificationsFromApi, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  subscribeToNotifications
} from './notificationApi';
import {
  filterNotificationsByMode,
  filterUnreadNotifications,
  countUnreadNotifications,
  updateNotificationsAfterMarkingAsRead,
  updateNotificationsAfterMarkingAllAsRead
} from './notificationUtils';
import { supabase } from '@/integrations/supabase/client';

// Re-export using export type to comply with isolatedModules
export type { Notification } from './types';

export const useNotifications = (userId: string | undefined): NotificationsHookReturn => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { isEntrepreneurMode } = useEntrepreneurMode();
  
  // Current mode
  const currentMode = isEntrepreneurMode ? 'business' : 'personal';

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      console.log("useNotifications: No userId provided, skipping fetch.");
      setLoading(false); // Set loading to false if no user
      return;
    }
    
    try {
      setLoading(true);
      const fetchedNotifications = await fetchNotificationsFromApi(userId);
      setNotifications(fetchedNotifications);
      
      // Calculate unread count for current mode
      const count = countUnreadNotifications(fetchedNotifications, currentMode);
      setUnreadCount(count);
    } catch (error: any) {
      console.error('Error in fetchNotifications:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, currentMode]);

  // Mark notification as read
  const markAsRead = async (id: string) => {
    if (!userId) return;
    
    const success = await markNotificationAsRead(userId, id);
    
    if (success) {
      // Update local state
      const updatedNotifications = updateNotificationsAfterMarkingAsRead(notifications, id);
      setNotifications(updatedNotifications);
      
      // Only decrease unread count if the notification belongs to the current mode
      const notification = notifications.find(n => n.id === id);
      if (notification && notification.category === currentMode && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (!userId || notifications.length === 0) return;
    
    const success = await markAllNotificationsAsRead(userId, currentMode);
    
    if (success) {
      const updatedNotifications = updateNotificationsAfterMarkingAllAsRead(notifications, currentMode);
      setNotifications(updatedNotifications);
      setUnreadCount(0);
    }
  };

  // Subscribe to new notifications
  useEffect(() => {
    if (!userId) {
      console.log("useNotifications: No userId, skipping initial fetch and subscription.");
      setNotifications([]); // Clear notifications if user logs out
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    fetchNotifications();

    // Setup handlers
    const handleNewNotification = (newNotification: Notification) => {
      setNotifications(prev => [newNotification, ...prev.filter(n => n.id !== newNotification.id)]);
      
      // Only increment unread count if notification is for the current mode
      if (!newNotification.is_read && newNotification.category === currentMode) {
        setUnreadCount(prev => prev + 1);
      }
    };

    const handleUpdateOrDelete = () => {
      fetchNotifications(); // Refetch to ensure consistency
    };

    // Create subscription
    const channel = subscribeToNotifications(
      userId,
      handleNewNotification,
      handleUpdateOrDelete, 
      handleUpdateOrDelete
    );

    // Cleanup subscription on unmount
    return () => {
      if (channel) {
        console.log(`useNotifications: Removing realtime channel subscription for user ${userId}`);
        supabase.removeChannel(channel);
      }
    };
  }, [userId, fetchNotifications, currentMode]);

  // Calculate filtered notifications
  const currentModeNotifications = filterNotificationsByMode(notifications, currentMode);
  const unreadNotifications = filterUnreadNotifications(notifications, currentMode);

  return {
    notifications,
    currentModeNotifications,
    unreadNotifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    fetchNotifications
  };
};
