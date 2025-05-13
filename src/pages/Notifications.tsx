import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CircleCheck,
  CircleX,
  CheckCheck,
  Trash2,
  Bell,
  Target,
  AlertTriangle
} from 'lucide-react';
import GoalInvitationNotification from '@/components/notifications/GoalInvitationNotification';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  action_data?: string; // Make action_data optional to match the database
}

const NotificationsPage = () => {
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  
  const {
    data: notifications = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      return data as Notification[];
    },
    enabled: !!user?.id,
  });

  // Set up real-time subscription
  useEffect(() => {
    if (!user?.id) return;
    
    const channel = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Notification change detected:', payload);
          refetch();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, refetch]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CircleCheck className="h-6 w-6 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-orange-500" />;
      case 'error':
        return <CircleX className="h-6 w-6 text-red-500" />;
      case 'goal':
        return <Target className="h-6 w-6 text-purple-500" />;
      default:
        return <Bell className="h-6 w-6 text-blue-500" />;
    }
  };

  const getNotificationEmoji = (type: string) => {
    switch (type) {
      case 'success': return '🎉';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'goal': return '🎯';
      default: return '📢';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
        
      if (error) throw error;
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to mark notification as read",
        variant: "destructive"
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user?.id)
        .eq('is_read', false);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "All notifications marked as read",
        variant: "default"
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to mark all notifications as read",
        variant: "destructive"
      });
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete notification",
        variant: "destructive"
      });
    }
  };

  const clearAllNotifications = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user?.id);
        
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "All notifications cleared",
        variant: "default"
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to clear notifications",
        variant: "destructive"
      });
    }
  };

  // Check if a notification is a goal invitation
  const isGoalInvitation = (notification: Notification): boolean => {
    if (!notification.action_data) return false;
    try {
      const actionData = JSON.parse(notification.action_data);
      return actionData.type === 'goal_invitation';
    } catch (e) {
      return false;
    }
  };

  const hasUnread = notifications.some(n => !n.is_read);

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground mt-1">Stay updated on important events</p>
        </div>
        {notifications.length > 0 && (
          <div className="flex space-x-2">
            {hasUnread && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={markAllAsRead}
                className="flex items-center gap-1"
              >
                <CheckCheck className="h-4 w-4" />
                Mark all read
              </Button>
            )}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAllNotifications}
              className="flex items-center gap-1"
            >
              <Trash2 className="h-4 w-4" />
              Clear all
            </Button>
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <CircleX className="h-10 w-10 text-red-500 mb-2" />
            <p>Failed to load notifications</p>
            <Button onClick={() => refetch()} className="mt-4">
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-5xl mb-4">🔔</div>
            <h3 className="text-xl font-medium mb-2">No Notifications</h3>
            <p className="text-muted-foreground text-center max-w-md">
              You don't have any notifications yet. When you receive updates about your budgets, goals, 
              or other important events, they'll appear here.
            </p>
            <Button 
              variant="outline"
              className="mt-4" 
              onClick={() => {
                // Add a sample notification for demo
                const createNotification = async () => {
                  if (!user?.id) return;
                  try {
                    await supabase.from('notifications').insert({
                      user_id: user.id,
                      title: 'Welcome to Notifications!',
                      message: 'This is a sample notification to show you how they work.',
                      type: 'success'
                    });
                    refetch();
                    toast({
                      title: "Sample notification created",
                      description: "Check it out below",
                    });
                  } catch (error) {
                    console.error('Error creating sample notification:', error);
                  }
                };
                createNotification();
              }}
            >
              Create Sample Notification
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            isGoalInvitation(notification) ? (
              <GoalInvitationNotification 
                key={notification.id} 
                notification={notification} 
                onProcessed={() => {
                  markAsRead(notification.id);
                  refetch();
                }} 
              />
            ) : (
              <Card 
                key={notification.id}
                className={`transition-all ${!notification.is_read ? 'border-l-4 border-l-blue-500' : 'bg-muted/30'}`}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="text-base font-medium truncate">
                          <span className="mr-2">{getNotificationEmoji(notification.type)}</span>
                          {notification.title}
                        </h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(notification.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      
                      <div className="flex justify-end mt-2 gap-2">
                        {!notification.is_read && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-8 text-xs"
                          >
                            Mark as read
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => deleteNotification(notification.id)}
                          className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default NotificationsPage;
