
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useInviteCollaborator() {
  const { toast } = useToast();

  const inviteCollaborator = async (goalId: string, email: string): Promise<boolean> => {
    try {
      // Find the goal details (needed for notification)
      const { data: goalData, error: goalError } = await supabase
        .from('savings_goals')
        .select('title, user_id')
        .eq('id', goalId)
        .maybeSingle();
      
      if (goalError || !goalData) {
        console.error('Error finding goal:', goalError);
        throw new Error('Goal not found');
      }
      
      // Find the inviter's profile
      const { data: inviterProfile, error: inviterError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', goalData.user_id)
        .maybeSingle();
        
      if (inviterError || !inviterProfile) {
        console.error('Error finding inviter profile:', inviterError);
        throw new Error('Inviter profile not found');
      }
      
      // Find the user by email - using case-insensitive search with ilike
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, email')
        .ilike('email', email)
        .maybeSingle();
      
      if (userError) {
        console.error('Error finding user:', userError);
        throw userError;
      }
      
      if (!userData) {
        throw new Error('User not found with that email');
      }
      
      // Check if this user is already a collaborator
      const { data: existingCollaborator, error: existingError } = await supabase
        .from('goal_collaborators')
        .select('id')
        .eq('goal_id', goalId)
        .eq('user_id', userData.id)
        .maybeSingle();
        
      if (existingError) {
        console.error('Error checking existing collaborator:', existingError);
        throw existingError;
      }
      
      if (existingCollaborator) {
        throw new Error('This user is already a collaborator');
      }
      
      // Check if there's already a pending invitation
      const { data: existingInvite, error: inviteExistsError } = await supabase
        .from('goal_invitations')
        .select('id, status')
        .eq('goal_id', goalId)
        .eq('invitee_id', userData.id)
        .maybeSingle();
        
      if (inviteExistsError) {
        console.error('Error checking existing invitation:', inviteExistsError);
        throw inviteExistsError;
      }
      
      // If invitation exists but was declined, allow resending
      let inviteId;
      if (existingInvite) {
        if (existingInvite.status === 'pending') {
          throw new Error('This user already has a pending invitation');
        }
        
        // Update the existing invitation
        const { data, error: updateError } = await supabase
          .from('goal_invitations')
          .update({ 
            status: 'pending', 
            expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString() 
          })
          .eq('id', existingInvite.id)
          .select('id')
          .single();
          
        if (updateError) {
          console.error('Error updating invitation:', updateError);
          throw updateError;
        }
        
        inviteId = data.id;
      } else {
        // Create a new invitation with expiration date (3 days from now)
        const { data, error: inviteError } = await supabase
          .from('goal_invitations')
          .insert({
            goal_id: goalId,
            inviter_id: goalData.user_id,
            invitee_id: userData.id,
            status: 'pending',
            expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
          })
          .select('id')
          .single();
          
        if (inviteError) {
          console.error('Error creating invitation:', inviteError);
          throw inviteError;
        }
        
        inviteId = data.id;
      }
      
      // Create notification for the user
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: userData.id,
          title: 'Goal Collaboration Invitation',
          message: `${inviterProfile.full_name} has invited you to collaborate on the savings goal "${goalData.title}"`,
          type: 'goal',
          action_data: JSON.stringify({
            type: 'goal_invitation',
            invitation_id: inviteId,
            goal_id: goalId,
            goal_title: goalData.title
          })
        });
        
      if (notificationError) {
        console.error('Error creating notification:', notificationError);
        // Don't throw here, we've successfully created the invitation
      }
      
      toast({
        title: "Invitation Sent",
        description: `An invitation has been sent to ${email}`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Error inviting collaborator:', error);
      toast({
        title: "Error",
        description: "Failed to send invitation: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
      throw error;
    }
  };

  return { inviteCollaborator };
}
