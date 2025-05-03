
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
      
      // Get user's pending invitations that have not expired
      const { data: invitations, error } = await supabase
        .from('goal_invitations')
        .select(`
          id,
          goal_id,
          inviter_id,
          invitee_id,
          status,
          created_at,
          expires_at,
          savings_goals:goal_id (title, emoji),
          profiles:inviter_id (full_name)
        `)
        .eq('invitee_id', user.id)
        .eq('status', 'pending')
        .gte('expires_at', new Date().toISOString());
        
      if (error) {
        console.error('Error fetching invitations:', error);
        throw error;
      }
      
      // Transform the data to match our expected structure
      const formattedInvitations = invitations?.map(invitation => ({
        id: invitation.id,
        goal_id: invitation.goal_id,
        inviter_id: invitation.inviter_id,
        invitee_id: invitation.invitee_id,
        status: invitation.status,
        created_at: invitation.created_at,
        expires_at: invitation.expires_at,
        goal: {
          title: invitation.savings_goals?.title || 'Unknown Goal',
          emoji: invitation.savings_goals?.emoji || '🎯'
        },
        inviter: {
          full_name: invitation.profiles?.full_name || 'Unknown User'
        }
      })) || [];
      
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
