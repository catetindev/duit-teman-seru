import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NotificationList from '@/components/notifications/NotificationList';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { supabase } from '@/integrations/supabase/client';

export default function Notifications() {
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  const [unreadOnly, setUnreadOnly] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const isAdmin = user?.role === 'admin';

  const {
    currentModeNotifications: notifications,
    loading,
    markAsRead: handleMarkAsRead,
    markAllAsRead,
    fetchNotifications
  } = useNotifications(user?.id);

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
          onMarkAsRead={handleMarkAsRead}
          onRefresh={fetchNotifications}
        />
      </div>
    </DashboardLayout>
  );
}
