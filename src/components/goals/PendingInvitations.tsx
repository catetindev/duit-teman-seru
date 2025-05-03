
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, XCircle, Target } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { useCollaboratorApi } from '@/hooks/goals/collaboratorApi';

interface Invitation {
  id: string;
  goal_id: string;
  created_at: string;
  expires_at: string;
  status: string;
  savings_goals: {
    title: string;
    emoji: string;
  };
  profiles: {
    full_name: string;
  };
}

const PendingInvitations: React.FC = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { respondToInvitation } = useCollaboratorApi();
  
  const fetchInvitations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('goal_invitations')
        .select(`
          id, 
          goal_id,
          created_at,
          expires_at,
          status,
          savings_goals (title, emoji),
          profiles:inviter_id (full_name)
        `)
        .eq('invitee_id', user.id)
        .eq('status', 'pending');
      
      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      toast({
        title: "Error",
        description: "Failed to load invitations",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchInvitations();
  }, [user]);
  
  const handleResponse = async (invitationId: string, accept: boolean) => {
    try {
      await respondToInvitation(invitationId, accept);
      // Refresh the list after response
      fetchInvitations();
    } catch (error) {
      console.error('Error responding to invitation:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="mt-6 flex justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (invitations.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-medium">Pending Invitations</h3>
      <div className="space-y-3">
        {invitations.map(invitation => (
          <Card key={invitation.id} className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-primary/10 p-2">
                  <span className="text-xl">{invitation.savings_goals.emoji || '🎯'}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{invitation.savings_goals.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatDistance(new Date(invitation.created_at), new Date(), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    {invitation.profiles.full_name} has invited you to collaborate on this goal
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleResponse(invitation.id, false)}
                      className="h-8 text-xs flex items-center gap-1"
                    >
                      <XCircle className="h-3 w-3" /> Decline
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleResponse(invitation.id, true)}
                      className="h-8 text-xs flex items-center gap-1"
                    >
                      <CheckCircle className="h-3 w-3" /> Accept
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PendingInvitations;
