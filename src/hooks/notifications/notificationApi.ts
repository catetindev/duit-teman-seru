
import { supabase } from '@/integrations/supabase/client';
import { Notification } from './types';
import { toast } from 'sonner';
import { RealtimeChannel } from '@supabase/supabase-js';

// Explicitly define the columns to select for notifications
const NOTIFICATION_SELECT_COLUMNS = 'id, title, message, type, created_at, is_read, action_data';

export const fetchNotificationsFromApi = async (userId: string | undefined): Promise<Notification[]> => {
  if (!userId) {
    console.log("notificationApi: No userId provided, skipping fetch.");
    return [];
  }
  
  try {
    console.log(`notificationApi: Fetching notifications for user ${userId}`);
    const { data, error } = await supabase
      .from('notifications')
      .select(NOTIFICATION_SELECT_COLUMNS)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('notificationApi: Supabase error fetching notifications:', error);
      throw error;
    }

    if (data) {
      console.log('notificationApi: Notifications fetched successfully:', data.length);
      // Process fetched data with explicit typing and assign a default category
      const processedData: Notification[] = data.map(item => ({
          id: item.id,
          title: item.title,
          message: item.message,
          type: item.type,
          created_at: item.created_at,
          is_read: item.is_read,
          action_data: item.action_data,
          // Since category doesn't exist in the database yet, we'll default it based on type
          category: item.type === 'business' ? 'business' : 'personal'
      }));
      
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
    // Simplify the operation to avoid excessive type instantiation
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
    // Since we don't have a category column yet, we'll update all notifications for the user
    // In the future, when category is added, we can modify this to filter by category
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false);

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
): RealtimeChannel | null => {
  if (!userId) {
    return null;
  }
  
  console.log(`notificationApi: Setting up realtime subscription for user ${userId}`);
  const channel = supabase
    .channel(`notifications-changes-${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload: any) => {
        console.log('New notification received via realtime:', payload);
        // Explicitly type and process the payload
        const newNotification = {
          id: payload.new.id,
          title: payload.new.title,
          message: payload.new.message,
          type: payload.new.type,
          created_at: payload.new.created_at,
          is_read: payload.new.is_read,
          action_data: payload.new.action_data,
          // Default to personal since category doesn't exist yet
          category: 'personal'
        } as Notification;
        
        onNewNotification(newNotification);
        
        toast.info(
          newNotification.title,
          { description: newNotification.message }
        );
      }
    )
    .on(
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
    .on(
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
