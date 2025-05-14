
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NotificationList from '@/components/notifications/NotificationList';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export default function Notifications() {
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [unreadOnly, setUnreadOnly] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notifications',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      if (error) throw error;

      // Update local state
      setNotifications(
        notifications.map((notif) => ({ ...notif, is_read: true }))
      );

      toast({
        title: 'Success',
        description: 'All notifications marked as read',
      });
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notifications as read',
        variant: 'destructive',
      });
    }
  };

  const createSampleNotification = async () => {
    if (!user) return;

    try {
      const { error } = await supabase.from('notifications').insert({
        user_id: user.id,
        title: 'Sample Notification',
        message: 'This is a sample notification for testing purposes.',
        type: 'info',
      });

      if (error) throw error;
      fetchNotifications();
      
      toast({
        title: 'Success',
        description: 'Sample notification created',
      });
    } catch (error) {
      console.error('Error creating sample notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to create sample notification',
        variant: 'destructive',
      });
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (unreadOnly && notification.is_read) return false;
    if (activeTab !== 'all' && notification.type !== activeTab) return false;
    return true;
  });

  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Notifications</h1>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex items-center space-x-2">
              <Switch
                id="unread-only"
                checked={unreadOnly}
                onCheckedChange={setUnreadOnly}
              />
              <Label htmlFor="unread-only">Show unread only</Label>
            </div>
            
            <Button
              variant="outline"
              onClick={markAllAsRead}
              disabled={loading || notifications.every((n) => n.is_read)}
            >
              Mark all as read
            </Button>
            
            {/* Only show the Create Sample button for admin users */}
            {isAdmin && (
              <Button variant="outline" onClick={createSampleNotification}>
                Create sample notification
              </Button>
            )}
          </div>
        </div>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-6"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
            <TabsTrigger value="warning">Warnings</TabsTrigger>
            <TabsTrigger value="success">Success</TabsTrigger>
            <TabsTrigger value="error">Errors</TabsTrigger>
          </TabsList>
        </Tabs>

        <NotificationList
          notifications={filteredNotifications}
          loading={loading}
          onRefresh={fetchNotifications}
        />
      </div>
    </DashboardLayout>
  );
}
