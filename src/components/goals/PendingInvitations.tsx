
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle, XCircle } from 'lucide-react';
import { formatDistance } from 'date-fns';
import { useCollaboratorApi } from '@/hooks/goals/collaboratorApi';
import { InvitationWithDetails } from '@/hooks/goals/types';

const PendingInvitations: React.FC = () => {
  const [invitations, setInvitations] = useState<InvitationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const { respondToInvitation } = useCollaboratorApi();
  
  const fetchInvitations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // First get all the invitations
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('goal_invitations')
        .select(`
          id, 
          goal_id,
          inviter_id,
          invitee_id,
          created_at,
          expires_at,
          status,
          goals:savings_goals(title, emoji)
        `)
        .eq('invitee_id', user.id)
        .eq('status', 'pending');
      
      if (invitationsError) throw invitationsError;
      
      if (!invitationsData || invitationsData.length === 0) {
        setInvitations([]);
        setLoading(false);
        return;
      }
      
      // Get all unique inviter IDs to fetch their profiles
      const inviterIds = [...new Set(invitationsData.map(invitation => invitation.inviter_id))];
      
      // Get the profiles for all inviters in a separate query
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', inviterIds);
      
      if (profilesError) throw profilesError;
      
      // Create a map of profiles by ID for easy lookup
      const profilesMap = (profilesData || []).reduce((map, profile) => {
        map[profile.id] = profile;
        return map;
      }, {} as Record<string, { id: string, full_name: string }>);
      
      // Transform the data to match our expected structure
      const formattedInvitations = invitationsData.map(item => ({
        id: item.id,
        goal_id: item.goal_id,
        inviter_id: item.inviter_id,
        invitee_id: item.invitee_id,
        status: item.status as 'pending' | 'accepted' | 'declined' | 'expired',
        created_at: item.created_at,
        expires_at: item.expires_at,
        goal: {
          title: item.goals?.title || 'Unknown Goal',
          emoji: item.goals?.emoji || '🎯'
        },
        inviter: {
          full_name: profilesMap[item.inviter_id]?.full_name || 'Unknown User'
        }
      }));
      
      setInvitations(formattedInvitations);
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
                  <span className="text-xl">{invitation.goal.emoji || '🎯'}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{invitation.goal.title}</h4>
                    <span className="text-xs text-muted-foreground">
                      {formatDistance(new Date(invitation.created_at), new Date(), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    {invitation.inviter.full_name} has invited you to collaborate on this goal
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
