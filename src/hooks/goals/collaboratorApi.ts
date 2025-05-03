
import { supabase } from '@/integrations/supabase/client';
import { Collaborator } from './types';

export function useCollaboratorApi() {
  const fetchCollaborators = async (goalId: string): Promise<Collaborator[]> => {
    try {
      const { data, error } = await supabase
        .from('goal_collaborators')
        .select(`
          user_id,
          profiles(
            id,
            email,
            full_name
          )
        `)
        .eq('goal_id', goalId);
      
      if (error) throw error;
      
      if (!data || data.length === 0) return [];
      
      // Process the data to match the Collaborator interface
      return data.map(item => {
        // Check if profiles exists and handle possible null values
        const profiles = item.profiles as any;
        return {
          user_id: item.user_id,
          email: profiles?.email || 'Unknown Email',
          full_name: profiles?.full_name || 'Unknown User'
        };
      });
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      throw error;
    }
  };

  const addCollaborator = async (goalId: string, email: string): Promise<boolean> => {
    try {
      // First, find the user by email
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, email, full_name')
        .eq('email', email)
        .single();
      
      if (userError) throw userError;
      
      if (!userData) {
        throw new Error('User not found with that email');
      }
      
      // Check if the user is already a collaborator
      const { data: existingCollab, error: collabError } = await supabase
        .from('goal_collaborators')
        .select()
        .eq('goal_id', goalId)
        .eq('user_id', userData.id);
      
      if (collabError) throw collabError;
      
      if (existingCollab && existingCollab.length > 0) {
        throw new Error('This user is already a collaborator');
      }
      
      // Add the user as a collaborator
      const { error: insertError } = await supabase
        .from('goal_collaborators')
        .insert({
          goal_id: goalId,
          user_id: userData.id
        });
      
      if (insertError) throw insertError;
      
      // Return true to indicate success
      return true;
    } catch (error) {
      console.error('Error adding collaborator:', error);
      throw error;
    }
  };

  const removeCollaborator = async (goalId: string, userId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('goal_collaborators')
        .delete()
        .eq('goal_id', goalId)
        .eq('user_id', userId);
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error removing collaborator:', error);
      throw error;
    }
  };

  return {
    fetchCollaborators,
    addCollaborator,
    removeCollaborator
  };
}
