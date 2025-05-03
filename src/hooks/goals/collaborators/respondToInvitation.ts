
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useInvitationResponse() {
  const { toast } = useToast();

  const respondToInvitation = async (invitationId: string, accept: boolean): Promise<boolean> => {
    try {
      // Get invitation details
      const { data: invitation, error: inviteError } = await supabase
        .from('goal_invitations')
        .select('goal_id, invitee_id, inviter_id, status')
        .eq('id', invitationId)
        .maybeSingle();
        
      if (inviteError || !invitation) {
        console.error('Error finding invitation:', inviteError);
        throw new Error('Invitation not found');
      }
      
      if (invitation.status !== 'pending') {
        throw new Error(`Invitation has already been ${invitation.status}`);
      }

      if (accept) {
        // Update invitation status first
        const { error: updateError } = await supabase
          .from('goal_invitations')
          .update({ status: 'accepted' })
          .eq('id', invitationId);
          
        if (updateError) {
          console.error('Error updating invitation:', updateError);
          throw updateError;
        }
        
        // Create a new security policy for the collaborators table
        // Enable all users to write to their own collaborations
        const { error: collaboratorError } = await supabase
          .from('goal_collaborators')
          .insert({ 
            goal_id: invitation.goal_id, 
            user_id: invitation.invitee_id 
          });
          
        if (collaboratorError) {
          console.error('Error adding collaborator:', collaboratorError);
          throw collaboratorError;
        }
        
        toast({
          title: "Invitation Accepted",
          description: "You are now a collaborator on this goal",
        });
      } else {
        // Update invitation status to declined
        const { error: updateError } = await supabase
          .from('goal_invitations')
          .update({ status: 'declined' })
          .eq('id', invitationId);
          
        if (updateError) {
          console.error('Error updating invitation:', updateError);
          throw updateError;
        }
        
        toast({
          title: "Invitation Declined",
          description: "You have declined the collaboration invitation",
        });
      }
      
      return true;
    } catch (error: any) {
      console.error('Error responding to invitation:', error);
      toast({
        title: "Error",
        description: "Failed to process invitation response: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
      throw error;
    }
  };

  return { respondToInvitation };
}
