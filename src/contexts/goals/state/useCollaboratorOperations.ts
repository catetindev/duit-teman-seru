
import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Collaborator } from '@/hooks/goals/types';

export function useCollaboratorOperations() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to fetch collaborators for a goal
  const fetchCollaborators = useCallback(async (goalId: string): Promise<Collaborator[]> => {
    try {
      // First, get user_ids from goal_collaborators
      const { data: collaboratorsData, error: collaboratorsError } = await supabase
        .from('goal_collaborators')
        .select('user_id')
        .eq('goal_id', goalId);
        
      if (collaboratorsError) throw collaboratorsError;
      
      if (!collaboratorsData || collaboratorsData.length === 0) {
        return [];
      }
      
      // Then, get the user details for each user_id
      const userIds = collaboratorsData.map(item => item.user_id);
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .in('id', userIds);
        
      if (usersError) throw usersError;
      
      // Transform the data to match the Collaborator type
      const collaborators: Collaborator[] = usersData.map(user => ({
        user_id: user.id,
        email: user.email,
        full_name: user.full_name
      }));
        
      return collaborators;
    } catch (error: any) {
      console.error("Failed to fetch collaborators:", error);
      toast(error.message || "Failed to load collaborators");
      return [];
    }
  }, []);

  // Function to invite a collaborator
  const inviteCollaborator = useCallback(async (goalId: string, email: string): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      
      // Check if the user with the given email exists
      const { data: users, error: userError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email);

      if (userError) {
        throw userError;
      }

      if (!users || users.length === 0) {
        throw new Error('User with this email does not exist');
      }

      const user = users[0];

      // Check if the user is already a collaborator
      const { data: existingCollaborators, error: collabError } = await supabase
        .from('goal_collaborators')
        .select('*')
        .eq('goal_id', goalId)
        .eq('user_id', user.id);

      if (collabError) {
        throw collabError;
      }

      if (existingCollaborators && existingCollaborators.length > 0) {
        throw new Error('User is already a collaborator');
      }

      // Invite the collaborator
      const { error: inviteError } = await supabase
        .from('goal_collaborators')
        .insert([
          {
            goal_id: goalId,
            user_id: user.id,
          }
        ]);

      if (inviteError) {
        throw inviteError;
      }
      
      toast(`Collaborator invited successfully: ${email}`);
      return true;
    } catch (error: any) {
      console.error('Error inviting collaborator:', error);
      toast(error.message || "Failed to invite collaborator");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  // Function to remove a collaborator
  const removeCollaborator = useCallback(async (goalId: string, userId: string): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('goal_collaborators')
        .delete()
        .eq('goal_id', goalId)
        .eq('user_id', userId);

      if (error) {
        throw error;
      }
      
      toast("Collaborator removed successfully");
      return true;
    } catch (error: any) {
      console.error('Error removing collaborator:', error);
      toast(error.message || "Failed to remove collaborator");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    isSubmitting,
    setIsSubmitting,
    fetchCollaborators,
    inviteCollaborator,
    removeCollaborator
  };
}
