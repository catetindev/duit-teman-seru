
import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NotificationList from '@/components/notifications/NotificationList';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Bell, Settings, Filter, RefreshCw } from 'lucide-react';

export default function Notifications() {
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  const [unreadOnly, setUnreadOnly] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isAdmin = user?.role === 'admin';

  const {
    currentModeNotifications: notifications,
    loading,
    unreadCount,
    markAsRead: handleMarkAsRead,
    markAllAsRead,
    fetchNotifications
  } = useNotifications(user?.id);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchNotifications();
    setIsRefreshing(false);
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
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Bell className="h-8 w-8 text-blue-600" />
                Notifications
                {unreadCount > 0 && (
                  <Badge 
                    variant="default" 
                    className="px-3 py-1 rounded-full text-sm font-semibold bg-red-500 text-white"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </h1>
              <p className="text-muted-foreground text-lg">
                Stay updated with your latest notifications and alerts
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2"
              >
                <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                Refresh
              </Button>
              
              {isAdmin && (
                <Button 
                  variant="outline" 
                  onClick={createSampleNotification}
                  size="sm"
                >
                  Create Sample
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Controls Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="h-5 w-5" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex items-center space-x-3">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Switch
                  id="unread-only"
                  checked={unreadOnly}
                  onCheckedChange={setUnreadOnly}
                />
                <Label htmlFor="unread-only" className="text-sm font-medium">
                  Show unread only
                </Label>
              </div>
              
              <Button
                variant="default"
                onClick={markAllAsRead}
                disabled={loading || notifications.every((n) => n.is_read)}
                size="sm"
              >
                Mark all as read
              </Button>
            </div>

            {/* Type Filter Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
                <TabsTrigger value="info" className="text-xs sm:text-sm">Info</TabsTrigger>
                <TabsTrigger value="warning" className="text-xs sm:text-sm">Warnings</TabsTrigger>
                <TabsTrigger value="success" className="text-xs sm:text-sm">Success</TabsTrigger>
                <TabsTrigger value="error" className="text-xs sm:text-sm">Errors</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Notifications List Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <span>Your Notifications</span>
              <Badge variant="outline" className="text-xs">
                {filteredNotifications.length} notifications
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <NotificationList
              notifications={filteredNotifications}
              loading={loading}
              onMarkAsRead={handleMarkAsRead}
              onRefresh={fetchNotifications}
              showRefresh={false}
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
