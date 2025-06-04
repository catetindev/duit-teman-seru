
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
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Bell } from 'lucide-react';

export default function Notifications() {
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  const [unreadOnly, setUnreadOnly] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const isAdmin = user?.role === 'admin';

  const {
    currentModeNotifications: notifications,
    loading,
    unreadCount,
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
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Bell className="h-8 w-8" />
            Notifications
            {unreadCount > 0 && (
              <Badge 
                variant="default" 
                className={cn(
                  "px-3 py-1 rounded-full text-sm font-semibold",
                  "bg-purple-500 text-white"
                )}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </h1>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center space-x-3">
              <Switch
                id="unread-only"
                checked={unreadOnly}
                onCheckedChange={setUnreadOnly}
              />
              <Label htmlFor="unread-only" className="text-base">Show unread only</Label>
            </div>
            
            <Button
              variant="outline"
              onClick={markAllAsRead}
              disabled={loading || notifications.every((n) => n.is_read)}
              className="px-6 py-3"
            >
              Mark all as read
            </Button>
            
            {/* Only show the Create Sample button for admin users */}
            {isAdmin && (
              <Button variant="outline" onClick={createSampleNotification} className="px-6 py-3">
                Create sample notification
              </Button>
            )}
          </div>
        </div>

        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-5 sm:w-auto sm:grid-cols-none">
            <TabsTrigger value="all" className="px-4 py-3">All</TabsTrigger>
            <TabsTrigger value="info" className="px-4 py-3">Info</TabsTrigger>
            <TabsTrigger value="warning" className="px-4 py-3">Warnings</TabsTrigger>
            <TabsTrigger value="success" className="px-4 py-3">Success</TabsTrigger>
            <TabsTrigger value="error" className="px-4 py-3">Errors</TabsTrigger>
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
