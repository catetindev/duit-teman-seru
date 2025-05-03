
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { InvitationWithDetails } from '../types';

export function useFetchInvitations() {
  const { toast } = useToast();

  const fetchPendingInvitations = async (): Promise<InvitationWithDetails[]> => {
    try {
      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user found');
        return [];
      }
      
      // First, fetch the invitations
      const { data: invitations, error } = await supabase
        .from('goal_invitations')
        .select(`
          id,
          goal_id,
          inviter_id,
          invitee_id,
          status,
          created_at,
          expires_at
        `)
        .eq('invitee_id', user.id)
        .eq('status', 'pending')
        .gte('expires_at', new Date().toISOString());
        
      if (error) {
        console.error('Error fetching invitations:', error);
        throw error;
      }

      if (!invitations || invitations.length === 0) {
        return [];
      }
      
      // Get goal details separately
      const goalIds = [...new Set(invitations.map(inv => inv.goal_id))];
      const { data: goalsData, error: goalsError } = await supabase
        .from('savings_goals')
        .select('id, title, emoji')
        .in('id', goalIds);
        
      if (goalsError) {
        console.error('Error fetching goals:', goalsError);
        throw goalsError;
      }
      
      // Get inviter profiles separately
      const inviterIds = [...new Set(invitations.map(inv => inv.inviter_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', inviterIds);
        
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }
      
      // Create lookup maps for efficient access
      const goalsMap = (goalsData || []).reduce((map, goal) => {
        map[goal.id] = goal;
        return map;
      }, {} as Record<string, { id: string, title: string, emoji: string }>);
      
      const profilesMap = (profilesData || []).reduce((map, profile) => {
        map[profile.id] = profile;
        return map;
      }, {} as Record<string, { id: string, full_name: string }>);
      
      // Transform the data to match our expected structure with proper typing
      const formattedInvitations = invitations.map(invitation => {
        const goalInfo = goalsMap[invitation.goal_id] || { title: 'Unknown Goal', emoji: '🎯' };
        const inviterInfo = profilesMap[invitation.inviter_id] || { full_name: 'Unknown User' };
        
        return {
          id: invitation.id,
          goal_id: invitation.goal_id,
          inviter_id: invitation.inviter_id,
          invitee_id: invitation.invitee_id,
          status: invitation.status as 'pending' | 'accepted' | 'declined' | 'expired',
          created_at: invitation.created_at,
          expires_at: invitation.expires_at,
          goal: {
            title: goalInfo.title,
            emoji: goalInfo.emoji
          },
          inviter: {
            full_name: inviterInfo.full_name
          }
        };
      });
      
      return formattedInvitations;
    } catch (error: any) {
      console.error('Error fetching invitations:', error);
      toast({
        title: "Error",
        description: "Failed to load invitations: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
      return [];
    }
  };

  return { fetchPendingInvitations };
}
