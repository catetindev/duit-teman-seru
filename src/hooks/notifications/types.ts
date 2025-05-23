
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  created_at: string;
  is_read: boolean;
  action_data?: string;
  category?: string;
}

export type NotificationsHookReturn = {
  notifications: Notification[];
  currentModeNotifications: Notification[];
  unreadNotifications: Notification[];
  loading: boolean;
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
};
