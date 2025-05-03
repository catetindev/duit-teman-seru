
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
      
      return invitations || [];
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
