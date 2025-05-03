import { supabase } from '@/integrations/supabase/client';
import { Collaborator, GoalInvitation } from './types';
import { useToast } from '@/hooks/use-toast';

export function useCollaboratorApi() {
  const { toast } = useToast();

  const fetchCollaborators = async (goalId: string): Promise<Collaborator[]> => {
    try {
      console.log('Fetching collaborators for goal:', goalId);
      
      // First check if goal exists
      const { data: goalData, error: goalError } = await supabase
        .from('savings_goals')
        .select('id')
        .eq('id', goalId)
        .single();
        
      if (goalError) {
        console.error('Error finding goal:', goalError);
        throw new Error('Goal not found');
      }
      
      // Now that we have the goal_collaborators table, we can query it directly
      const { data: collaborators, error } = await supabase
        .from('goal_collaborators')
        .select('user_id')
        .eq('goal_id', goalId);
        
      if (error) {
        console.error('Error fetching collaborators:', error);
        throw error;
      }
      
      if (!collaborators || collaborators.length === 0) {
        return []; // Return empty array if no collaborators
      }
      
      // Get the profiles data for all collaborators
      const userIds = collaborators.map(col => col.user_id);
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', userIds);
        
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        throw profilesError;
      }
      
      // Convert to expected format
      const formattedCollaborators: Collaborator[] = profiles.map(profile => ({
        user_id: profile.id,
        email: profile.email,
        full_name: profile.full_name
      }));
      
      return formattedCollaborators;
    } catch (error: any) {
      console.error('Error fetching collaborators:', error);
      toast({
        title: "Error",
        description: "Failed to load collaborators: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
      return []; // Return empty array instead of throwing to prevent cascading errors
    }
  };

  const inviteCollaborator = async (goalId: string, email: string): Promise<boolean> => {
    try {
      // Find the goal details (needed for notification)
      const { data: goalData, error: goalError } = await supabase
        .from('savings_goals')
        .select('title, user_id')
        .eq('id', goalId)
        .single();
      
      if (goalError) {
        console.error('Error finding goal:', goalError);
        throw new Error('Goal not found');
      }
      
      // Find the inviter's profile
      const { data: inviterProfile, error: inviterError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', goalData.user_id)
        .single();
        
      if (inviterError) {
        console.error('Error finding inviter profile:', inviterError);
        throw inviterError;
      }
      
      // Find the user by email - FIX: use case-insensitive search with ilike
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

  const respondToInvitation = async (invitationId: string, accept: boolean): Promise<boolean> => {
    try {
      // Get invitation details
      const { data: invitation, error: inviteError } = await supabase
        .from('goal_invitations')
        .select('goal_id, invitee_id, inviter_id, status')
        .eq('id', invitationId)
        .single();
        
      if (inviteError) {
        console.error('Error finding invitation:', inviteError);
        throw inviteError;
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
        
        // Add the collaborator - using RPC function to bypass RLS
        const { data: goalData, error: goalError } = await supabase
          .rpc('add_collaborator', { 
            p_goal_id: invitation.goal_id, 
            p_user_id: invitation.invitee_id 
          });
          
        if (goalError) {
          console.error('Error adding collaborator:', goalError);
          throw goalError;
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

  const fetchPendingInvitations = async (): Promise<any[]> => {
    try {
      // Get the current user's ID
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user found');
        return [];
      }
      
      // Get user's pending invitations
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
        .lt('expires_at', new Date().toISOString());
        
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

  const removeCollaborator = async (goalId: string, userId: string): Promise<boolean> => {
    try {
      // Remove the collaborator
      const { error } = await supabase
        .from('goal_collaborators')
        .delete()
        .eq('goal_id', goalId)
        .eq('user_id', userId);
        
      if (error) {
        console.error('Error removing collaborator:', error);
        throw error;
      }
      
      return true;
    } catch (error: any) {
      console.error('Error removing collaborator:', error);
      toast({
        title: "Error",
        description: "Failed to remove collaborator: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    fetchCollaborators,
    inviteCollaborator,
    removeCollaborator,
    respondToInvitation,
    fetchPendingInvitations
  };
}
