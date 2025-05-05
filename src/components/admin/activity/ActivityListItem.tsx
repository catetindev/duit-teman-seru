
import React from 'react';
import { Users, Bell, UserCheck, Award, AlertTriangle } from 'lucide-react';

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

interface ActivityListItemProps {
  log: ActivityLog;
}

const ActivityListItem: React.FC<ActivityListItemProps> = ({ log }) => {
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
    <li className="flex gap-3 items-start pb-3 border-b">
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
  );
};

export default ActivityListItem;
