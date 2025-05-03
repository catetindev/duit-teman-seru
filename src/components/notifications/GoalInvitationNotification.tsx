
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Target } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { useCollaboratorApi } from '@/hooks/goals/collaboratorApi';

interface GoalInvitationNotificationProps {
  notification: {
    id: string;
    created_at: string;
    action_data: string;
    is_read: boolean;
  };
  onProcessed: () => void;
}

const GoalInvitationNotification: React.FC<GoalInvitationNotificationProps> = ({ 
  notification, 
  onProcessed
}) => {
  const { respondToInvitation } = useCollaboratorApi();
  const [isProcessing, setIsProcessing] = React.useState(false);
  
  // Parse the action data
  const actionData = React.useMemo(() => {
    try {
      return JSON.parse(notification.action_data || '{}');
    } catch (e) {
      console.error('Failed to parse action data:', e);
      return { type: 'unknown' };
    }
  }, [notification.action_data]);
  
  // Only process if this is a goal invitation
  if (actionData.type !== 'goal_invitation') {
    return null;
  }
  
  const handleResponse = async (accept: boolean) => {
    setIsProcessing(true);
    try {
      await respondToInvitation(actionData.invitation_id, accept);
      onProcessed();
    } catch (error) {
      console.error('Error responding to invitation:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const timeAgo = formatDistance(
    new Date(notification.created_at),
    new Date(),
    { addSuffix: true }
  );

  return (
    <Card className={`border-l-4 ${notification.is_read ? 'border-l-muted' : 'border-l-primary'}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Target className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-sm">Goal Collaboration Invitation</h4>
              <span className="text-xs text-muted-foreground">{timeAgo}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 mb-3">
              You've been invited to collaborate on the goal "{actionData.goal_title}"
            </p>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleResponse(false)}
                disabled={isProcessing}
                className="h-8 text-xs flex items-center gap-1"
              >
                <XCircle className="h-3 w-3" /> Decline
              </Button>
              <Button 
                size="sm"
                onClick={() => handleResponse(true)}
                disabled={isProcessing}
                className="h-8 text-xs flex items-center gap-1"
              >
                <CheckCircle className="h-3 w-3" /> Accept
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalInvitationNotification;
