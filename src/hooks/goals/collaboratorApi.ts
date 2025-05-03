
import { supabase } from '@/integrations/supabase/client';
import { Collaborator } from './types';

export function useCollaboratorApi() {
  const fetchCollaborators = async (goalId: string): Promise<Collaborator[]> => {
    try {
      const { data, error } = await supabase
        .from('goal_collaborators')
        .select(`
          user_id,
          profiles:profiles(email, full_name)
        `)
        .eq('goal_id', goalId);
      
      if (error) throw error;
      
      // Transform to a more user-friendly format
      const collaborators: Collaborator[] = (data || [])
        .filter(item => item.profiles) // Make sure profiles exists
        .map(item => ({
          user_id: item.user_id,
          email: item.profiles?.email || '',
          full_name: item.profiles?.full_name || ''
        }));
      
      return collaborators;
    } catch (error) {
      console.error('Error in fetchCollaborators:', error);
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
        .maybeSingle();
      
      if (userError) throw userError;
      
      if (!userData) {
        throw new Error(`User with email ${email} not found`);
      }
      
      // Check if collaboration already exists
      const { data: existingData, error: checkError } = await supabase
        .from('goal_collaborators')
        .select('*')
        .eq('goal_id', goalId)
        .eq('user_id', userData.id)
        .maybeSingle();
        
      if (checkError) throw checkError;
      
      if (existingData) {
        return true; // Already a collaborator
      }
      
      // Add collaborator
      const { error } = await supabase
        .from('goal_collaborators')
        .insert({
          goal_id: goalId,
          user_id: userData.id
        });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error in addCollaborator:', error);
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
      console.error('Error in removeCollaborator:', error);
      throw error;
    }
  };

  return {
    fetchCollaborators,
    addCollaborator,
    removeCollaborator
  };
}
