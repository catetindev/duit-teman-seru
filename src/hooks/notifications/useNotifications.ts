
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useEntrepreneurMode } from '../useEntrepreneurMode';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
  is_read: boolean;
  action_data?: string;
  category: string; // 'personal' or 'business'
}

export const useNotifications = (userId: string | undefined) => {
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
      console.log(`useNotifications: Fetching notifications for user ${userId}`);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId) // Use actual userId
        .order('created_at', { ascending: false });

      if (error) {
        console.error('useNotifications: Supabase error fetching notifications:', error);
        throw error;
      }

      if (data) {
        console.log('useNotifications: Notifications fetched successfully:', data.length);
        const typedData = data.map(notification => ({
          ...notification,
          category: notification.category || 'personal' // Default to personal if category is not set
        })) as Notification[];
        
        setNotifications(typedData);
        
        // Filter unread count by current mode
        const modeFilteredNotifications = typedData.filter(n => n.category === currentMode);
        setUnreadCount(modeFilteredNotifications.filter(n => !n.is_read).length);
      }
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      // No toast here, let the component handle UI for error
    } finally {
      setLoading(false);
    }
  }, [userId, currentMode]);

  // Mark notification as read
  const markAsRead = async (id: string) => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;

      // Update local state
      setNotifications(prevNotifications =>
        prevNotifications.map(n =>
          n.id === id ? { ...n, is_read: true } : n
        )
      );
      
      // Only decrease unread count if the notification belongs to the current mode
      const notification = notifications.find(n => n.id === id);
      if (notification && notification.category === currentMode) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      toast.error("Failed to mark notification as read.");
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    if (!userId || notifications.length === 0) return;
    
    try {
      // Only mark notifications of current mode as read
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('is_read', false)
        .eq('category', currentMode);

      if (error) throw error;

      // Update local state
      setNotifications(prevNotifications =>
        prevNotifications.map(n => 
          n.category === currentMode ? { ...n, is_read: true } : n
        )
      );
      
      // Reset unread count for current mode
      setUnreadCount(0);
      toast.success("All notifications marked as read.");
    } catch (error: any) {
      console.error('Error marking all notifications as read:', error);
      toast.error("Failed to mark all notifications as read.");
    }
  };

  // Get current mode notifications
  const getCurrentModeNotifications = useCallback(() => {
    return notifications.filter(n => n.category === currentMode);
  }, [notifications, currentMode]);
  
  // Get unread current mode notifications
  const getUnreadCurrentModeNotifications = useCallback(() => {
    return notifications.filter(n => n.category === currentMode && !n.is_read);
  }, [notifications, currentMode]);

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

    console.log(`useNotifications: Setting up realtime subscription for user ${userId}`);
    const channel = supabase
      .channel(`notifications-changes-${userId}`) // Unique channel name per user
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('New notification received via realtime:', payload);
          const newNotification = payload.new as Notification & { category: string };
          
          // Ensure category exists
          const processedNotification = {
            ...newNotification,
            category: newNotification.category || 'personal'
          };
          
          setNotifications(prev => [processedNotification, ...prev.filter(n => n.id !== processedNotification.id)]);
          
          // Only increment unread count if notification is for the current mode
          if (!processedNotification.is_read && processedNotification.category === currentMode) {
            setUnreadCount(prev => prev + 1);
          }
          
          toast.info(
            processedNotification.title,
            { description: processedNotification.message }
          );
        }
      )
      .on( // Also listen for updates (e.g., if a notification is marked as read elsewhere)
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Notification update received via realtime:', payload);
          fetchNotifications(); // Refetch all to ensure consistency
        }
      )
      .on( // Listen for deletes
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Notification delete received via realtime:', payload);
          fetchNotifications(); // Refetch all
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log(`useNotifications: Successfully subscribed to notifications for user ${userId}`);
        }
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.error(`useNotifications: Subscription error for user ${userId}:`, status, err);
        }
      });

    return () => {
      console.log(`useNotifications: Removing realtime channel subscription for user ${userId}`);
      supabase.removeChannel(channel);
    };
  }, [userId, fetchNotifications, currentMode]);

  // When entrepreneur mode changes, update unread count
  useEffect(() => {
    if (notifications.length > 0) {
      const modeFilteredNotifications = notifications.filter(n => n.category === currentMode);
      setUnreadCount(modeFilteredNotifications.filter(n => !n.is_read).length);
    }
  }, [currentMode, notifications]);

  return {
    notifications,
    currentModeNotifications: getCurrentModeNotifications(),
    unreadNotifications: getUnreadCurrentModeNotifications(),
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    fetchNotifications
  };
};
