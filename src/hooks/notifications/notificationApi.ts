
import { supabase } from '@/integrations/supabase/client';
import { Notification } from './types';
import { toast } from 'sonner';

export const fetchNotificationsFromApi = async (userId: string | undefined): Promise<Notification[]> => {
  if (!userId) {
    console.log("notificationApi: No userId provided, skipping fetch.");
    return [];
  }
  
  try {
    console.log(`notificationApi: Fetching notifications for user ${userId}`);
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('notificationApi: Supabase error fetching notifications:', error);
      throw error;
    }

    if (data) {
      console.log('notificationApi: Notifications fetched successfully:', data.length);
      // Process fetched data with explicit typing and default values
      const processedData: Notification[] = [];
      
      for (let i = 0; i < data.length; i++) {
        const notification = data[i];
        processedData.push({
          id: notification.id,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          created_at: notification.created_at,
          is_read: notification.is_read,
          action_data: notification.action_data,
          // Default to 'personal' if category is not set
          category: notification.category || 'personal'
        });
      }
      
      return processedData;
    }
    return [];
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const markNotificationAsRead = async (userId: string | undefined, id: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    // Simplified version to avoid deep type instantiation
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error('Error marking notification as read:', error);
    toast.error("Failed to mark notification as read.");
    return false;
  }
};

export const markAllNotificationsAsRead = async (userId: string | undefined, category: string): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)
      .eq('category', category);

    if (error) throw error;
    
    toast.success("All notifications marked as read.");
    return true;
  } catch (error: any) {
    console.error('Error marking all notifications as read:', error);
    toast.error("Failed to mark all notifications as read.");
    return false;
  }
};

export const subscribeToNotifications = (
  userId: string | undefined,
  onNewNotification: (notification: Notification) => void,
  onUpdateNotification: () => void,
  onDeleteNotification: () => void
) => {
  if (!userId) {
    return null;
  }
  
  console.log(`notificationApi: Setting up realtime subscription for user ${userId}`);
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
        // Create processed notification with proper typing
        const newNotificationData: any = payload.new;
        
        const processedNotification: Notification = {
          id: newNotificationData.id,
          title: newNotificationData.title,
          message: newNotificationData.message,
          type: newNotificationData.type,
          created_at: newNotificationData.created_at,
          is_read: newNotificationData.is_read,
          action_data: newNotificationData.action_data,
          category: newNotificationData.category || 'personal'
        };
        
        onNewNotification(processedNotification);
        
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
      () => {
        console.log('Notification update received via realtime');
        onUpdateNotification();
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
      () => {
        console.log('Notification delete received via realtime');
        onDeleteNotification();
      }
    )
    .subscribe((status, err) => {
      if (status === 'SUBSCRIBED') {
        console.log(`notificationApi: Successfully subscribed to notifications for user ${userId}`);
      }
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        console.error(`notificationApi: Subscription error for user ${userId}:`, status, err);
      }
    });

  return channel;
};
