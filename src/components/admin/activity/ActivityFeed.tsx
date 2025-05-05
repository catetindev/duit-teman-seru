
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ChevronRight, Activity as ActivityIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import ActivityListItem from './ActivityListItem';

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
              <ActivityListItem key={log.id} log={log} />
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
