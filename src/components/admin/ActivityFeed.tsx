
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Users, Bell, UserCheck, Award, AlertTriangle, ChevronRight, Activity as ActivityIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  created_at: string;
  user?: {
    full_name: string;
    email: string;
  } | null;
}

const ActivityFeed = () => {
  // Fetch activity logs
  const {
    data: activityLogs = [],
    isLoading: isLoadingLogs,
  } = useQuery({
    queryKey: ['admin-activity-logs'],
    queryFn: async () => {
      // First, get the activity logs
      const { data: logsData, error: logsError } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (logsError) throw logsError;

      // Then, for each log, get the user details
      const logsWithUsers: ActivityLog[] = await Promise.all(logsData.map(async log => {
        if (!log.user_id) {
          return {
            ...log,
            user: null
          } as ActivityLog;
        }
        
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', log.user_id)
          .single();
          
        return {
          ...log,
          user: userError ? null : userData
        } as ActivityLog;
      }));
      
      return logsWithUsers;
    }
  });

  // Format activity log message for display
  const formatActivityLogMessage = (log: ActivityLog) => {
    const userName = log.user?.full_name || 'Anonymous';
    
    if (log.action.startsWith('created_user')) {
      return `${userName} added a new user`;
    } else if (log.action.startsWith('updated_user')) {
      return `${userName} updated user information`;
    } else if (log.action.startsWith('deleted_user')) {
      return `${userName} deleted a user account`;
    } else if (log.action.startsWith('sent_notification')) {
      return `${userName} sent a notification`;
    } else if (log.action === 'signed_up') {
      return `${userName} signed up`;
    } else if (log.action === 'completed_goal') {
      return `${userName} reached a savings goal`;
    }
    
    return log.action;
  };

  // Get icon for activity log
  const getActivityIcon = (log: ActivityLog) => {
    if (log.action.includes('user')) return <Users className="h-4 w-4" />;
    if (log.action.includes('notification')) return <Bell className="h-4 w-4" />;
    if (log.action === 'signed_up') return <UserCheck className="h-4 w-4" />;
    if (log.action === 'completed_goal') return <Award className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  // Get time ago for activity log
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (secondsAgo < 60) return 'Just now';
    if (secondsAgo < 3600) return `${Math.floor(secondsAgo / 60)} minutes ago`;
    if (secondsAgo < 86400) return `${Math.floor(secondsAgo / 3600)} hours ago`;
    return `${Math.floor(secondsAgo / 86400)} days ago`;
  };

  return (
    <Card className="border-none shadow-md rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
        <CardTitle className="flex items-center gap-2">
          <ActivityIcon className="h-5 w-5" /> Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoadingLogs ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-700"></div>
          </div>
        ) : activityLogs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No activity logs found
          </div>
        ) : (
          <ul className="space-y-3 text-sm">
            {activityLogs.slice(0, 5).map(log => (
              <li key={log.id} className="flex gap-3 items-start pb-3 border-b">
                <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-500">
                  {getActivityIcon(log)}
                </div>
                <div>
                  <p className="font-medium">{formatActivityLogMessage(log)}</p>
                  <p className="text-xs text-muted-foreground">
                    {log.user?.email || 'Unknown email'}
                  </p>
                  <p className="text-xs text-muted-foreground">{getTimeAgo(log.created_at)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" size="sm" className="w-full rounded-full">
          View all activity
          <ChevronRight size={16} className="ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ActivityFeed;
